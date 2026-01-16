"use client";
import React, { useEffect, useState } from 'react'
import styles from './cardView.module.scss';
import CopyIcon from '@/icons/copyIcon';
import { getProfile } from '@/services/dashboard';
import { getCookie } from '../../../../../cookie';
import { getUserWithdrawalDash } from '@/services/referAndEarn';
const EarningIcon = '/assets/icons/Earning.png';

export default function CardView() {

    const [user, setUser] = useState(null);
    const [withdrawalData, setWithdrawalData] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = getCookie("user");
                    const parsedUser = JSON.parse(userData)._id;
                const response = await getProfile(parsedUser);                
                const user = response.payload.data[0];

                setUser(user);
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Failed to load profile data");
            }
        };

        const fetchWithdrawalData = async () => {
            try {
                const response = await getUserWithdrawalDash();
                setWithdrawalData(response?.payload);
            } catch (error) {
                console.error("Error fetching withdrawal data:", error);
                toast.error("Failed to load withdrawal data");
            }
        };

        fetchProfile();
        fetchWithdrawalData();
    }, []);   

    return (
        <div className={styles.cardView}>
            <div className={styles.items}>
                <div>
                    <h3>
                        Referral Code
                    </h3>
                    <div className={styles.linkCopy}>
                        <span>
                            {user?.referralCode}
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
                        ${withdrawalData?.totalEarning}
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
                        ${withdrawalData?.walletBalance}
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
                        ${withdrawalData?.pendingWithdrawal}
                    </h4>
                </div>
                <div className={styles.iconright}>
                    <img src={EarningIcon} alt='EarningIcon' />
                </div>
            </div>
        </div>
    )
}
