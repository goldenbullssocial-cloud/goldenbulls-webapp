'use client'
import React, { useState, useRef, useEffect } from 'react'
import styles from './popover.module.scss'

export default function Popover({ trigger, children, align = 'center' }) {
    const [isOpen, setIsOpen] = useState(false)
    const popoverRef = useRef(null)
    const triggerRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target)
            ) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    return (
        <div className={styles.popoverWrapper}>
            <div
                ref={triggerRef}
                onClick={() => setIsOpen(!isOpen)}
                className={styles.trigger}
            >
                {trigger}
            </div>

            {isOpen && (
                <div
                    ref={popoverRef}
                    className={`${styles.popoverContent} ${styles[align]}`}
                >
                    {children}
                </div>
            )}
        </div>
    )
}
