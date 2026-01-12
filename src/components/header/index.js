'use client';
import React, { useState } from 'react'
import styles from './header.module.scss';
import Topbar from '../topbar';
import Button from '../button';
import Link from 'next/link';
import MenuIcon from '@/icons/menuIcon';
import { header } from 'framer-motion/client';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';
const Logo = '/assets/logo/logo.svg';
export default function Header() {
  const [headerOpen, setHeaderOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      <div className={styles.headerTop}>
        <Topbar />
        <header className={styles.header}>
          <div className='container-md'>
            <div className={styles.headerAlignment}>
              <div className={styles.logo}>
                <Link href="/">
                  <img src={Logo} alt='Logo' />
                </Link>
              </div>
              <div className={styles.menu}>
                <Link href="/about-us" aria-label='About Us'>About Us</Link>
                <Link href="/courses" aria-label='Courses'>Courses</Link>
                <Link href="/blog" aria-label='Blogs'>Blogs</Link>
                <Link href="/contact-us" aria-label='Contact Us'>Contact Us</Link>
                <Link href="/register" aria-label='Sign-up'>Sign-up</Link>
                <Button onClick={() => router.push('/login')} text='Login' />
              </div>
              <div className={styles.menuIcon} onClick={() => setHeaderOpen(!headerOpen)}>
                <MenuIcon />
              </div>
              <div className={styles.line}></div>
            </div>
          </div>
        </header>
      </div>
      <div className={classNames(styles.mobileSidebar, headerOpen ? styles.show : styles.hide)}>
        <div className={styles.mobileSidebarTop}>
          <div className={styles.logo} onClick={() => setHeaderOpen(false)}>
            <Link href="/">
              <img src={Logo} alt='Logo' />
            </Link>
          </div>
          <div className={styles.close} onClick={() => setHeaderOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
              <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
            </svg>
          </div>
        </div>
        <div className={styles.mobileSidebarBody} onClick={() => setHeaderOpen(false)}>
          <Link href="/about-us" aria-label='About Us'>About Us</Link>
          <Link href="/courses" aria-label='Courses'>Courses</Link>
          <Link href="/blog" aria-label='Blogs'>Blogs</Link>
          <Link href="/contact-us" aria-label='Contact Us'>Contact Us</Link>
          <Link href="/register" aria-label='Sign-up'>Sign-up</Link>
        </div>
        <div className={styles.mobileSidebarfooter} onClick={() => setHeaderOpen(false)}>
          <Button text="Login" />
        </div>
      </div>
    </>
  )
}
