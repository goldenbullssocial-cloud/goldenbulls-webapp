"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './otp-screen.module.scss';
import { useRouter, useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { verifyOtp, forgetPassword } from '@/services/authService';
import { errorMessages } from '@/utils/constant';

const LoginBullImage = '/assets/images/login-bull.png';

export default function OtpScreen() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const inputRefs = useRef([]);

    useEffect(() => {
        if (!email) {
            toast.error("Email not found. Redirecting to login.");
            setTimeout(() => router.push('/login'), 2000);
        }
    }, [email, router]);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);
        setError("");

        // Move to next input if value is entered
        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Move to previous input on Backspace if current input is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
        if (pastedData.every(char => !isNaN(char))) {
            const newOtp = [...otp];
            pastedData.forEach((char, index) => {
                if (index < 6) newOtp[index] = char;
            });
            setOtp(newOtp);
            setError("");

            // Focus on the next empty input or the last one
            const nextIndex = Math.min(pastedData.length, 5);
            if (inputRefs.current[nextIndex]) {
                inputRefs.current[nextIndex].focus();
            }
        }
    };

    const handleVerify = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }

        setIsSubmitting(true);
        try {
            const data = await verifyOtp({
                otp: otpString,
                email: email
            });

            if (data.success) {
                toast.success("Email verified successfully.");
                localStorage.setItem('reset_email', email);
                setTimeout(() => {
                    router.push('/new-password');
                }, 1000);
            } else {
                toast.dismiss();
                toast.error(errorMessages[data?.message] ?? "Verification failed.");
                setError(errorMessages[data?.message] ?? "Verification failed.");
            }
        } catch (error) {
            console.error("OTP verification error:", error);
            const serverMessage = error.response?.data?.message;
            if (serverMessage && errorMessages[serverMessage]) {
                toast.dismiss();
                toast.error(errorMessages[serverMessage]);
                setError(errorMessages[serverMessage]);
            } else {
                toast.dismiss();
                toast.error("An error occurred. Please try again.");
                setError("An error occurred. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (!email) return;
        try {
            const data = await forgetPassword({ email });
            if (data.success) {
                toast.success("Code resent successfully.");
            } else {
                toast.error(errorMessages[data?.message] ?? "Failed to resend code.");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        }
    };

    const maskEmail = (emailStr) => {
        if (!emailStr) return "";
        const [name, domain] = emailStr.split('@');
        if (!name || !domain) return emailStr;
        const visibleLen = Math.min(name.length, 3); // show first 3 chars
        return `${name.substring(0, visibleLen)}*****@${domain}`;
    };

    return (
        <div className={styles.resetpasswordWrapper}>
            <Toaster position="top-right" />
            <div className={styles.leftAlignment}>
                <div className={styles.containerAlignment}>
                    <div className={styles.mainrelative}>
                        <div className={styles.image}>
                            <img src={LoginBullImage} alt='LoginBullImage' />
                        </div>
                    </div>
                    <div>
                        <div className={styles.box}>
                            <div className={styles.contnet}>
                                <h1>
                                    Verify your email
                                </h1>
                                <h3>
                                    Enter verification code sent to your {maskEmail(email)}
                                </h3>
                            </div>
                            <div className={styles.inputAlignment}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type='text'
                                        maxLength={1}
                                        value={digit}
                                        ref={el => inputRefs.current[index] = el}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                    />
                                ))}
                            </div>

                            {error && <div className={styles.submitError}>{error}</div>}

                            <div className={styles.loginButton}>
                                <button onClick={handleVerify} disabled={isSubmitting}>
                                    {isSubmitting ? 'Verifying...' : 'Continue'}
                                    {!isSubmitting && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 20 15" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M18.8889 6.37387C16.18 6.37387 13.7111 3.87387 13.7111 1.12613V0H11.4889V1.12613C11.4889 3.12387 12.3533 4.99775 13.71 6.37387H0V8.62613H13.71C12.3533 10.0023 11.4889 11.8761 11.4889 13.8739V15H13.7111V13.8739C13.7111 11.1273 16.18 8.62613 18.8889 8.62613H20V6.37387H18.8889Z" fill="black" />
                                    </svg>}
                                </button>
                            </div>
                            <div className={styles.backtoLogin}>
                                <a onClick={handleResend} style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                                    Resend Code
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
