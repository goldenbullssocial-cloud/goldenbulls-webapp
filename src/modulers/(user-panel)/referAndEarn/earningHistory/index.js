import React from 'react'
import styles from './earningHistory.module.scss';
import PagePagination from '@/components/pagePagination';
export default function EarningHistory() {
    return (
        <div className={styles.earningHistory}>
            <div className={styles.tableUi}>
                <table>
                    <thead>
                        <tr>
                            <th>Sr no.</th>
                            <th>Name</th>
                            <th>Purchase Date</th>
                            <th>Purchase Amount</th>
                            <th>My Commission</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            [...Array(10)].map(() => {
                                return (
                                    <tr>
                                        <td>1</td>
                                        <td>Nimit Ozha</td>
                                        <td>13/08/2025, 17:15:10</td>
                                        <td>$120</td>
                                        <td>$20</td>
                                        <td>
                                            <span className={styles.greeen}>
                                                Paid
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
