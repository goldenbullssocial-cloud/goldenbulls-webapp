import React, { useState, useRef, useEffect } from 'react';
import styles from './customDropdown.module.scss';

export default function CustomDropdown({ label, value, onChange, options, placeholder }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange({ target: { name: label?.toLowerCase() || 'selection', value: optionValue } });
        setIsOpen(false);
    };

    return (
        <div className={styles.customDropdown} ref={dropdownRef}>
            <label>{label}</label>
            <div className={styles.dropdownContainer}>
                {isOpen && (
                    <div className={styles.dropdownMenu}>
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className={styles.dropdownItem}
                                onClick={() => handleSelect(option.value)}
                            >
                                <span>{option.label}</span>
                            </div>
                        ))}
                    </div>
                )}
                <div
                    className={styles.dropdownButton}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>
                        {options.find(opt => opt.value === value)?.label || placeholder}
                    </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        className={isOpen ? styles.open : ''}
                    >
                        <path
                            d="M5 7.5L10 12.5L15 7.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}
