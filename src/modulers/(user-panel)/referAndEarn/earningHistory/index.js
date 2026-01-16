"use client";
import React, { useEffect, useState } from 'react'
import styles from './earningHistory.module.scss';
import PagePagination from '@/components/pagePagination';
import { getWithdrawalHistory } from '@/services/referAndEarn';

export default function EarningHistory({ activeTab }) {
    const [historyData, setHistoryData] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const limit = 10;

    useEffect(() => {
        setPage(1); // Reset to first page when tab changes
    }, [activeTab]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                // Map activeTab to API type
                const apiType = activeTab === 'Earning History' ? 'User Payments' : 'Total Withdrawal';

                const res = await getWithdrawalHistory(apiType, page, limit);

                if (res && res.payload) {
                    // Use userPayment for Earning History, and data for others if applicable
                    const data = activeTab === 'Earning History' ? res.payload.userPayment : res.payload.data;
                    setHistoryData(data || []);
                    setTotal(res.payload.totalCount || 0);
                } else {
                    setHistoryData([]);
                    setTotal(0);
                }
            } catch (error) {
                console.error("Error fetching history:", error);
                setHistoryData([]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [page, activeTab]);

    const isEarning = activeTab === 'Earning History';

    return (
        <div className={styles.earningHistory}>
            <div className={styles.tableUi}>
                <table>
                    <thead>
                        <tr>
                            <th>Sr no.</th>
                            {isEarning ? (
                                <>
                                    <th>Name</th>
                                    <th>Purchase Date</th>
                                    <th>Purchase Amount</th>
                                    <th>My Commission</th>
                                </>
                            ) : (
                                <>
                                    <th>Withdrawal Type</th>
                                    <th>Withdrawal Date</th>
                                    <th>Requested Amount</th>
                                    <th>Transaction ID</th>
                                </>
                            )}
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td>
                            </tr>
                        ) : historyData.length > 0 ? (
                            historyData.map((item, index) => (
                                <tr key={item._id || index}>
                                    <td>{(page - 1) * limit + index + 1}</td>
                                    {isEarning ? (
                                        <>
                                            <td>{item?.user?.name || '-'}</td>
                                            <td>{item.createdAt ? new Date(item.createdAt).toLocaleString("en-GB") : "-"}</td>
                                            <td>${item?.price || 0.00}</td>
                                            <td>{item?.commission || 0}%</td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{item.withdrawalType || 'Withdrawal'}</td>
                                            <td>{item.createdAt ? new Date(item.createdAt).toLocaleString("en-GB") : "-"}</td>
                                            <td>${item.amount || 0}</td>
                                            <td>{item.transactionId || '-'}</td>
                                        </>
                                    )}
                                    <td>
                                        <span className={item.status === 'paid' ? styles.green : styles.red}>
                                            {item.status === 'paid' ? 'Paid' : 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No {activeTab.toLowerCase()} found</td>
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
