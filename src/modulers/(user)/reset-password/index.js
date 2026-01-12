"use client";

import React, { useState } from 'react';
import styles from './reset-password.module.scss';
import Input from '@/components/input';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { forgetPassword } from '@/services/authService';
import { errorMessages } from '@/utils/constant';

const LoginBullImage = '/assets/images/login-bull.png';
const EmailIcon = '/assets/icons/email.svg';

export default function ResetPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({
        email: "",
        submit: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateEmail = (value) => {
        const trimmedValue = value.trim().toLowerCase();
        if (!trimmedValue) return "Email is required.";
        if (trimmedValue.includes(' ')) return "Email cannot contain spaces.";
        const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        if (!re.test(trimmedValue)) return "Enter a valid email address.";
        return "";
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: "" }));
        }
        if (errors.submit) {
            setErrors(prev => ({ ...prev, submit: "" }));
        }
    };

    const handleResetPassword = async () => {
        const emailError = validateEmail(email);

        if (emailError) {
            setErrors({
                email: emailError,
                submit: "",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const data = await forgetPassword({
                email: email.trim().toLowerCase(),
            });

            if (data.success) {
                toast.success("Password reset link sent to your email.");

                setErrors({
                    email: "",
                    submit: "",
                });

                setEmail("");

                // Optionally redirect to login after a delay
                setTimeout(() => {
                    router.push(`/otp-screen?email=${encodeURIComponent(email)}`);
                }, 5000);
            } else {
                toast.dismiss();
                toast.error(
                    errorMessages[data?.message] ?? "Failed to send reset link. Please try again."
                );
            }
        } catch (error) {
            console.error("Password reset error:", error);

            const serverMessage = error.response?.data?.message;

            if (serverMessage && errorMessages[serverMessage]) {
                toast.dismiss();
                toast.error(errorMessages[serverMessage]);
            } else {
                toast.dismiss();
                toast.error("An error occurred. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
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
                                    Reset Password
                                </h1>
                                <h3>
                                    We will send you an email to reset your password
                                </h3>
                            </div>
                            <Input
                                label='Email'
                                placeholder='Enter your email address'
                                icon={EmailIcon}
                                name="email"
                                value={email}
                                onChange={handleEmailChange}
                                error={errors.email}
                            />

                            {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}

                            <div className={styles.loginButton}>
                                <button onClick={handleResetPassword} disabled={isSubmitting}>
                                    {isSubmitting ? 'Sending...' : 'Continue'}
                                    {!isSubmitting && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 20 15" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M18.8889 6.37387C16.18 6.37387 13.7111 3.87387 13.7111 1.12613V0H11.4889V1.12613C11.4889 3.12387 12.3533 4.99775 13.71 6.37387H0V8.62613H13.71C12.3533 10.0023 11.4889 11.8761 11.4889 13.8739V15H13.7111V13.8739C13.7111 11.1273 16.18 8.62613 18.8889 8.62613H20V6.37387H18.8889Z" fill="black" />
                                    </svg>}
                                </button>
                            </div>
                            <div className={styles.backtoLogin}>
                                <a onClick={() => router.push('/login')} style={{ cursor: 'pointer' }}>
                                    Back To Login
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
