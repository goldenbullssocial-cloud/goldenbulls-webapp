'use client'
import React from 'react'
import { motion } from 'framer-motion'
import styles from './downloadApp.module.scss'
import classNames from 'classnames'
const Logo = '/assets/logo/logo.svg';

const AppStoreImage = '/assets/icons/app-store.svg'
const GooglePlayImage = '/assets/icons/google-play.svg'

export default function DownloadApp({ isOpen, onClose }) {
    return (
        <div className={classNames(styles.downloadAppWrapper, isOpen && styles.open)}>
            <div className={styles.modal}>
                <div className={styles.modalHeader} onClick={onClose}>
                    <img src={Logo} alt='Logo' />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path
                            fill="#C2C2C2"
                            d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                        />
                    </svg>
                </div>

                <div className={styles.twoButtonAlignment}>
                    {/* App Store */}
                    <motion.img
                        src={AppStoreImage}
                        alt="AppStoreImage"
                        whileHover={{
                            scale: 1.08,
                            y: -6,
                            boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 18,
                        }}
                        className={styles.storeButton}
                    />

                    {/* Google Play */}
                    <motion.img
                        src={GooglePlayImage}
                        alt="GooglePlayImage"
                        whileHover={{
                            scale: 1.08,
                            y: -6,
                            boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 18,
                        }}
                        className={styles.storeButton}
                    />
                </div>
            </div>
        </div>
    )
}
