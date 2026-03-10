'use client'
import React, { useState, useEffect } from 'react'
import styles from './resources.module.scss'
import { getAllResources } from '@/services/resources'
import { useSearch } from '@/contexts/SearchContext'
import Loader from '@/components/loader'

export default function ResourcesList() {
    const [resources, setResources] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [page, setPage] = useState(1)
    const { submittedSearchQuery } = useSearch()

    useEffect(() => {
        fetchResources()
    }, [page, submittedSearchQuery])

    const fetchResources = async () => {
        try {
            setLoading(true)
            const data = await getAllResources({ page, limit: 10, search: submittedSearchQuery })
            setResources(data.payload?.data || [])
        } catch (err) {
            setError('Failed to load resources')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = (url, filename) => {
        if (!url) return;
        
        // Use our server-side proxy to force download and avoid CORS + "new tab" issues
        const proxyUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(`${filename}.pdf` || 'resource.pdf')}`;
        
        const link = document.createElement('a');
        link.href = proxyUrl;
        link.setAttribute('download', filename || 'resource.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    if (loading) {
        return <Loader />
    }

    if (error) {
        return <div className={styles.error}>{error}</div>
    }

    return (
        <div className={styles.resourcesList}>
            <div className={styles.header}>
                <h2>Resources</h2>
            </div>
            
            <div className={styles.resourcesGrid}>
                {resources.map((resource) => (
                    <div key={resource._id} className={styles.resourceCard}>
                        <div className={styles.previewArea}>
                            {resource.item ? (
                                <iframe 
                                    src={`${resource.item}#view=FitW&page=1&toolbar=0&navpanes=0&scrollbar=0`} 
                                    className={styles.pdfPreview}
                                    title={resource.title}
                                    scrolling="no"
                                />
                            ) : (
                                <div className={styles.noPreview}>No Preview Available</div>
                            )}
                        </div>
                        <div className={styles.cardInfo}>
                            <h3>{resource.title}</h3>
                            <button 
                                onClick={() => handleDownload(resource.item, `${resource.title}.pdf`)}
                                className={styles.downloadIconBtn}
                                title="Download"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 15L12 3M12 15L8 11M12 15L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M3 15V17C3 19.2091 4.79086 21 7 21H17C19.2091 21 21 19.2091 21 17V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {resources.length === 0 && !loading && (
                <div className={styles.noResources}>
                    No resources found.
                </div>
            )}
        </div>
    )
}
