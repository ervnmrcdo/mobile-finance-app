import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;
    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_date DESC
    `;
    res.status(200).json(transactions);
  } catch (err) {
    console.log("Error getting the transaction", err);
    res.status(500).json({ message: "Internal server Error" });
  }
}

export async function createTransaction(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;
    if (!title || amount === undefined || !category || !user_id) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const TRANSACTION = await sql`
      INSERT INTO transactions(user_id,title,amount,category)
      VALUES (${user_id},${title},${amount},${category})
      RETURNING *
    `;
    res.status(201).json(TRANSACTION[0]);
  } catch (err) {
    console.log("Error creating the transaction", err);
    res.status(500).json({ message: "Internal server Error" });
  }
}

export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      res.status(400).json({ message: "Invalid transaction id." });
    }

    const result = await sql`
      DELETE FROM transactions WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.log("Error deleting transaction", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId} 
    `;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0
    `;

    const expensesResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions WHERE user_id = ${userId} AND amount < 0
    `;

    console.log(balanceResult);

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expense,
    });
  } catch (err) {
    console.log("Error getting summary:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
