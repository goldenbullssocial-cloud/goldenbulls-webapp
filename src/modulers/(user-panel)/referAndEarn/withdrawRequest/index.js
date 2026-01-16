"use client";
import React, { useState } from 'react';
import styles from './withdrawRequest.module.scss';
import Button from '@/components/button';
import toast from 'react-hot-toast';
import { createWithdrawalRequest } from '@/services/referAndEarn';

export default function WithdrawRequest() {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        try {
            setLoading(true);
            const res = await createWithdrawalRequest({ amount: Number(amount) });
            if (res) {
                toast.success(res.message || "Withdraw request submitted successfully!");
                setAmount('');
            }
        } catch (error) {
            console.error("Error submitting withdraw request:", error);
            toast.error(error?.response?.data?.message || "Failed to submit withdraw request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.withdrawRequest}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="amount">Withdraw Amount ($)</label>
                    <input
                        type="text"
                        id="amount"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <div className={styles.buttonWrapper}>
                    <Button
                        text={loading ? "Submitting..." : "Submit Request"}
                        type="submit"
                        disabled={loading}
                    />
                </div>
            </form>
        </div>
    );
}
