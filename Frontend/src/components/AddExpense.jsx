import React, { useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

export default function AddExpense() {
  const CATEGORY_CHOICES = [
    { value: "FOOD", label: "Food" },
    { value: "TRAVEL", label: "Travel" },
    { value: "BILLS", label: "Bills" },
    { value: "SHOPPING", label: "Shopping" },
  ];

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Field errors (frontend + backend)
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  // -----------------------------
  // FRONTEND VALIDATION FUNCTION
  // -----------------------------
  const validateFrontend = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = ["Title is required"];
    if (!amount) newErrors.amount = ["Amount is required"];
    else if (Number(amount) <= 0)
      newErrors.amount = ["Amount must be greater than 0"];

    if (!category) newErrors.category = ["Category is required"];

    if (!date) newErrors.date = ["Date is required"];
    else {
      const selected = new Date(date);
      const today = new Date();
      if (selected > today) newErrors.date = ["Date cannot be in the future"];
    }

    return newErrors;
  };

  // -----------------------------
  // FORM SUBMIT HANDLER
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setErrors({});

    // FRONTEND validation first
    const frontendErrors = validateFrontend();
    if (Object.keys(frontendErrors).length > 0) {
      setErrors(frontendErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/expense/", {
        title,
        amount,
        category,
        date,
      });

      setSuccess("Expense added successfully!");
      navigate("/");
    } catch (err) {
      // Backend validation errors (DRF)
      setErrors(err.response?.data || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white shadow-md hover:shadow-lg transition rounded-xl border border-black/5 p-8">
        <h2 className="text-3xl font-extrabold text-center text-black mb-6">
          Add Expense
        </h2>

        {/* Non-field errors */}
        {errors.non_field_errors && (
          <p className="mb-4 text-red-600 text-sm text-center font-medium">
            {errors.non_field_errors[0]}
          </p>
        )}

        {success && (
          <p className="mb-4 text-white text-sm text-center bg-blue-600 py-2 rounded-md font-medium">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="text-black text-sm font-semibold">Title</label>
            <input
              type="text"
              placeholder="Enter expense title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-black/20 px-3 py-2 text-black"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title[0]}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="text-black text-sm font-semibold">Amount</label>
            <input
              type="number"
              step="0.01"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border border-black/20 px-3 py-2 text-black"
            />
            {errors.amount && (
              <p className="text-red-600 text-sm mt-1">{errors.amount[0]}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="text-black text-sm font-semibold">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border border-black/20 px-3 py-2 text-black"
            >
              <option value="">Select category</option>
              {CATEGORY_CHOICES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-600 text-sm mt-1">{errors.category[0]}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="text-black text-sm font-semibold">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-black/20 px-3 py-2 text-black"
            />
            {errors.date && (
              <p className="text-red-600 text-sm mt-1">{errors.date[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold rounded-md py-2 hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}
