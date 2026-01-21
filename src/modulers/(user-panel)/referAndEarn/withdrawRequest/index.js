"use client";
import React, { useEffect, useState } from 'react';
import styles from './withdrawRequest.module.scss';
import Button from '@/components/button';
import toast from 'react-hot-toast';
import { createWithdrawalRequest, addWithdrawalRequest } from '@/services/referAndEarn';
import { getCookie } from '../../../../../cookie';

export default function WithdrawRequest() {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userCookie = getCookie('user');
        if (userCookie) {
            const parsedUser = JSON.parse(userCookie);
            setUser(parsedUser);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        const withdrawalData = {
            name: user ? `${user.firstName} ${user.lastName}` : "",
            email: user?.email || "",
            phone: user?.phone || "",
            amount: amount,
        };

        try {
            setLoading(true);
            const res = await addWithdrawalRequest(withdrawalData);
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
