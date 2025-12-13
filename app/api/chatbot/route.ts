import Groq from "groq-sdk";
import { ChatCompletionMessageParam, ChatCompletionMessageToolCall } from "groq-sdk/resources/chat/completions"
import { transactionAPI, eventAPI } from "@/lib/api";

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
  // { 
  //       type: "function",
  //       function: {
  //           name: "addTransaction",
  //           description: "Dùng để tạo một giao dịch (thu nhập/chi tiêu) mới. Bạn phải hỏi người dùng về tất cả các trường bắt buộc (loại, ngày, tên, số tiền) trước khi sử dụng công cụ này.",
  //           parameters: {
  //               type: "object",
  //               properties: {
  //                   type: {
  //                       type: "string",
  //                       description: "Loại giao dịch: 'income' (thu nhập) hoặc 'expense' (chi tiêu).",
  //                   },
  //                   date: {
  //                       type: "string",
  //                       description: "Ngày giao dịch theo định dạng ISO 8601 (YYYY-MM-DDTHH:MM:SS.sssZ). Luôn sử dụng ngày hiện tại nếu người dùng không chỉ định rõ.",
  //                   },
  //                   name: {
  //                       type: "string",
  //                       description: "Tên mô tả giao dịch (ví dụ: 'Mua cà phê' hoặc 'Lương tháng 12').",
  //                   },
  //                   amount: {
  //                       type: "number",
  //                       description: "Số tiền giao dịch. Phải là số và lớn hơn 0.",
  //                   },
  //                   description: {
  //                       type: "string",
  //                       description: "Chi tiết bổ sung cho giao dịch (tùy chọn).",
  //                   },
  //               },
  //               required: ["type", "date", "name", "amount"],
  //           },
  //       },
  //   },
  { // Định nghĩa Tool mới cho việc thêm Event
    type: "function",
    function: {
        name: "addEvent",
        description: "Dùng để tạo một sự kiện mới trong lịch. Bạn phải hỏi người dùng về tiêu đề, thời gian, ngày tháng và tính lặp lại của sự kiện trước khi sử dụng công cụ này.",
        parameters: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                    description: "Tên sự kiện, không quá 15 ký tự.",
                },
                time: {
                    type: "string",
                    description: "Thời gian sự kiện theo định dạng HH:MM (24 giờ).",
                },
                date: {
                    type: "string",
                    description: "Ngày diễn ra sự kiện theo định dạng ISO 8601 (YYYY-MM-DDTHH:MM:SS.sssZ), ví dụ: 2025-12-13T12:00:00.000Z. Luôn sử dụng năm, tháng, ngày hiện tại nếu người dùng không chỉ định rõ.",
                },
                recurring: {
                    type: "boolean",
                    description: "Đặt là true nếu sự kiện lặp lại, ngược lại là false.",
                },
            },
            required: ["title", "time", "date"],
        },
    },
  },
];


async function executeTool(toolCall: ChatCompletionMessageToolCall, authToken: string) {
    const { name, arguments: argsJson } = toolCall.function;
    console.log(`Tool requested: ${name} with arguments:`, argsJson);

    const args = JSON.parse(argsJson);

    if (name === "getAllTransactions") {
        console.log(`Executing getAllTransactions`);

        const data = await transactionAPI.getAllTransactions(authToken);
        console.log("Data retrieved from analysisAPI:", data);
        return JSON.stringify({
            status: "success",
            data: data,
        });
    } 
    // else if (name === "addTransaction") {
    //     console.log(`Executing addTransaction with:`, args);
    //     const transactionDate = new Date(args.date);
    //     // 1. Chuẩn bị dữ liệu và chuyển đổi kiểu dữ liệu theo yêu cầu của Client/API
    //     const newTransaction = {
    //         type: args.type, 
            
    //         // *** SỬA LỖI TẠI ĐÂY: Chuyển đổi Date object thành chuỗi ISO string ***
    //         date: transactionDate.toISOString(), 
            
    //         name: args.name, 
    //         amount: parseFloat(args.amount), 
    //         categoryId: "", 
    //         description: args.description || null, 
    //     };
        
    //     // Kiểm tra tính hợp lệ cơ bản
    //     if (isNaN(newTransaction.amount) || newTransaction.amount <= 0) {
    //          return JSON.stringify({ status: "failure", error: "Amount must be a positive number." });
    //     }
        
    //     // 2. Gọi API thêm giao dịch
    //     // Giả định transactionAPI.addTransaction nhận đối tượng newTransaction đã chuyển đổi kiểu.
    //     const result = await transactionAPI.addTransaction(newTransaction, authToken);
        
    //     if (result.success) {
    //         const typeDisplay = newTransaction.type === 'income' ? 'thu nhập' : 'chi tiêu';
    //         const formattedAmount = newTransaction.amount.toFixed(2);
    //         const formattedDate = new Date(newTransaction.date).toLocaleDateString("vi-VN");

    //         return JSON.stringify({
    //             status: "success",
    //             message: `Đã thêm giao dịch ${typeDisplay} "${newTransaction.name}" trị giá $${formattedAmount} vào ngày ${formattedDate}.`,
    //             transaction: result.transaction,
    //         });
    //     } else {
    //         return JSON.stringify({
    //             status: "failure",
    //             error: "Failed to add transaction via transactionAPI.",
    //         });
    //     }
    // } 
    else if (name === "addEvent") {
        console.log(`Executing addEvent with:`, args);

        const newEvent = {
            date: new Date(args.date), 
            title: args.title,
            time: args.time,
            recurring: args.recurring || false, 
        };

        const result = await eventAPI.addEvent(newEvent, authToken);

        if (result.success) {
            return JSON.stringify({
                status: "success",
                message: `Đã thêm sự kiện "${newEvent.title}" vào lịch lúc ${newEvent.time} ngày ${new Date(newEvent.date).toLocaleDateString("vi-VN")}.`,
                event: result.event,
            });
        } else {
            return JSON.stringify({
                status: "failure",
                error: "Failed to add event via eventAPI.",
            });
        }
    }

    // Xử lý các công cụ khác nếu có
    return JSON.stringify({ error: `Tool ${name} not found or failed.` });
}


export async function POST(req: Request) {
  const { message, authToken } = await req.json();

  if (!authToken) {
    return new Response(JSON.stringify({ error: "Authentication token is missing." }), { status: 401 });
  }

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: "You are a helpful assistant. Use addEvent only if the user provides all necessary details about the event including title, time, date, and whether it is recurring. Respond in Vietnamese. Now is " + new Date().toLocaleString("vi-VN") },
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
