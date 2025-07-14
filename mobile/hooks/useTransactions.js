import { isLoading } from "expo-font";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

const API_URL = "http://localhost:5001/api";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoaading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      console.log("Error fetching transactions", err);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      console.log("Error fetching summary", err);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      await Promise.all([fetchSummary(), fetchTransactions()]);
    } catch (err) {
      console.error("Error loading data", err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = async (id) => {
    try {
      const response = fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete transaction");

      loadData();
      Alert.alert("Success, Transaction deleted succesfully");
    } catch (err) {
      console.log("Error deleting transaction", err);
      Alert.alert("Error", err.message);
    }
  };

  return { transactions, summary, isLoading, loadData, deleteTransaction };
};
