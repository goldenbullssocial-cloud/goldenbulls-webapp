import React from 'react'
import styles from './input.module.scss';
import classNames from 'classnames';
export default function Input({ label, placeholder, smallInput, icon, type = 'text', error, onIconClick, actionButton, isPassword, onTogglePassword, ...rest }) {
    return (
        <div className={classNames(styles.input, smallInput ? styles.inputChange : "")}>
            {
                label && (
                    <label>
                        {label}
                    </label>
                )
            }

            <div className={styles.relativeInput}>
                <input
                    type={type}
                    placeholder={placeholder}
                    style={{
                        paddingRight: actionButton ? '100px' : (isPassword ? '47px' : (icon ? '40px' : '16px')),
                        paddingLeft: icon ? '47px' : '16px'
                    }}
                    {...rest}
                />
                {icon && (
                    <div className={styles.iconAlignment} onClick={onIconClick} style={{ cursor: onIconClick ? 'pointer' : 'default' }}>
                        <img src={icon} alt={icon} />
                    </div>
                )}
                {isPassword && (
                    <div className={styles.passwordToggle} onClick={onTogglePassword}>
                        {type === 'password' ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5ZM12 17.5C9.24 17.5 7 15.26 7 12.5C7 9.74 9.24 7.5 12 7.5C14.76 7.5 17 9.74 17 12.5C17 15.26 14.76 17.5 12 17.5ZM12 9.5C10.34 9.5 9 10.84 9 12.5C9 14.16 10.34 15.5 12 15.5C13.66 15.5 15 14.16 15 12.5C15 10.84 13.66 9.5 12 9.5Z" fill="#666" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 7.5C14.76 7.5 17 9.74 17 12.5C17 13.01 16.9 13.5 16.76 13.96L19.82 17.02C21.21 15.79 22.31 14.25 23 12.5C21.27 8.11 17 5 12 5C10.73 5 9.51 5.2 8.36 5.57L10.53 7.74C11 7.6 11.49 7.5 12 7.5ZM2.71 3.16C2.32 3.55 2.32 4.18 2.71 4.57L4.68 6.54C3.06 7.83 1.77 9.53 1 12.5C2.73 16.89 7 20 12 20C13.52 20 14.97 19.7 16.31 19.18L19.03 21.9C19.42 22.29 20.05 22.29 20.44 21.9C20.83 21.51 20.83 20.88 20.44 20.49L4.13 4.16C3.74 3.77 3.1 3.77 2.71 3.16ZM12 17.5C9.24 17.5 7 15.26 7 12.5C7 11.73 7.18 11 7.49 10.36L9.06 11.93C9.03 12.11 9 12.3 9 12.5C9 14.16 10.34 15.5 12 15.5C12.2 15.5 12.38 15.47 12.57 15.43L14.14 17C13.5 17.32 12.77 17.5 12 17.5ZM14.97 11.17C14.82 9.77 13.72 8.68 12.33 8.53L14.97 11.17Z" fill="#666" />
                            </svg>
                        )}
                    </div>
                )}
                {actionButton && (
                    <div className={styles.actionButtonAlignment}>
                        {actionButton}
                    </div>
                )}
            </div>
            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    )
}
