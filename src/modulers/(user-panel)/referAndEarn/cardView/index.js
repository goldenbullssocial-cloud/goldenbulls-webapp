import React from 'react'
import styles from './cardView.module.scss';
import CopyIcon from '@/icons/copyIcon';
const EarningIcon = '/assets/icons/Earning.png';
export default function CardView() {
    return (
        <div className={styles.cardView}>
            <div className={styles.items}>
                <div>
                    <h3>
                        Referral Code
                    </h3>
                    <div className={styles.linkCopy}>
                        <span>
                            w46y42683w442vy8
                        </span>
                        <CopyIcon />
                    </div>
                </div>
            </div>
            <div className={styles.items}>
                <div>
                    <h3 className={styles.spaceRemove}>
                        Total Earning
                    </h3>
                    <h4>
                        $1120
                    </h4>
                </div>
                <div className={styles.iconright}>
                    <img src={EarningIcon} alt='EarningIcon' />
                </div>
            </div>
            <div className={styles.items}>
                <div>
                    <h3 className={styles.spaceRemove}>
                        Total Earning
                    </h3>
                    <h4>
                        $1120
                    </h4>
                </div>
                <div className={styles.iconright}>
                    <img src={EarningIcon} alt='EarningIcon' />
                </div>
            </div>
            <div className={styles.items}>
                <div>
                    <h3 className={styles.spaceRemove}>
                        Total Earning
                    </h3>
                    <h4>
                        $1120
                    </h4>
                </div>
                <div className={styles.iconright}>
                    <img src={EarningIcon} alt='EarningIcon' />
                </div>
            </div>
        </div>
    )
}
