import Groq from "groq-sdk";
import { transactionAPI } from "@/lib/api";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


const tools = [
  {
    type: "function",
    function: {
      name: "getAllTransactions",
      description: "Dùng để lấy toàn bộ các giao dịch.",
      parameters: {
        type: "object"
      },
    },
  },
  // Có thể thêm nhiều công cụ khác ở đây
];


// Đây là hàm giả lập việc gọi API/DB để lấy dữ liệu thống kê
async function executeTool(toolCall: any, authToken: string) {
  const { name, arguments: args } = toolCall.function;

  if (name === "getAllTransactions") {
    console.log(`Executing getAllTransactions`);
    
		const data = await transactionAPI.getAllTransactions(authToken);
		console.log("Data retrieved from analysisAPI:", data);
    return JSON.stringify({
			status: "success",
			data: data,
    });
  }

  // Xử lý các công cụ khác nếu có
  return JSON.stringify({ error: `Tool ${name} not found or failed.` });
}


export async function POST(req: Request) {
  const { message, authToken } = await req.json();

	if (!authToken) {
		return new Response(JSON.stringify({ error: "Authentication token is missing." }), { status: 401 });
  }

  const messages: any[] = [
		{ role: "system", content: "You are a helpful assistant. ONLY use the provided tools if the user is asking for financial statistics or data analysis (Dollar). Respond in Vietnamese. Now is " + new Date().toLocaleString("vi-VN") },    
		{ role: "user", content: message },
  ];

	console.log("Initial messages:", messages);

  // --- BƯỚC 1: Lần gọi API đầu tiên để kiểm tra Tool Calling ---
  let completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: messages,
    tools: tools, // Truyền định nghĩa công cụ vào
    tool_choice: "auto", // Để mô hình tự quyết định có dùng tool hay không
  });

  const firstResponse = completion.choices[0].message;

  // --- BƯỚC 2: Kiểm tra nếu mô hình quyết định gọi Tool ---
  if (firstResponse.tool_calls) {
    // Thêm phản hồi của mô hình (lời gọi tool) vào lịch sử tin nhắn
    messages.push(firstResponse);

    // Lặp qua tất cả các tool_calls mà mô hình yêu cầu (thường chỉ có 1)
    for (const toolCall of firstResponse.tool_calls) {
      const toolResult = await executeTool(toolCall, authToken);

      // Thêm kết quả thực thi tool vào lịch sử tin nhắn
      messages.push({
        tool_call_id: toolCall.id,
        role: "tool",
        name: toolCall.function.name,
        content: toolResult, // Nội dung là kết quả từ hàm executeTool
      });
    }

    // --- BƯỚC 3: Lần gọi API thứ hai với kết quả tool để tạo câu trả lời cuối cùng ---
    completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages, // Truyền toàn bộ lịch sử tin nhắn (kể cả kết quả tool)
    });
    
    // Phản hồi cuối cùng sẽ là câu trả lời của mô hình
    const finalReply = completion.choices[0].message.content;

    return new Response(
      JSON.stringify({
        reply: finalReply,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // --- BƯỚC 4: Nếu mô hình KHÔNG gọi Tool (trả lời trực tiếp) ---
  return new Response(
    JSON.stringify({
      reply: firstResponse.content,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
