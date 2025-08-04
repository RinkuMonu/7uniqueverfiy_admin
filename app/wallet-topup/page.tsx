"use client";
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
import "./topup.css";

export default function WalletTopupForm() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [walletMode, setWalletMode] = useState('credentials');
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
        mode: walletMode,
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
    <div className="wallet-topup-container">
      <div className="wallet-card">
        <div className="wallet-header">
          <FaWallet className="wallet-header-icon" />
          <h2 className="wallet-title">Wallet Top-Up</h2>
          <p className="wallet-subtext">Recharge a user's wallet</p>
        </div>

        <form onSubmit={handleTopup} className="wallet-form">
          <div className="wallet-form-group">
            <label>Select User</label>
            <Select onValueChange={(val) => setSelectedUserId(val)}>
              <SelectTrigger className="wallet-select">
                <SelectValue placeholder="Choose a user" />
              </SelectTrigger>
              <SelectContent className="wallet-select-content">
                {users.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="wallet-form-group">
            <label>Amount (₹)</label>
            <input
              type="text"
              className="wallet-input"
              value={amount}
              maxLength={6}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^[0-9]*$/;
                if (regex.test(value) && (value === "" || parseInt(value) >= 1)) {
                  setAmount(value);
                }
              }}
              placeholder="Enter amount"
            />
          </div>

          <div className="wallet-form-group">
            <label>Wallet Mode</label>
            <select
              className="wallet-input"
              value={walletMode}
              onChange={(e) => setWalletMode(e.target.value)}
            >
              <option value="production">Production</option>
              <option value="credentials">Credentials</option>
            </select>
          </div>

          <div className="wallet-form-group">
            <label>Description</label>
            <input
              type="text"
              className="wallet-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Recharge, Bonus"
            />
          </div>

          <button type="submit" disabled={loading} className="wallet-submit-btn">
            {loading ? (
              <div className="wallet-btn-content">
                <Loader2 className="spinner" size={18} />
                <span>Processing...</span>
              </div>
            ) : (
              <span>Top Up Now</span>
            )}
          </button>

        </form>
      </div>
    </div>

  );
}