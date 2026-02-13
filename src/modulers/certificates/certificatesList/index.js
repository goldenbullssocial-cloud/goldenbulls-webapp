"use client";
import React, { useState, useEffect } from 'react'
import styles from './certificatesList.module.scss';
import { getCertificateIssued } from '@/services/certificates';

const DemoImage = '/assets/images/demo.png';

export default function CertificatesList() {
  const [activePage, setActivePage] = useState(1);
  const [certificates, setCertificates] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await getCertificateIssued(activePage, limit);
      if (res?.payload) {
        setCertificates(res.payload.data || []);
        setTotal(res.payload.totalCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [activePage]);

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className={styles.certificatesList}>
      <div className='container-md'>
        <div className={styles.grid}>
          {loading ? (
            // Simple loading skeleton or text, defaulting to keeping structure but empty or loading indicator
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem" }}>Loading...</div>
          ) : certificates.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem" }}>No certificates found.</div>
          ) : (
            certificates.map((item, index) => {
              return (
                <div key={index} className={styles.items}>
                  <img src={item?.url || DemoImage} alt='Certificate' />
                </div>
              )
            })
          )}
        </div>
        {total > limit && (
          <div className={styles.paginationAlignment}>
            <div className={styles.pagination}>
              <button
                className={styles.prevNext}
                onClick={() => setActivePage(prev => Math.max(prev - 1, 1))}
                disabled={activePage === 1}
              >
                Prev
              </button>
              <div className={styles.pageNumbers}>
                {[...Array(totalPages)].slice(0, 5).map((_, i) => (
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
                disabled={activePage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
