"use client";
import React, { useState } from 'react'
import styles from './certificatesList.module.scss';
const DemoImage = '/assets/images/demo.png';
export default function CertificatesList() {
  const [activePage, setActivePage] = useState(1);
  const totalPages = 5;

  return (
    <div className={styles.certificatesList}>
      <div className='container-md'>
        <div className={styles.grid}>
          {
            [...Array(8)].map((_, index) => {
              return (
                <div key={index} className={styles.items}>
                  <img src={DemoImage} alt='DemoImage' />
                </div>
              )
            })
          }
        </div>
        <div className={styles.paginationAlignment}>
          <div className={styles.pagination}>
            <button
              className={styles.prevNext}
              onClick={() => setActivePage(prev => Math.max(prev - 1, 1))}
            >
              Prev
            </button>
            <div className={styles.pageNumbers}>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`${styles.pageItem} ${activePage === i + 1 ? styles.active : ''}`}
                  onClick={() => setActivePage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              className={styles.prevNext}
              onClick={() => setActivePage(prev => Math.min(prev + 1, totalPages))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
