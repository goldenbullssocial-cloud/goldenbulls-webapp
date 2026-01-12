import React from 'react'
import styles from './pagination.module.scss';

export default function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && onPageChange) {
            onPageChange(page);
        }
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= maxVisible; i++) {
                    pages.push(i);
                }
            } else if (currentPage >= totalPages - 2) {
                for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pages.push(i);
                }
            }
        }
        
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className={styles.paginationAlignment}>
            <button 
                className={`${styles.round} ${currentPage === 1 ? styles.disabled : ''}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Prev
            </button>
            
            {pageNumbers.map((page) => (
                <button
                    key={page}
                    className={`${styles.round} ${currentPage === page ? styles.active : ''}`}
                    onClick={() => handlePageChange(page)}
                >
                    {page}
                </button>
            ))}
            
            <button 
                className={`${styles.round} ${currentPage === totalPages ? styles.disabled : ''}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    )
}
