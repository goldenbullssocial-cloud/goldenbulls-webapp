"use client";
import React, { useEffect, useState } from "react";
import styles from "./withdrawRequest.module.scss";
import Button from "@/components/button";
import toast from "react-hot-toast";
import Input from "@/components/input";
import { addWithdrawalRequest, getAllChain } from "@/services/referAndEarn";
import { getCookie } from "../../../../../cookie";
import CustomDropdown from "@/components/customDropdown";

export default function WithdrawRequest() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [step, setStep] = useState(1); // 1: selection, 2: details form
  const [chains, setChains] = useState([]);

  // Form fields
  const [walletId, setWalletId] = useState("");
  const [selectedChainId, setSelectedChainId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const userCookie = getCookie("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
      } catch (e) {
        console.error("Error parsing user cookie", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchChains = async () => {
      try {
        const response = await getAllChain();
        console.log(response, "-------response");

        if (response?.success) {
          setChains(response?.payload?.data || []);
        }
      } catch (error) {
        console.error("Error fetching chains:", error);
      }
    };
    fetchChains();
  }, []);

  const resetModal = () => {
    setIsModalOpen(false);
    setSelectedMethod("");
    setStep(1);
    setWalletId("");
    setSelectedChainId("");
    setAccountNumber("");
    setIfscCode("");
    setAccountHolderName("");
    setErrors({});
  };

  const handleOpenModal = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.dismiss();
      toast.error("Please enter a valid amount");
      return;
    }
    setIsModalOpen(true);
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setStep(2);
  };

  const validateForm = () => {
    const newErrors = {};

    if (selectedMethod === "Crypto") {
      // Crypto validation
      if (!walletId.trim()) {
        newErrors.walletId = "Wallet address is required";
      } else if (walletId.length < 10) {
        newErrors.walletId = "Wallet address seems too short";
      }

      if (!selectedChainId) {
        newErrors.selectedChainId = "Please select a network";
      }
    } else if (selectedMethod === "Bank") {
      // Bank validation
      if (!accountHolderName.trim()) {
        newErrors.accountHolderName = "Account holder name is required";
      } else if (accountHolderName.length < 3) {
        newErrors.accountHolderName = "Name must be at least 3 characters";
      } else if (!/^[a-zA-Z\s]+$/.test(accountHolderName)) {
        newErrors.accountHolderName =
          "Name can only contain letters and spaces";
      }

      if (!accountNumber.trim()) {
        newErrors.accountNumber = "Account number is required";
      } else if (accountNumber.length < 9) {
        newErrors.accountNumber = "Account number must be at least 9 digits";
      } else if (!/^\d+$/.test(accountNumber)) {
        newErrors.accountNumber = "Account number can only contain digits";
      }

      if (!ifscCode.trim()) {
        newErrors.ifscCode = "IFSC code is required";
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.toUpperCase())) {
        newErrors.ifscCode = "Please enter a valid IFSC code";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all validation errors");
      return;
    }

    const withdrawalData = {
      name: user ? `${user.firstName} ${user.lastName}` : "User",
      email: user?.email || "user@example.com",
      phone: user?.phone || "0000000000",
      amount: amount,
      withdrawalType: selectedMethod === "Crypto" ? "crypto" : "bank",
      ...(selectedMethod === "Crypto"
        ? { walletId, chain: selectedChainId }
        : { accountNumber, ifscCode, accountHolderName }),
    };

    try {
      setLoading(true);
      const res = await addWithdrawalRequest(withdrawalData);
      if (res) {
        toast.dismiss();
        toast.success(
          res.message || "Withdraw request submitted successfully!",
        );
        setAmount("");
        resetModal();
      }
    } catch (error) {
      console.error("Error submitting withdraw request:", error);
      toast.dismiss();
      toast.error(
        error?.response?.data?.message || "Failed to submit withdraw request",
      );
    } finally {
      setLoading(false);
    }
  };
  console.log(chains, "chhh");

  return (
    <div className={styles.withdrawRequest}>
      <form onSubmit={handleOpenModal} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="amount">Withdraw Amount ($)</label>
          <input
            type="number"
            id="amount"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value.trimStart())}
            onWheel={(e) => e.target.blur()}
            min="0"
            step="any"
            className="no-spin-number"
          />
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            text={loading ? "Submitting..." : "Submit Request"}
            type="submit"
            disabled={loading}
          />
        </div>
      </form>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>REQUEST WITHDRAWAL</h2>
              <button className={styles.closeBtn} onClick={resetModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              {step === 1 ? (
                <>
                  <p className={styles.subTitle}>Select Withdrawal Method</p>
                  <div
                    className={styles.methodCard}
                    onClick={() => handleMethodSelect("Crypto")}
                  >
                    <div className={styles.iconBox}>
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M9 8.5H12C13.1046 8.5 14 9.39543 14 10.5V10.5C14 11.6046 13.1046 12.5 12 12.5H9M9 12.5H13C14.1046 12.5 15 13.3954 15 14.5V14.5C15 15.6046 14.1046 16.5 13 16.5H9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M10 7V8.5M10 16.5V18M12 7V8.5M12 16.5V18"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M9 8.5V16.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className={styles.methodDetails}>
                      <h3>Crypto Wallet</h3>
                      <p>Withdraw to cryptocurrency wallet</p>
                    </div>
                  </div>

                  <div
                    className={styles.methodCard}
                    onClick={() => handleMethodSelect("Bank")}
                  >
                    <div className={styles.iconBox}>
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M3 21H21M3 10L12 3L21 10M5 21V10M19 21V10M9 21V10M15 21V10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className={styles.methodDetails}>
                      <h3>Bank Transfer</h3>
                      <p>Withdraw to your bank account</p>
                    </div>
                  </div>
                </>
              ) : (
                <form
                  className={styles.detailsForm}
                  onSubmit={handleFinalSubmit}
                >
                  <p className={styles.subTitle}>{selectedMethod} Withdrawal</p>

                  {selectedMethod === "Crypto" ? (
                    <>
                      <div className={styles.modalInputGroup}>
                        <Input
                          type="text"
                          label="Crypto Wallet Address"
                          placeholder="Enter your crypto wallet id"
                          value={walletId}
                          onChange={(e) => {
                            setWalletId(e.target.value);
                            if (errors.walletId) {
                              setErrors((prev) => ({ ...prev, walletId: "" }));
                            }
                          }}
                          smallInput
                          error={errors.walletId}
                        />
                      </div>
                      <div className={styles.modalInputGroup}>
                        <CustomDropdown
                          label="Network"
                          value={selectedChainId}
                          onChange={(e) => {
                            setSelectedChainId(e.target.value);
                            if (errors.selectedChainId) {
                              setErrors((prev) => ({
                                ...prev,
                                selectedChainId: "",
                              }));
                            }
                          }}
                          placeholder="Select Network"
                          options={chains.map((chain) => ({
                            value: chain._id,
                            label: chain.chain || "empty",
                          }))}
                        />
                        {errors.selectedChainId && (
                          <span className={styles.errorMessage}>
                            {errors.selectedChainId}
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.modalInputGroup}>
                        <Input
                          type="text"
                          label="Account Holder Name"
                          placeholder="Enter account holder name"
                          value={accountHolderName}
                          onChange={(e) => {
                            setAccountHolderName(e.target.value);
                            if (errors.accountHolderName) {
                              setErrors((prev) => ({
                                ...prev,
                                accountHolderName: "",
                              }));
                            }
                          }}
                          smallInput
                          error={errors.accountHolderName}
                        />
                      </div>
                      <div className={styles.modalInputGroup}>
                        <Input
                          type="text"
                          label="Account Number"
                          placeholder="Enter account number"
                          value={accountNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setAccountNumber(value);
                            if (errors.accountNumber) {
                              setErrors((prev) => ({
                                ...prev,
                                accountNumber: "",
                              }));
                            }
                          }}
                          style={{
                            MozAppearance: "textfield",
                            WebkitAppearance: "none",
                            appearance: "none",
                          }}
                          error={errors.accountNumber}
                        />
                      </div>
                      <div className={styles.modalInputGroup}>
                        <Input
                          type="text"
                          label="IFSC Code"
                          placeholder="Enter IFSC code"
                          value={ifscCode}
                          onChange={(e) => {
                            const value = e.target.value.toUpperCase();
                            setIfscCode(value);
                            if (errors.ifscCode) {
                              setErrors((prev) => ({ ...prev, ifscCode: "" }));
                            }
                          }}
                          smallInput
                          error={errors.ifscCode}
                        />
                      </div>
                    </>
                  )}

                  <div className={styles.modalFooter}>
                    <button
                      type="button"
                      className={styles.backBtn}
                      onClick={() => setStep(1)}
                    >
                      <span>← Back</span>
                    </button>
                    <Button
                      text={loading ? "Submitting..." : "Submit Request"}
                      type="submit"
                      disabled={loading}
                    />
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
