'use client'
import React from 'react'
import Popover from '../popover'
import styles from './categoryPopover.module.scss'

const blogCategories = ["Finance", "Stock Market", "Investing", "Trading", "Crypto"]

export default function CategoryPopover({ selectedCategory, onCategoryChange }) {
    const categories = [
        { id: 'all', label: 'All Categories' },
        ...blogCategories.map(cat => ({ id: cat.toLowerCase().replace(' ', '-'), label: cat }))
    ]

    const selectedLabel = categories.find(cat => cat.id === selectedCategory)?.label || 'All Categories'

    return (
        <Popover
            align="right"
            trigger={
                <button className={styles.triggerButton}>
                    <span>{selectedLabel}</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            }
        >
            <div className={styles.categoryList}>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`${styles.categoryItem} ${selectedCategory === category.id ? styles.active : ''}`}
                        onClick={() => onCategoryChange(category.id)}
                    >
                        {category.label}
                        {selectedCategory === category.id && (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        )}
                    </button>
                ))}
            </div>
        </Popover>
    )
}
