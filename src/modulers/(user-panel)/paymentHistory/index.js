"use client";
import React, { useEffect, useState } from 'react'
import styles from './paymentHistory.module.scss';
import PagePagination from '@/components/pagePagination';
import { getpaymentHistory } from '@/services/paymentHistory';

export default function PaymentHistory() {
    const [paymentData, setPaymentData] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPaymentHistory();
    }, [page]);

    const fetchPaymentHistory = async () => {
        try {
            setLoading(true);
            const res = await getpaymentHistory(null, { page, limit });
            if (res && res.payload) {
                setPaymentData(res.payload.data || []);
                setTotal(res.payload.totalCount || 0);
            }
        } catch (error) {
            console.error("Failed to fetch payment history", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.paymentHistory}>
            <div className={styles.title}>
                <h2>
                    Payment History
                </h2>
            </div>
            <div className={styles.tableUi}>
                <table>
                    <thead>
                        <tr>
                            <th>Sr no.</th>
                            <th>Payment Date</th>
                            <th>Product Type</th>
                            <th>Product Name</th>
                            <th>Amount</th>
                            <th>Transaction ID</th>
                            <th>Meta Account No</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td>
                            </tr>
                        ) : paymentData.length > 0 ? (
                            paymentData.map((item, index) => (
                                <tr key={item._id || index}>
                                    <td>{(page - 1) * limit + index + 1}</td>
                                    <td>{item.createdAt
                                        ? new Date(item.createdAt).toLocaleString("en-GB")
                                        : "-"}</td>
                                    <td>{item.courseId?.courseType ? "Course" : "Algobot"}</td>
                                    <td>{item.courseId?.CourseName || "-"}</td>
                                    <td>${item?.price || "0.00"}</td>
                                    <td>{item?.orderId || "-"}</td>
                                    <td>{item.metaAccountNo || "-"}</td>
                                    <td>
                                        <span className={item.status === "paid" ? styles.green : styles.red}>
                                            {item.status === "paid" ? "Paid" : "Pending"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>No payment history found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className={styles.topAlignment}>
                <PagePagination
                    currentPage={page}
                    totalEntries={total}
                    limit={limit}
                    onPageChange={(newPage) => setPage(newPage)}
                />
            </div>
        </div>
    )
}
