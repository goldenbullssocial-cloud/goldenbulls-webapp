import React from 'react'
import styles from './button.module.scss';
import classNames from 'classnames';
export default function Button({ text, className, onClick, ...props }) {
    return (
        <div className={classNames(styles.button, className)}>
            <button aria-label={text} onClick={onClick} {...props}>{text}</button>
        </div>
    )
}
