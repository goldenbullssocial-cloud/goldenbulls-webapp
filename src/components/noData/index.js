import React from 'react';
import styles from './noData.module.scss';

const NoData = ({ icon, title, description }) => {
    return (
        <div className={styles.noData}>
            <div className={styles.iconWrapper}>
                {typeof icon === 'string' ? (
                    <img src={icon} alt={title || 'No data'} />
                ) : (
                    icon
                )}
            </div>
            <p>{title}</p>
            <span>{description}</span>
        </div>
    );
};

export default NoData;
