"use client";
import React, { useEffect, useState } from 'react'
import styles from './paymentHistory.module.scss';
import PagePagination from '@/components/pagePagination';
import { getpaymentHistory, addmetaAccountNo } from '@/services/paymentHistory';
import NoData from '@/components/noData';
import PaymentIcon from '@/icons/paymentIcon';
import { useSearch } from '@/contexts/SearchContext';


export default function PaymentHistory() {
    const [paymentData, setPaymentData] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;
    const [loading, setLoading] = useState(false);
    const { searchQuery } = useSearch();
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [showMetaModal, setShowMetaModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [metaAccountInput, setMetaAccountInput] = useState('');
    const [savingMeta, setSavingMeta] = useState(false);
    const [viewMode, setViewMode] = useState(false);
    const [metaAccountError, setMetaAccountError] = useState('');

    // Debounce search query with 500ms delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [searchQuery]);

    // Filter payment data based on debounced search query
    const filteredPaymentData = paymentData.filter(item => {
        if (!debouncedSearchQuery.trim()) return true;

        const productName = item.courseId?.CourseName?.toLowerCase() || '';
        const transactionId = item?.orderId?.toLowerCase() || '';
        const status = item?.status?.toLowerCase() || '';
        const query = debouncedSearchQuery.toLowerCase();

        return productName.includes(query) || transactionId.includes(query) || status.includes(query);
    });

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

    const handleOpenMetaModal = (item, isViewMode = false) => {
        setSelectedPayment(item);
        setViewMode(isViewMode);
        setMetaAccountError('');
        if (isViewMode) {
            setMetaAccountInput(item.metaAccountNo || '');
        } else {
            setMetaAccountInput('');
        }
        setShowMetaModal(true);
    };

    const handleCloseMetaModal = () => {
        setShowMetaModal(false);
        setSelectedPayment(null);
        setMetaAccountInput('');
        setViewMode(false);
        setMetaAccountError('');
    };

    const handleSaveMetaAccount = async () => {
        if (!metaAccountInput.trim() || metaAccountInput.length < 6) {
            setMetaAccountError('Please enter at least 6 digits');
            return;
        }

        if (metaAccountInput.length > 12) {
            setMetaAccountError('Maximum 12 digits allowed');
            return;
        }

        try {
            setSavingMeta(true);
            setMetaAccountError('');
            await addmetaAccountNo(selectedPayment._id, metaAccountInput);

            // Refresh payment history to get updated data
            await fetchPaymentHistory();

            handleCloseMetaModal();
        } catch (error) {
            console.error("Failed to save meta account number", error);
            setMetaAccountError('Failed to save meta account number. Please try again.');
        } finally {
            setSavingMeta(false);
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
                            Array.from({ length: limit }).map((_, index) => (
                                <tr key={`skeleton-${index}`} className={styles.skeletonRow}>
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <td key={`cell-${i}`}>
                                            <div className={`${styles.skeletonLine} ${styles.skeleton}`} />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : filteredPaymentData.length > 0 ? (
                            filteredPaymentData.map((item, index) => (
                                <tr key={item._id || index}>
                                    <td>{(page - 1) * limit + index + 1}</td>
                                    <td>{item.createdAt
                                        ? new Date(item.createdAt).toLocaleString("en-GB")
                                        : "-"}</td>
                                    <td>{item.courseId?.courseType ? "Course" : item?.telegramId ? "Telegram" : "Algobot"}</td>
                                    <td>{item.courseId?.CourseName || item?.botId?.strategyId?.title || item?.telegramId?.telegramId?.channelName || "-"}</td>
                                    <td>${item?.price || "0.00"}</td>
                                    <td>{item?.orderId || "-"}</td>
                                    <td>
                                        {!item.courseId?.courseType && !item?.telegramId ? (
                                            (Array.isArray(item.metaAccountNo) && item.metaAccountNo.length === 0) || !item.metaAccountNo ? (
                                                <button className={styles.cancelBtn} onClick={() => handleOpenMetaModal(item, false)}>
                                                    <span>Add</span>
                                                </button>
                                            ) : (
                                                <button className={styles.cancelBtn} onClick={() => handleOpenMetaModal(item, true)}>
                                                    <span>View Details</span>
                                                </button>
                                            )
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td>
                                        <span className={item.status === "paid" ? styles.green : styles.red}>
                                            {item.status === "paid" ? "Paid" : "Pending"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">
                                    <NoData
                                        icon={<PaymentIcon />}
                                        title="No payment history found"
                                        description="You haven't made any payments yet. Your transaction history will appear here once you subscribe to a course or algobot."
                                    />
                                </td>
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

            {/* Meta Account Modal */}
            {showMetaModal && (
                <div className={styles.modalOverlay} onClick={handleCloseMetaModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>{viewMode ? 'Meta Account Number' : 'Add Meta Account Numbers'}</h3>
                            <button className={styles.closeIcon} onClick={handleCloseMetaModal}>
                                ✕
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            {viewMode ? (
                                // View mode: Display all accounts
                                Array.isArray(selectedPayment?.metaAccountNo) && selectedPayment.metaAccountNo.length > 0 ? (
                                    selectedPayment.metaAccountNo.map((accountNo, index) => (
                                        <div className={styles.inputGroup} key={index}>
                                            <label>Account {index + 1}</label>
                                            <div className={styles.inputWithButton}>
                                                <input
                                                    type="text"
                                                    value={accountNo}
                                                    disabled={true}
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.inputGroup}>
                                        <label>Account 1</label>
                                        <div className={styles.inputWithButton}>
                                            <input
                                                type="text"
                                                value="No account number"
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                )
                            ) : (
                                // Add mode: Single input for adding
                                <div className={styles.inputGroup}>
                                    <label>Account 1</label>
                                    <div className={styles.inputWithButton}>
                                        <input
                                            type="text"
                                            placeholder="Enter 6-12 digits"
                                            value={metaAccountInput}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                if (value.length <= 12) {
                                                    setMetaAccountInput(value);
                                                }
                                            }}
                                            disabled={viewMode}
                                            minLength={6}
                                            maxLength={12}
                                        />
                                        {!viewMode && (
                                            <button
                                                className={styles.saveBtn}
                                                onClick={handleSaveMetaAccount}
                                                disabled={savingMeta}
                                            >
                                                {savingMeta ? 'Saving...' : 'Save'}
                                            </button>
                                        )}
                                    </div>
                                    {metaAccountError && (
                                        <div className={styles.errorMessage}>
                                            {metaAccountError}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.closeButton} onClick={handleCloseMetaModal}>
                                Close
                            </button>
                            {!viewMode && (
                                <button
                                    className={styles.saveAllButton}
                                    onClick={handleSaveMetaAccount}
                                    disabled={savingMeta}
                                >
                                    {savingMeta ? 'Saving...' : 'Save All'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
