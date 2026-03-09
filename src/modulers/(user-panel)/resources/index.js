'use client'
import React, { useState, useEffect } from 'react'
import styles from './resources.module.scss'
import { getAllResources } from '@/services/resources'

export default function ResourcesList() {
    const [resources, setResources] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchResources()
    }, [page, search])

    const fetchResources = async () => {
        try {
            setLoading(true)
            const data = await getAllResources({ page, limit: 10, search })
            setResources(data.resources || [])
        } catch (err) {
            setError('Failed to load resources')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        setSearch(e.target.value)
        setPage(1)
    }

    if (loading) {
        return <div className={styles.loading}>Loading resources...</div>
    }

    if (error) {
        return <div className={styles.error}>{error}</div>
    }

    return (
        <div className={styles.resourcesList}>
            <div className={styles.header}>
                <h2>Resources</h2>
                <input
                    type="text"
                    placeholder="Search resources..."
                    value={search}
                    onChange={handleSearch}
                    className={styles.searchInput}
                />
            </div>
            
            <div className={styles.resourcesGrid}>
                {resources.map((resource) => (
                    <div key={resource._id} className={styles.resourceCard}>
                        <h3>{resource.title}</h3>
                        <p>{resource.description}</p>
                        {resource.url && (
                            <a 
                                href={resource.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={styles.resourceLink}
                            >
                                View Resource
                            </a>
                        )}
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
