"use client";
import React, { useEffect, useState } from 'react'
import styles from './algobots.module.scss';
import Button from '@/components/button';
import toast from 'react-hot-toast';
import { getAlgobot, getCouponByName, getPaymentUrl, getProfile } from '@/services/dashboard';
import { getCookie } from '../../../../cookie';
import Input from '@/components/input';
const BlackChartImage = '/assets/images/black-chart.png';
const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : "";
};

export default function Algobots() {
    const [bots, setBots] = useState([]);

    useEffect(() => {
        const fetchBots = async () => {
            try {
                const res = await getAlgobot();

                if (res?.payload) {
                    setBots(res?.payload?.result);
                } else if (Array.isArray(res)) {
                    setBots(res);
                }
            } catch (error) {
                console.error("Error fetching bots:", error);
            }
        };

        fetchBots();
    }, []);

    return (
        <div className={styles.algobotsPageAlignment}>
            <div className={styles.title}>
                <h2>
                    available algobots
                </h2>
            </div>
            <div className={styles.grid}>
                {
                    bots?.map((bot, index) => {
                        return (
                            <BotCard bot={bot} key={index} />
                        )
                    })
                }
            </div>
        </div>
    )
}

const BotCard = ({ bot }) => {
    const [open, setOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(bot?.strategyPlan?.[0] || {});
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [useWalletBalance, setUseWalletBalance] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = getCookie("user");
                if (userData) {
                    const parsedUser = JSON.parse(userData)._id;
                    const response = await getProfile(parsedUser);
                    const user = response?.payload?.data?.[0] || response?.payload?.data;
                    setUser(user);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        if (user && selectedPlan && user.earningBalance <= selectedPlan.initialPrice) {
            setUseWalletBalance(false);
        }
    }, [selectedPlan, user?.earningBalance]);

    const handleApplyCoupon = async () => {
        if (couponCode) {
            setLoading(true);
            try {
                const res = await getCouponByName(couponCode);

                if (res?.success) {
                    setAppliedCoupon(res?.payload);
                    toast.success(res?.message || "Coupon Applied Successfully");
                } else {
                    toast.error(res?.message || "Invalid coupon code");
                    setAppliedCoupon(null);
                    return;
                }
            } catch (error) {
                console.error(error);
                toast.error(error?.response?.data?.message || "Failed to verify coupon");
                setAppliedCoupon(null);
                return;
            } finally {
                setLoading(false);
            }
        } else {
            toast.error("Please enter a coupon code");
        }
    };

    const handleSubscribeClick = () => {
        if (useWalletBalance) {
            setShowConfirmModal(true);
        } else {
            processPayment();
        }
    };

    const processPayment = async () => {
        setLoading(true);
        setShowConfirmModal(false); // Close confirmation modal if open
        try {
            const paymentData = {
                strategyPlanId: selectedPlan._id,
                botId: bot?._id,
                success_url: window.location.href,
                cancel_url: window.location.href,
                isWalletUse: useWalletBalance,
                walletAmount: useWalletBalance ? Math.min(user?.earningBalance || 0, selectedPlan?.initialPrice || 0) : 0,
                actualAmount: useWalletBalance ? Math.max(0, (selectedPlan?.initialPrice || 0) - (user?.earningBalance || 0)) : selectedPlan?.initialPrice || 0,
                price: selectedPlan?.initialPrice || 0,
            };

            // Add coupon if applied
            if (appliedCoupon) {
                paymentData.couponId = appliedCoupon?._id;
                paymentData.couponCode = couponCode;
            }

            // Call payment API
            const response = await getPaymentUrl(paymentData);

            if (response?.success && response?.payload?.data?.checkout_url) {
                toast.success("Redirecting to payment...");
                window.location.href = response.payload.data.checkout_url;
            } else {
                toast.error(response?.message || "Failed to create payment");
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error(error?.response?.data?.message || "Failed to initiate payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.box}>
            <div className={styles.detailsBox}>
                <h3>
                    Returns: <span className={styles.green}>{bot?.return}%</span> <small>(28 Days)</small>
                </h3>
                <h4>
                    Risk: <span>{bot?.risk}</span>
                </h4>
            </div>
            <div className={styles.leftRightAlignment}>
                <p>
                    {bot?.title}
                </p>
                <div className={styles.line}></div>
                <div className={styles.dropdownContainer} onClick={() => setOpen(!open)}>
                    <span>${selectedPlan?.initialPrice}/{selectedPlan?.planType}</span>
                    <div className={styles.imgIcon}>
                        <img src="/assets/icons/vector.svg" alt="icon" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                    </div>
                    {open && (
                        <div className={styles.dropdownList}>
                            {bot?.strategyPlan?.map((plan, i) => (
                                <div
                                    key={i}
                                    className={styles.dropdownItem}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPlan(plan);
                                        setOpen(false);
                                    }}
                                >
                                    {plan?.initialPrice}$/{plan?.planType}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className={styles.buttonStyle}>
                    <Button text="Subscribe Now" onClick={() => setShowModal(true)} />
                </div>
            </div>

            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                            <CloseIcon />
                        </button>
                        <div className={styles.modalFirstContent}>
                            <div className={styles.chartBlackImage}>
                                <img src={BlackChartImage} alt="BlackChartImage" />
                            </div>
                            <div className={styles.statsRow}>
                                <div className={styles.statBox}>
                                    <span className={styles.label}>Returns:</span>
                                    <span className={styles.value}> <span className={styles.green}>{bot?.return}%</span> (28 Days)</span>
                                    <span className={styles.divider}>|</span>
                                    <span className={styles.label}>Risk:</span>
                                    <span className={styles.value}> <span className={styles.red}>{bot?.risk}</span></span>
                                </div>
                            </div>
                            <div className={styles.textstyle}>
                                <h2>{bot?.title}</h2>
                                <p>
                                   {bot?.shortDescription}
                                </p>
                            </div>
                            <div className={styles.selectionRow}>
                                <div className={styles.modalDropdown} onClick={() => setOpen(!open)}>
                                    <span>${selectedPlan?.initialPrice}/{selectedPlan?.planType}</span>
                                    <img src="/assets/icons/down-fill.svg" alt="arrow" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                                    {open && (
                                        <div className={styles.dropdownList}>
                                            {bot?.strategyPlan?.map((plan, i) => (
                                                <div
                                                    key={i}
                                                    className={styles.dropdownItem}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedPlan(plan);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    {plan?.initialPrice}$/{plan?.planType}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {user?.earningBalance > 0 && (
                                <div className={styles.walletBalanceSection}>
                                    <label className={styles.checkboxContainer}>
                                        <input
                                            type="checkbox"
                                            checked={useWalletBalance}
                                            onChange={(e) => setUseWalletBalance(e.target.checked)}
                                            className={styles.checkboxInput}
                                        />
                                        <span className={styles.checkboxCustom}></span>
                                        <span className={styles.checkboxLabel}>
                                            Use Wallet Balance
                                            <span className={styles.walletAmount}>(Available: ${user?.earningBalance || '0.00'})</span>
                                        </span>
                                    </label>
                                </div>
                            )}
                            <div className={styles.applyCoupon}>
                                <Input
                                    placeholder='Apply Coupon'
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    actionButton={
                                        <button
                                            onClick={handleApplyCoupon}
                                            style={{
                                                background: 'linear-gradient(90deg, #F9F490, #E4AB40, #FEFBA5, #BD894E)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                padding: '6px 16px',
                                                color: '#000',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                fontSize: '14px'
                                            }}
                                        >
                                            Apply
                                        </button>
                                    }
                                />
                                <Button
                                    text={loading ? "Processing..." : "Subscribe Now"}
                                    className={styles.widthfull}
                                    onClick={handleSubscribeClick}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div className={styles.modalFrameDesign}>
                            <div className={styles.box}>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={getYouTubeEmbedUrl(bot?.link)}
                                    title={`Tutorial Video - ${bot?.title || ""}`}
                                    frameBorder="0"
                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{ borderRadius: "16px" }}
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showConfirmModal && (
                <div className={styles.confirmModalOverlay} onClick={() => setShowConfirmModal(false)}>
                    <div className={styles.confirmModalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setShowConfirmModal(false)}>
                            <CloseIcon />
                        </button>

                        <h2 className={styles.confirmTitle}>Confirm Wallet Usage</h2>

                        <div className={styles.confirmBody}>
                            <ul className={styles.confirmList}>
                                <li>
                                    Are you sure you want to use your wallet balance of <strong>${(user?.earningBalance || 0).toFixed(2)}</strong>?
                                </li>
                                {user?.earningBalance >= (selectedPlan?.initialPrice || 0) ? (
                                    <li>
                                        Your wallet balance covers the full purchase.
                                        <strong> ${(selectedPlan?.initialPrice || 0).toFixed(2)}</strong> will be deducted from your wallet and
                                        <strong> ${(user?.earningBalance - (selectedPlan?.initialPrice || 0)).toFixed(2)}</strong> will remain in your wallet.
                                    </li>
                                ) : (
                                    <li>
                                        This amount <strong>(${(user?.earningBalance || 0).toFixed(2)})</strong> will be deducted from your wallet and the remaining
                                        <strong> ${(selectedPlan?.initialPrice - (user?.earningBalance || 0)).toFixed(2)}</strong> will be charged to your payment method.
                                    </li>
                                )}
                            </ul>

                            <div className={styles.confirmActions}>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => setShowConfirmModal(false)}
                                >
                                    Cancel
                                </button>
                                <Button
                                    text={loading ? "Processing..." : "Confirm"}
                                    className={styles.modalSubscribeBtn}
                                    onClick={processPayment}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
