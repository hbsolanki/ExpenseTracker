import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import Navbar from "./utils/Navbar";

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [userData, setUserData] = useState({});

  useEffect(() => {
    async function load() {
      try {
        const res1 = await axios.get("/expense/");
        setExpenses(res1.data);
        const userId = localStorage.getItem("id");
        if (userId) {
          const res2 = await axios.get(`/user/${userId}`);
          console.log(res2.data);
          setUserData(res2.data);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      }
    }
    load();
  }, []);

  const totalExpense = expenses.reduce(
    (sum, item) => sum + parseFloat(item.amount),
    0
  );

  const categoryTotals = expenses.reduce(
    (acc, exp) => {
      acc[exp.category] += parseFloat(exp.amount);
      return acc;
    },
    { FOOD: 0, TRAVEL: 0, BILLS: 0, SHOPPING: 0 }
  );

  const recent = [...expenses]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 2);

  const categoryStyles = {
    FOOD: "bg-blue-100 text-blue-700",
    TRAVEL: "bg-black text-white",
    BILLS: "bg-gray-200 text-black",
    SHOPPING: "bg-blue-600 text-white",
  };

  const filteredExpenses = expenses.filter((exp) => {
    const matchTitle = exp.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filter === "ALL" || exp.category === filter;
    return matchTitle && matchCategory;
  });

  return (
    <>
      <Navbar image={userData ? userData.image : ""} />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        <div className="bg-blue-100 border border-blue-300 rounded-xl p-6 shadow-md text-center">
          <h2 className="text-2xl font-bold text-blue-800">Total Expense</h2>
          <p className="text-4xl font-extrabold text-black mt-2">
            ₹ {totalExpense.toFixed(2)}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-blue-700 mb-3">
            Category Summary
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.keys(categoryTotals).map((cat) => (
              <div
                key={cat}
                className="bg-white border border-blue-200 shadow-sm rounded-xl p-4 text-center"
              >
                <p className="font-semibold text-blue-700">{cat}</p>
                <p className="text-xl font-bold text-black mt-1">
                  ₹ {categoryTotals[cat].toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-blue-700 mb-3">
            Recent Expenses
          </h2>

          <div className="space-y-4">
            {recent.map((exp) => (
              <div
                key={exp.id}
                onClick={() => setSelected(exp)}
                className="p-4 bg-white border border-blue-100 shadow-sm hover:shadow-md cursor-pointer rounded-xl transition"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg text-black">{exp.title}</h3>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      categoryStyles[exp.category]
                    }`}
                  >
                    {exp.category}
                  </span>
                </div>

                <div className="flex justify-between mt-2 text-blue-700">
                  <p className="font-semibold">₹ {exp.amount}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(exp.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Categories</option>
            <option value="FOOD">Food</option>
            <option value="TRAVEL">Travel</option>
            <option value="BILLS">Bills</option>
            <option value="SHOPPING">Shopping</option>
          </select>
        </div>

        {/* All Expenses */}
        <div>
          <h2 className="text-xl font-bold text-blue-700 mb-3">All Expenses</h2>

          <div className="space-y-4">
            {filteredExpenses.map((exp) => (
              <div
                key={exp.id}
                onClick={() => setSelected(exp)}
                className="p-4 bg-white border border-blue-100 shadow-sm hover:shadow-md cursor-pointer rounded-xl transition"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg text-black">{exp.title}</h3>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      categoryStyles[exp.category]
                    }`}
                  >
                    {exp.category}
                  </span>
                </div>

                <div className="flex justify-between mt-2 text-blue-700">
                  <p className="font-semibold">₹ {exp.amount}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(exp.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold text-blue-700">
              {selected.title}
            </h2>

            <p className="text-lg font-semibold">
              Amount: <span className="text-black">₹ {selected.amount}</span>
            </p>

            <p>
              Category:{" "}
              <span
                className={`px-3 py-1 rounded-full ${
                  categoryStyles[selected.category]
                }`}
              >
                {selected.category}
              </span>
            </p>

            <p>Date: {selected.date}</p>
            <p>Added on: {new Date(selected.created_at).toLocaleString()}</p>

            <button
              onClick={() => setSelected(null)}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
