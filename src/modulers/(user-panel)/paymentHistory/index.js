import React from 'react'
import styles from './paymentHistory.module.scss';
import PagePagination from '@/components/pagePagination';
export default function PaymentHistory() {
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
                        {
                            [...Array(20)].map(() => {
                                return (
                                    <tr>
                                        <td>1</td>
                                        <td>13/08/2025, 17:15:10</td>
                                        <td>Course</td>
                                        <td>Forex Trading Masterclass</td>
                                        <td>$120</td>
                                        <td>e5r341b68wq8wv164</td>
                                        <td>1234567890123456</td>
                                        <td>
                                            <span className={styles.green}>
                                                Pending
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className={styles.topAlignment}>
                <PagePagination />
            </div>
        </div>
    )
}
