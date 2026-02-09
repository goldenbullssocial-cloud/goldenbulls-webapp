"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import styles from "./transparentPricing.module.scss";
import Button from "@/components/button";
import Input from "@/components/input";
import toast from "react-hot-toast";
import {
  getProfile,
  getCouponByName,
  getPaymentUrl,
  getTelegramForDashboard,
} from "@/services/dashboard";
import { getCookie } from "../../../../cookie";
import NoData from "@/components/noData";
import LibraryIcon from "@/icons/libraryIcon";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: {
    // opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const cardAnim = {
  hidden: {
    // opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function TransparentPricing() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userTelegramId, setUserTelegramId] = useState("");
  const [errors, setErrors] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [useWalletBalance, setUseWalletBalance] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Plan details (you can make this dynamic by fetching from API)
  const [telegramPlans, setTelegramPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const fetchTelegramPlans = async () => {
      try {
        const res = await getTelegramForDashboard();
        console.log(res, "res");

        if (res?.payload) {
          setTelegramPlans(
            Array.isArray(res.payload) ? res.payload : res.payload.data || [],
          );
        } else if (Array.isArray(res)) {
          setTelegramPlans(res);
        }
      } catch (error) {
        console.error("Error fetching telegram plans:", error);
      }
    };

    // Check for plan data from sessionStorage (after login)
    const storedPlan = sessionStorage.getItem("selectedPlan");
    if (storedPlan) {
      try {
        const plan = JSON.parse(storedPlan);
        console.log(plan, "restored plan from sessionStorage");
        setSelectedPlan(plan);

        // Scroll to the selected plan after a short delay
        setTimeout(() => {
          const planElement = document.getElementById(`plan-${plan.id}`);
          if (planElement) {
            planElement.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 500);

        // Clear sessionStorage
        sessionStorage.removeItem("selectedPlan");
      } catch (error) {
        console.error("Error parsing stored plan:", error);
      }
    }

    fetchTelegramPlans();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = getCookie("user");
        if (!userData) return;

        const parsedUser = JSON.parse(userData)._id;
        const response = await getProfile(parsedUser);
        const user = response.payload.data[0];
        setUser(user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (user && selectedPlan && user.earningBalance <= selectedPlan.price) {
      setUseWalletBalance(false);
    }
  }, [user?.earningBalance, selectedPlan]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setLoading(true);
    try {
      const res = await getCouponByName(couponCode);

      if (res?.success) {
        setAppliedCoupon(res?.payload);
        toast.success(res?.message || "Coupon Applied Successfully");
      } else {
        toast.error(res?.message || "Invalid coupon code");
        setAppliedCoupon(null);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to verify coupon");
      setAppliedCoupon(null);
    } finally {
      setLoading(false);
    }
  };

  const validateTelegramId = () => {
    const newErrors = {};

    if (!userTelegramId.trim()) {
      newErrors.telegramId = "Telegram ID is required";
    } else if (userTelegramId.length < 5) {
      newErrors.telegramId = "Telegram ID seems too short";
    } else if (!/^[a-zA-Z0-9_]+$/.test(userTelegramId)) {
      newErrors.telegramId =
        "Telegram ID can only contain letters, numbers, and underscores";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubscribeClick = () => {
    if (!validateTelegramId()) {
      toast.error("Please fix validation errors");
      return;
    }

    if (useWalletBalance) {
      setShowConfirmModal(true);
    } else {
      processPayment();
    }
  };

  const processPayment = async () => {
    if (!validateTelegramId()) {
      toast.error("Please fix validation errors");
      return;
    }

    setLoading(true);
    setShowConfirmModal(false);

    try {
      const originalPrice = selectedPlan?.price || 0;
      const commonDiscountAmount =
        (originalPrice * (selectedPlan?.discount || 0)) / 100;
      const priceAfterCommonDiscount = originalPrice - commonDiscountAmount;

      let finalPrice = priceAfterCommonDiscount;

      // Apply coupon discount if available
      if (appliedCoupon) {
        const couponDiscountAmount =
          (originalPrice * appliedCoupon.discount) / 100;
        finalPrice = priceAfterCommonDiscount - couponDiscountAmount;
      }

      const paymentData = {
        telegramId: userTelegramId,
        telegramPlanId: selectedPlan?._id,
        planPrice: originalPrice,
        success_url: window.location.href,
        cancel_url: window.location.href,
        isWalletUse: useWalletBalance,
        walletAmount: useWalletBalance
          ? Math.min(user?.earningBalance || 0, finalPrice)
          : 0,
        actualAmount: useWalletBalance
          ? Math.max(0, finalPrice - (user?.earningBalance || 0))
          : finalPrice,
        price: finalPrice,
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
      toast.error(
        error?.response?.data?.message || "Failed to initiate payment",
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalAmount = () => {
    const originalPrice = selectedPlan?.price || 0;
    const commonDiscountAmount =
      (originalPrice * (selectedPlan?.discount || 0)) / 100;
    let finalPrice = originalPrice - commonDiscountAmount;

    if (appliedCoupon) {
      const couponDiscountAmount =
        (originalPrice * appliedCoupon.discount) / 100;
      finalPrice = finalPrice - couponDiscountAmount;
    }

    return finalPrice.toFixed(2);
  };

  return (
    <motion.div
      className={styles.transparentPricing}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container-md">
        {/* Title */}
        <motion.div className={styles.title} variants={fadeUp}>
          <h2>Transparent Pricing</h2>
        </motion.div>

        {/* Pricing Grid */}
        <motion.div className={styles.grid} variants={container}>
          {telegramPlans?.length > 0 ? (
            telegramPlans.map((channel) =>
              channel?.telegramPlan?.map((planItem, index) => (
                <motion.div
                  key={planItem._id || `${channel._id}-${index}`}
                  className={styles.griditems}
                  variants={cardAnim}
                  whileHover={{
                    y: -6,
                    transition: { duration: 0.2 },
                  }}
                >
                  <div className={styles.cardHeader}>
                    <h2>
                      <span className={styles.lgText}>${planItem.price}</span>{" "}
                      <span className={styles.smallText}>
                        / {planItem.planType}
                      </span>
                    </h2>
                  </div>

                  <Button
                    text="Subscribe Now"
                    className={styles.buttonWidth}
                    onClick={() => {
                      if (!user) {
                        const planData = encodeURIComponent(
                          JSON.stringify(planItem),
                        );

                        router.push(
                          `/login?callback=/telegram-channel&scroll=pricing&plan=${planData}`,
                        );
                        return;
                      }

                      setSelectedPlan(planItem);
                      setShowModal(true);
                    }}
                  />
                </motion.div>
              )),
            )
          ) : (
            <NoData
              icon={<LibraryIcon />}
              title="No plans found"
              description="We couldn't find any pricing plans at this time."
            />
          )}
        </motion.div>
      </div>

      {/* Subscription Modal */}
      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setShowModal(false)}
            >
              <CloseIcon />
            </button>

            <h2 className={styles.modalTitle}>Complete Your Subscription</h2>

            <div className={styles.modalBody}>
              {/* Telegram ID Input */}
              <div className={styles.inputSection}>
                <Input
                  placeholder="Enter your Telegram ID"
                  value={userTelegramId}
                  onChange={(e) => {
                    setUserTelegramId(e.target.value);
                    if (errors.telegramId) {
                      setErrors((prev) => ({ ...prev, telegramId: "" }));
                    }
                  }}
                  error={errors.telegramId}
                />
              </div>

              {/* Plan Details */}
              <div className={styles.planDetails}>
                <h3 className={styles.planName}>
                  {selectedPlan?.planType} Plan
                </h3>

                <div className={styles.priceRow}>
                  <span className={styles.label}>Original Price:</span>
                  <span className={styles.value}>
                    ${Number(selectedPlan?.price || 0).toFixed(2)}
                  </span>
                </div>

                {selectedPlan?.discount > 0 && (
                  <div className={styles.priceRow}>
                    <span className={`${styles.label} ${styles.discount}`}>
                      Common Discount ({selectedPlan?.discount}%):
                    </span>
                    <span className={`${styles.value} ${styles.discount}`}>
                      -$
                      {(
                        (selectedPlan.price * selectedPlan.discount) /
                        100
                      ).toFixed(2)}
                    </span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className={styles.priceRow}>
                    <span className={`${styles.label} ${styles.discount}`}>
                      Coupon Discount ({appliedCoupon.discount}%):
                    </span>
                    <span className={`${styles.value} ${styles.discount}`}>
                      -$
                      {(
                        (selectedPlan.price * appliedCoupon.discount) /
                        100
                      ).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className={`${styles.priceRow} ${styles.total}`}>
                  <span className={styles.label}>Total Amount:</span>
                  <span className={styles.value}>
                    ${calculateTotalAmount()}
                  </span>
                </div>
              </div>

              {/* Wallet Balance Section */}
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
                      <span className={styles.walletAmount}>
                        (Available: ${user?.earningBalance || "0.00"})
                      </span>
                    </span>
                  </label>
                </div>
              )}

              {/* Coupon Section */}
              <div className={styles.couponSection}>
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  actionButton={
                    <button
                      onClick={handleApplyCoupon}
                      disabled={loading}
                      style={{
                        background:
                          "linear-gradient(90deg, #F9F490, #E4AB40, #FEFBA5, #BD894E)",
                        border: "none",
                        borderRadius: "8px",
                        padding: "6px 16px",
                        color: "#000",
                        fontWeight: "600",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: "14px",
                        opacity: loading ? 0.7 : 1,
                      }}
                    >
                      Apply
                    </button>
                  }
                />
              </div>

              {/* Subscribe Button */}
              <div className={styles.subscribeSection}>
                <Button
                  text={
                    loading ? "Processing..." : `Pay $${calculateTotalAmount()}`
                  }
                  onClick={handleSubscribeClick}
                  disabled={loading}
                  className={styles.widthfull}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className={styles.confirmModalOverlay}
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className={styles.confirmModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setShowConfirmModal(false)}
            >
              <CloseIcon />
            </button>

            <h2 className={styles.confirmTitle}>CONFIRM WALLET USAGE</h2>

            <div className={styles.confirmBody}>
              <ul className={styles.confirmList}>
                <li>
                  Are you sure you want to use your wallet balance of{" "}
                  <span className={styles.goldAmount}>
                    ${(user?.earningBalance || 0).toFixed(2)}
                  </span>
                  ?
                </li>
                {user?.earningBalance >= parseFloat(calculateTotalAmount()) ? (
                  <li>
                    Your wallet balance covers the full purchase.{" "}
                    <span className={styles.goldAmount}>
                      ${calculateTotalAmount()}
                    </span>{" "}
                    will be deducted from your wallet and the remaining{" "}
                    <span className={styles.goldAmount}>
                      $
                      {(
                        user?.earningBalance -
                        parseFloat(calculateTotalAmount())
                      ).toFixed(2)}
                    </span>{" "}
                    will remain in your wallet.
                  </li>
                ) : (
                  <li>
                    This amount{" "}
                    <span className={styles.goldAmount}>
                      ${(user?.earningBalance || 0).toFixed(2)}
                    </span>{" "}
                    will be deducted from your wallet and the remaining{" "}
                    <span className={styles.goldAmount}>
                      $
                      {(
                        parseFloat(calculateTotalAmount()) -
                        (user?.earningBalance || 0)
                      ).toFixed(2)}
                    </span>{" "}
                    will be charged to your payment method.
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
                <button
                  className={styles.confirmBtn}
                  onClick={processPayment}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
