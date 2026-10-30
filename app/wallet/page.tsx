"use client";

import { useState } from "react";
import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<"fund" | "withdraw">("fund");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  
  // Fake history for the demo
  const [history, setHistory] = useState([
    { id: 1, type: "Funding", amount: 50000, date: "Oct 28, 2026", status: "Successful" },
    { id: 2, type: "Withdrawal", amount: 15000, date: "Oct 27, 2026", status: "Successful" },
  ]);

  const handleTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) return alert("Enter a valid amount");

    if (activeTab === "withdraw" && numAmount > balance) {
      return alert("Insufficient balance");
    }

    // Simulate the transaction
    if (activeTab === "fund") {
      setBalance(balance + numAmount);
    } else {
      setBalance(balance - numAmount);
    }

    // Add to history
    const newRecord = {
      id: Date.now(),
      type: activeTab === "fund" ? "Funding" : "Withdrawal",
      amount: numAmount,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: "Successful"
    };
    setHistory([newRecord, ...history]);
    setAmount("");
    alert(`${activeTab === "fund" ? "Funded" : "Withdrawn"} ₦${numAmount.toLocaleString()} successfully! (Paystack coming soon)`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicHeader />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#0A1931] mb-8">My Wallet</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wallet Balance Card */}
          <div className="md:col-span-1 bg-[#0A1931] text-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm text-gray-300 mb-2">Available Balance</p>
            <h2 className="text-4xl font-bold mb-6">
              ₦{balance.toLocaleString()}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              Wallet Active
            </div>
          </div>

          {/* Action Form */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex gap-4 mb-6 border-b pb-2">
              <button 
                onClick={() => setActiveTab("fund")}
                className={`font-semibold pb-2 ${activeTab === "fund" ? "text-[#0A1931] border-b-2 border-[#0A1931]" : "text-gray-500"}`}
              >
                Add Funds
              </button>
              <button 
                onClick={() => setActiveTab("withdraw")}
                className={`font-semibold pb-2 ${activeTab === "withdraw" ? "text-[#0A1931] border-b-2 border-[#0A1931]" : "text-gray-500"}`}
              >
                Withdraw
              </button>
            </div>

            <form onSubmit={handleTransaction}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₦)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A1931] outline-none mb-4"
              />
              
              <button
                type="submit"
                className="w-full bg-[#0A1931] text-white font-semibold py-3 rounded-xl hover:bg-black transition"
              >
                {activeTab === "fund" ? "Proceed to Payment" : "Request Withdrawal"}
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">
                * Paystack integration coming soon
              </p>
            </form>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Transaction History</h3>
          
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No transactions yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {history.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{item.type}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${item.type === "Funding" ? "text-green-600" : "text-red-600"}`}>
                      {item.type === "Funding" ? "+" : "-"} ₦{item.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-500 font-medium">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}