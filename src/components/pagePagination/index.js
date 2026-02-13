import React from 'react';
import styles from './pagePagination.module.scss';

export default function PagePagination({ currentPage, totalEntries, limit, onPageChange }) {
    const totalPages = Math.ceil(totalEntries / limit);

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    if (totalEntries === 0) return null;

    const startEntry = (currentPage - 1) * limit + 1;
    const endEntry = Math.min(currentPage * limit, totalEntries);

    return (
        <div className={styles.paginationBottom}>
            <p>
                Showing {startEntry} to {endEntry} out of {totalEntries} Entries
            </p>
            <div className={styles.rightalignment}>
                <div
                    className={currentPage === 1 ? styles.disabled : styles.arrow}
                    onClick={handlePrevious}
                    style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M19 12L5 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 19L5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <span
                    onClick={handlePrevious}
                    style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                >
                    Previous
                </span>
                <div className={styles.size}>{currentPage.toString().padStart(2, '0')}</div>
                <span
                    onClick={handleNext}
                    style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
                >
                    Next
                </span>
                <div
                    className={currentPage === totalPages ? styles.disabled : styles.arrow}
                    onClick={handleNext}
                    style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{ transform: 'rotate(180deg)' }}
                    >
                        <path d="M19 12L5 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 19L5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
