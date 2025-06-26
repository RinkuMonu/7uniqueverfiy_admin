"use client"
import { useState, useEffect } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { toast } from "react-toastify";
import { FaWallet } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "./topup.css"; // Make sure this is imported

export default function WalletTopupForm() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/admin/users');
      setUsers(res.data.users || []);
    } catch (err) {
      toast.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleTopup = async (e) => {
    e.preventDefault();
    if (!amount || !description) return toast.error("Amount and description are required.");
    if (parseFloat(amount) <= 0) return toast.error("Amount must be greater than zero.");

    try {
      setLoading(true);
      const res = await axiosInstance.post("admin/wallet-topup", {
        userId: selectedUserId,
        mode: "production",
        amount: parseFloat(amount),
        description,
      });

      toast.success(res.data.message || "Top-up successful!");
      setAmount("");
      setDescription("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Top-up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="card custom-card">
        <div className="card-header">
          <FaWallet className="wallet-icon" />
          <h2 className="card-title">Wallet Top-Up</h2>
        </div>

        <form onSubmit={handleTopup} className="topup-form p-4">
          {/* Row 1 - Select User and Amount */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Select User</label>
              <Select onValueChange={(val) => setSelectedUserId(val)}>
                
                <SelectTrigger className="form-input">
                  <SelectValue placeholder="Choose a user" />
                </SelectTrigger>
                <SelectContent >
                  {users.map((user) => (
                    <SelectItem key={user._id} value={user._id} >
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input
                type="number"
                min="1"
                required
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount e.g. 1000"
              />
            </div>
            <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              required
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., Recharge, Bonus, Adjustment"
            />
          </div>
          </div>

          {/* Row 2 - Description */}
          

          {/* Submit Button */}
          <div className="button-container">
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="spinner" size={18} />
                  Processing...
                </>
              ) : (
                "Top Up Now"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
