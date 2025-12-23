import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { Transaction } from "@/app/model";
import nodemailer from "nodemailer";
import { calculateNextDate } from "@/lib/utils";
import { RecurringType } from "@/app/(main)/transactions/add/page";
import { formatInTimeZone } from 'date-fns-tz';

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

async function handleAddTransaction(
  transaction: {
    type: "expense" | "income";
    name: string;
    amount: number;
    categoryId: string;
    // New Attributes
    isRecurring?: boolean;
    recurringPeriod?: string;
    time?: string;
    nextExecutionDate?: string;
  },
  userId: string
) {
  try {
    await prisma.transaction.create({
      data: {
        type: transaction.type,
        name: transaction.name,
        amount: transaction.amount,
        categoryId: transaction.categoryId,
        userId: userId,
        // Save recurring attributes
        isRecurring: transaction.isRecurring || false,
        recurringPeriod: transaction.recurringPeriod || null,
        time: transaction.time || null,
        nextExecutionDate: transaction.nextExecutionDate
          ? new Date(transaction.nextExecutionDate)
          : null,
      },
    });

    return NextResponse.json(
      { success: true, message: "Transaction added successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding transaction:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add transaction." },
      { status: 500 }
    );
  }
}

async function handleGetAllTransactions(userId: string) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: userId },
      select: {
        id: true,
        type: true,
        name: true,
        amount: true,
        date: true,
        categoryId: true,
        // ADD THESE NEW FIELDS
        isRecurring: true,
        recurringPeriod: true,
        time: true,
      },
      orderBy: [{ date: "desc" }, { id: "desc" }],
    });

    const returnTransactions = await Promise.all(
      transactions.map(async (tx) => {
        let category = null;
        if (tx.type === "expense") {
          category = await prisma.expenseCategory.findUnique({ where: { id: tx.categoryId } });
        } else {
          category = await prisma.incomeCategory.findUnique({ where: { id: tx.categoryId } });
        }
        return {
          ...tx,
          categoryName: category?.name,
          categoryIcon: category?.icon,
        };
      })
    );

    return NextResponse.json({ success: true, transactions: returnTransactions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch transactions." },
      { status: 500 }
    );
  }
}

async function handleGetCategoryTransactions(
  categoryId: string,
  userId: string
) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId,
        categoryId: categoryId,
      },
      select: {
        id: true,
        name: true,
        amount: true,
        date: true,
      },
      orderBy: [{ date: "desc" }, { id: "desc" }],
    });

    return NextResponse.json(
      { success: true, transactions: transactions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching category transactions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch category transactions." },
      { status: 500 }
    );
  }
}

async function handleSearchTransactions(
  category: string,
  type: string,
  date: string,
  userId: string
) {
  try {
    let transactions = await prisma.transaction.findMany({
      where: {
        userId: userId,
        type: type,
      },
      select: {
        id: true,
        type: true,
        name: true,
        amount: true,
        date: true,
        categoryId: true,
      },
      orderBy: [{ date: "desc" }, { id: "desc" }],
    });

    if (category) {
      transactions = transactions.filter((tx) => tx.categoryId === category);
    }

    if (date) {
      transactions = transactions.filter(
        (tx) => tx.date.toISOString().split("T")[0] === date
      );
    }

    const returnTransactions = await Promise.all(
      transactions.map(async (tx) => {
        let categoryData = null;
        if (tx.type === "expense") {
          categoryData = await prisma.expenseCategory.findUnique({
            where: { id: tx.categoryId },
          });
        } else {
          categoryData = await prisma.incomeCategory.findUnique({
            where: { id: tx.categoryId },
          });
        }
        return {
          ...tx,
          categoryId: tx.categoryId,
          categoryName: categoryData?.name,
          categoryIcon: categoryData?.icon,
        };
      })
    );

    return NextResponse.json(
      { success: true, transactions: returnTransactions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error searching transactions:", error);
  }
}

async function handleUpdateTransaction(
  transactionId: string,
  updated: Partial<Transaction>,
  userId: string
) {
  try {
    console.log("Updating transaction:", transactionId, updated);
    const result = await prisma.transaction.updateMany({
      where: {
        id: transactionId,
        userId: userId,
      },
      data: updated,
    });
    if (result.count > 0) {
      return NextResponse.json(
        { success: true, message: "Transaction updated successfully." },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to update transaction." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update transaction." },
      { status: 500 }
    );
  }
}

async function handleRemoveTransactionById(
  transactionId: string,
  userId: string
) {
  try {
    const result = await prisma.transaction.deleteMany({
      where: {
        id: transactionId,
        userId: userId,
      },
    });

    if (result.count > 0) {
      return NextResponse.json(
        { success: true, message: "Transaction removed successfully." },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to remove transaction." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error removing transaction:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove transaction." },
      { status: 500 }
    );
  }
}

async function handleRemoveTransactionBasedOnCategory(
  categoryId: string,
  userId: string
) {
  try {
    const result = await prisma.transaction.deleteMany({
      where: {
        categoryId: categoryId,
        userId: userId,
      },
    });
    if (result.count > 0) {
      return NextResponse.json(
        { success: true, message: "Transaction removed successfully." },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to remove transaction." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error removing transaction:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove transaction." },
      { status: 500 }
    );
  }
}


/**
 * Gửi email thông báo khi một giao dịch định kỳ được tự động khởi tạo thành công
 * @param email - Địa chỉ người dùng
 * @param transactionData - Thông tin về giao dịch vừa được tạo
 */
async function sendRecurringTransactionEmail(
  email: string, 
  transactionData: { name: string; amount: number; type: string; categoryName: string }
) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { name, amount, type, categoryName } = transactionData;
  const currencySymbol = "$"; // Bạn có thể thay đổi tùy theo locale
  const typeText = type === "income" ? "Income" : "Expense";
  const statusColor = type === "income" ? "#00D09E" : "#FF565E";

  await transporter.sendMail({
    from: `"MoMan" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Recurring Transaction Processed: ${name}`,
    html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e1f7e2; border-radius: 20px; overflow: hidden;">
          <div style="background-color: #00D09E; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 20px; text-transform: uppercase;">Recurring Transaction</h1>
          </div>
          
          <div style="padding: 30px; background-color: #F1FFF3;">
            <p style="color: #052224; font-size: 16px;">Hello,</p>
            <p style="color: #052224; font-size: 14px; line-height: 1.5;">
              This is a notification that your scheduled recurring transaction has been successfully added to your records.
            </p>
            
            <div style="background-color: white; border-radius: 15px; padding: 20px; margin: 20px 0; border: 1px solid #00D09E50;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #052224; font-size: 13px;"><b>Title:</b></td>
                  <td style="padding: 8px 0; text-align: right; color: #052224; font-size: 13px;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #052224; font-size: 13px;"><b>Category:</b></td>
                  <td style="padding: 8px 0; text-align: right; color: #052224; font-size: 13px;">${categoryName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #052224; font-size: 13px;"><b>Type:</b></td>
                  <td style="padding: 8px 0; text-align: right; color: ${statusColor}; font-size: 13px; font-weight: bold;">${typeText}</td>
                </tr>
                <tr style="border-top: 1px solid #eee;">
                  <td style="padding: 15px 0 0 0; color: #052224; font-size: 16px;"><b>Amount:</b></td>
                  <td style="padding: 15px 0 0 0; text-align: right; color: #052224; font-size: 18px; font-weight: bold;">
                    ${type === "income" ? "+" : "-"}${currencySymbol}${amount.toLocaleString()}
                  </td>
                </tr>
              </table>
            </div>

            <p style="color: #052224; font-size: 12px; font-style: italic;">
              If you wish to modify or stop this recurring event, please visit the Scheduler settings in the app.
            </p>
          </div>
          
          <div style="background-color: #DFF7E2; padding: 15px; text-align: center; color: #05222480; font-size: 11px;">
            © ${new Date().getFullYear()} MoMan. All rights reserved.
          </div>
        </div>
      `,
  });
}


async function handleProcessRecurring() {
  try {
    const TIMEZONE = 'Asia/Ho_Chi_Minh';
    const now = new Date();
    
    // 1. Lấy giờ hiện tại của Việt Nam định dạng "HH:mm" (ví dụ: "14:30")
    const currentTimeVN = formatInTimeZone(now, TIMEZONE, 'HH:mm');

    // 2. Query lấy các giao dịch đến hạn (chỉ so ngày bằng nextExecutionDate)
    const recurringTrans = await prisma.transaction.findMany({
      where: {
        isRecurring: true,
        nextExecutionDate: { lte: now }, // Đến ngày thực hiện
        time: currentTimeVN,            // Khớp chính xác phút hiện tại của VN
      },
      include: {
        user: true, 
      },
    });

    for (const trans of recurringTrans) {
      try {
        // 3. Lấy tên Category (để gửi email)
        let categoryData = null;
        if (trans.type === "expense") {
          categoryData = await prisma.expenseCategory.findUnique({ where: { id: trans.categoryId } });
        } else {
          categoryData = await prisma.incomeCategory.findUnique({ where: { id: trans.categoryId } });
        }

        // 4. Tạo bản sao giao dịch thực tế vào lịch sử
        await prisma.transaction.create({
          data: {
            type: trans.type,
            name: trans.name,
            amount: trans.amount,
            categoryId: trans.categoryId,
            userId: trans.userId,
            date: new Date(), 
            isRecurring: false, 
          },
        });

        // 5. Cập nhật ngày thực hiện tiếp theo (Chỉ cộng ngày, không cần gộp giờ)
        // Lưu ý: trans.nextExecutionDate lúc này là 00:00, calculateNextDate sẽ trả về 00:00 ngày tiếp theo
        const nextDate = calculateNextDate(new Date(trans.nextExecutionDate!), trans.recurringPeriod as RecurringType);
        
        await prisma.transaction.update({
          where: { id: trans.id },
          data: { nextExecutionDate: nextDate },
        });

        // 6. Gửi email
        if (trans.user?.email) {
          await sendRecurringTransactionEmail(trans.user.email, {
            name: trans.name,
            amount: trans.amount,
            type: trans.type,
            categoryName: categoryData?.name || "Uncategorized",
          });
        }
      } catch (innerError) {
        console.error(`Error processing transaction ${trans.id}:`, innerError);
      }
    }

    return NextResponse.json({ success: true, processedCount: recurringTrans.length });
  } catch (error) {
    console.error("Cron Job Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  // Kiểm tra Header bảo mật từ Vercel
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (action === "processRecurring") {
    return await handleProcessRecurring();
  }

  return NextResponse.json({ message: "Invalid action" }, { status: 400 });
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Missing token in request body." },
        { status: 400 }
      );
    }

    let decoded: { id: string; email: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json(
        { success: false, message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    const userId = decoded.id;

    if (!action) {
      return NextResponse.json(
        { success: false, message: "Missing action field in request body." },
        { status: 400 }
      );
    }

    switch (action) {
      case "addTransaction":
        const { transaction } = body;
        return await handleAddTransaction(transaction, userId);
      case "getAllTransactions":
        return await handleGetAllTransactions(userId);
      case "getCategoryTransactions":
        const { categoryId } = body;
        return await handleGetCategoryTransactions(categoryId, userId);
      case "searchTransactions":
        const { category, type, date } = body;
        return await handleSearchTransactions(category, type, date, userId);

      default:
        return NextResponse.json(
          { success: false, message: "Invalid action." },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { action, token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Missing token in request body." },
        { status: 400 }
      );
    }

    let decoded: { id: string; email: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json(
        { success: false, message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    const userId = decoded.id;

    if (!action) {
      return NextResponse.json(
        { success: false, message: "Missing action field in request body." },
        { status: 400 }
      );
    }

    switch (action) {
      case "updateTransaction":
        const { transactionId, updated } = body;
        return await handleUpdateTransaction(transactionId, updated, userId);
      default:
        return NextResponse.json(
          { success: false, message: "Invalid action." },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { action, token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Missing token in request body." },
        { status: 400 }
      );
    }

    let decoded: { id: string; email: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json(
        { success: false, message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    const userId = decoded.id;

    if (!action) {
      return NextResponse.json(
        { success: false, message: "Missing action field in request body." },
        { status: 400 }
      );
    }

    switch (action) {
      case "removeTransactionBaseOnCategory":
        const { categoryId } = body;
        return await handleRemoveTransactionBasedOnCategory(categoryId, userId);
      case "removeTransaction":
        const { transactionId } = body;
        return await handleRemoveTransactionById(transactionId, userId);
      default:
        return NextResponse.json(
          { success: false, message: "Invalid action." },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
