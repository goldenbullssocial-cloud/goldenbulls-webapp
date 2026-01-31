'use client';
import React from 'react';

export default function Loader() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100%',
            background: '#000'
        }}>
            <div className="spinner" style={{
                width: '50px',
                height: '50px',
                border: '5px solid rgba(249, 244, 144, 0.1)',
                borderTopColor: '#F9F490',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }}></div>
            <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
