import React from 'react'
import styles from './mobileHeader.module.scss';
const MobileMenu = '/assets/icons/mobile-menu.svg';
const SearchIcon = '/assets/icons/search.svg';
const Logo = '/assets/logo/logo.svg';

export default function MobileHeader() {
    return (
        <div className={styles.mobileHeader}>
            <div className={styles.leftAlignment}>
                <div className={styles.mobileMenu}>
                    <img src={MobileMenu} alt='MobileMenu' />
                </div>
                <div className={styles.logo}>
                    <img src={Logo} alt='Logo' />
                </div>
            </div>
            <div className={styles.searchIcon}>
                <img src={SearchIcon} alt='SearchIcon' />
            </div>
        </div>
    )
}



