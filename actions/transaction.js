"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { request } from "@arcjet/next";
import aj from "@/lib/arcjet";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ------------------- Helpers ------------------- */
const serializeAmount = (obj) => ({
  ...obj,
  amount: obj.amount ? obj.amount.toNumber() : 0,
});

function calculateNextRecurrence(startDate, interval) {
  const date = new Date(startDate);
  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  return date;
}

/* ------------------- Create Transaction ------------------- */
export async function createTransaction(data) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const req = await request();

    // ArcJet rate limiting
    const decision = await aj.protect(req, { userId, requested: 1 });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({ remaining, resetInSeconds: reset });
        return { success: false, error: "Rate limit exceeded" };
      }
      return { success: false, error: "Request blocked" };
    }

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) return { success: false, error: "User not found" };

    const account = await db.account.findUnique({
      where: { id: data.accountId, userId: user.id },
    });
    if (!account) return { success: false, error: "Account not found" };

    const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
    const newBalance = account.balance.toNumber() + balanceChange;

    const transaction = await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          ...data,
          userId: user.id,
          nextRecurrence:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurrence(data.date, data.recurringInterval)
              : null,
        },
      });

      await tx.account.update({
        where: { id: data.accountId },
        data: { balance: newBalance },
      });

      return newTransaction;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    console.error("createTransaction error:", error);
    return { success: false, error: error.message || "Failed to create transaction" };
  }
}

/* ------------------- Update Transaction ------------------- */
export async function updateTransaction(id, data) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) return { success: false, error: "User not found" };

    const originalTransaction = await db.transaction.findUnique({
      where: { id, userId: user.id },
      include: { account: true },
    });
    if (!originalTransaction) return { success: false, error: "Transaction not found" };

    const oldBalanceChange =
      originalTransaction.type === "EXPENSE"
        ? -originalTransaction.amount.toNumber()
        : originalTransaction.amount.toNumber();

    const newBalanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
    const netBalanceChange = newBalanceChange - oldBalanceChange;

    const transaction = await db.$transaction(async (tx) => {
      const updated = await tx.transaction.update({
        where: { id, userId: user.id },
        data: {
          ...data,
          nextRecurrence:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurrence(data.date, data.recurringInterval)
              : null,
        },
      });

      await tx.account.update({
        where: { id: data.accountId },
        data: { balance: { increment: netBalanceChange } },
      });

      return updated;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${data.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    console.error("updateTransaction error:", error);
    return { success: false, error: error.message || "Failed to update transaction" };
  }
}

/* ------------------- Get Transaction ------------------- */
export async function getTransaction(id) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) return { success: false, error: "User not found" };

    const transaction = await db.transaction.findUnique({ where: { id, userId: user.id } });
    if (!transaction) return { success: false, error: "Transaction not found" };

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    console.error("getTransaction error:", error);
    return { success: false, error: error.message || "Failed to fetch transaction" };
  }
}

/* ------------------- Scan Receipt ------------------- */
export async function scanReceipt(file) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const result = await model.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: file.type, data: base64String } },
            {
              text: `
              Analyze this receipt image and extract JSON:
              { "amount": number, "date": "ISO date string", "description": "string", "merchantName": "string", "category": "string" }
              If not a receipt, return {}
            `,
            },
          ],
        },
      ],
    });

    const text = result.response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    try {
      const data = JSON.parse(cleanedText);
      return {
        success: true,
        data: {
          amount: parseFloat(data.amount),
          date: new Date(data.date),
          description: data.description,
          category: data.category,
          merchantName: data.merchantName,
        },
      };
    } catch (parseError) {
      console.error("scanReceipt parse error:", parseError, cleanedText);
      return { success: false, error: "Invalid response format from Gemini" };
    }
  } catch (error) {
    console.error("scanReceipt error:", error);
    return { success: false, error: "Failed to scan receipt" };
  }
}

// Get all accounts of the authenticated user
export async function getUserAccounts() {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) return { success: false, error: "User not found" };

    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: accounts.map((a) => ({
      ...a,
      balance: a.balance.toNumber(),
    })) };
  } catch (error) {
    console.error("getUserAccounts error:", error);
    return { success: false, error: error.message || "Failed to fetch accounts" };
  }
}
