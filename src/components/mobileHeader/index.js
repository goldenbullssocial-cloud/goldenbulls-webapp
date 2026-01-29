'use client'
import React, { useState } from 'react'
import styles from './mobileHeader.module.scss';
import Sidebar from '../sidebar';
import classNames from 'classnames';
const MobileMenu = '/assets/icons/mobile-menu.svg';
const SearchIcon = '/assets/icons/search.svg';
const LeftIcon = '/assets/icons/left.svg';
const Logo = '/assets/logo/logo.svg';

export default function MobileHeader() {
    const [headerOpen, setHeaderOpen] = useState(false);
    return (
        <>
            <div className={styles.mobileHeader}>
                <div className={styles.leftAlignment}>
                    <div className={styles.mobileMenu} onClick={() => setHeaderOpen(!headerOpen)}>
                        <img src={headerOpen ? LeftIcon : MobileMenu} alt='MobileMenu' />
                    </div>
                    <div className={styles.logo}>
                        <img src={Logo} alt='Logo' />
                    </div>
                </div>
                <div className={styles.searchIcon}>
                    <img src={SearchIcon} alt='SearchIcon' />
                </div>
            </div>
            <div className={classNames(styles.mobilesidebar, headerOpen ? styles.show : styles.hide)}>
                <Sidebar />
            </div>
        </>
    )
}



