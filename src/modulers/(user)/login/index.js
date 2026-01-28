"use client";

import React, { useState } from 'react';
import styles from './login.module.scss';
import Input from '@/components/input';
import Authentication from '@/components/authentication';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { signIn } from '@/services/authService';
import { errorMessages } from '@/utils/constant';
import { setCookie } from '../../../../cookie';

const LoginBullImage = '/assets/images/login-bull.png';
const EmailIcon = '/assets/icons/email.svg';
const LockIcon = '/assets/icons/lock.svg';
const Logo = '/assets/logo/logo.svg';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        submit: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const validateEmail = (value) => {
        const trimmedValue = value.trim().toLowerCase();
        if (!trimmedValue) return "Email is required.";
        if (trimmedValue.includes(' ')) return "Email cannot contain spaces.";
        const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        if (!re.test(trimmedValue)) return "Enter a valid email address.";
        return "";
    };

    const validatePassword = (value) => {
        if (!value) return "Password is required.";
        if (value.length < 6) return "Password must be at least 6 characters.";
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

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: "" }));
        }
        if (errors.submit) {
            setErrors(prev => ({ ...prev, submit: "" }));
        }
    };

    const handleLogin = async () => {
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (emailError || passwordError) {
            setErrors({
                email: emailError,
                password: passwordError,
                submit: "",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const data = await signIn(email.trim().toLowerCase(), password);

            if (data.success) {
                toast.dismiss();
                toast.success("Login successfully.");

                const cookieOptions = rememberMe
                    ? { expires: 30 }
                    : {};

                setCookie("userToken", data.payload.token, cookieOptions);
                setCookie("user", JSON.stringify(data.payload), cookieOptions);

                setErrors({
                    email: "",
                    password: "",
                    submit: "",
                });

                router.push("/library");
            } else {
                toast.dismiss();
                toast.error(
                    errorMessages[data?.message] ?? "Login failed. Please try again."
                );
            }
        } catch (error) {

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

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isSubmitting) {
            handleLogin();
        }
    };

    return (
        <div className={styles.loginpageWrapper}>
            <div className={styles.mobileHeader}>
                <img src={Logo} alt='Logo' />
            </div>
            {/* <Toaster position="top-right" /> */}

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
                                    Login
                                </h1>
                                <h3>
                                    If you don't have an account,
                                </h3>
                                <p>
                                    You can <span onClick={() => router.push('/register')} style={{ cursor: 'pointer' }}>Register here !</span>
                                </p>
                            </div>
                            <div className={styles.bottomSpacing}>
                                <Input
                                    label='Email'
                                    placeholder='Enter your email address'
                                    icon={EmailIcon}
                                    name="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    onKeyDown={handleKeyPress}
                                    error={errors.email}
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Input
                                    label='Password'
                                    placeholder='Enter your password'
                                    icon={LockIcon}
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onKeyDown={handleKeyPress}
                                    error={errors.password}
                                />
                                <div
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '16px',
                                        bottom: '16px',
                                        cursor: 'pointer',
                                        zIndex: 10,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5ZM12 17.5C9.24 17.5 7 15.26 7 12.5C7 9.74 9.24 7.5 12 7.5C14.76 7.5 17 9.74 17 12.5C17 15.26 14.76 17.5 12 17.5ZM12 9.5C10.34 9.5 9 10.84 9 12.5C9 14.16 10.34 15.5 12 15.5C13.66 15.5 15 14.16 15 12.5C15 10.84 13.66 9.5 12 9.5Z" fill="#666" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 7.5C14.76 7.5 17 9.74 17 12.5C17 13.01 16.9 13.5 16.76 13.96L19.82 17.02C21.21 15.79 22.31 14.25 23 12.5C21.27 8.11 17 5 12 5C10.73 5 9.51 5.2 8.36 5.57L10.53 7.74C11 7.6 11.49 7.5 12 7.5ZM2.71 3.16C2.32 3.55 2.32 4.18 2.71 4.57L4.68 6.54C3.06 7.83 1.77 9.53 1 12.5C2.73 16.89 7 20 12 20C13.52 20 14.97 19.7 16.31 19.18L19.03 21.9C19.42 22.29 20.05 22.29 20.44 21.9C20.83 21.51 20.83 20.88 20.44 20.49L4.13 4.16C3.74 3.77 3.1 3.77 2.71 3.16ZM12 17.5C9.24 17.5 7 15.26 7 12.5C7 11.73 7.18 11 7.49 10.36L9.06 11.93C9.03 12.11 9 12.3 9 12.5C9 14.16 10.34 15.5 12 15.5C12.2 15.5 12.38 15.47 12.57 15.43L14.14 17C13.5 17.32 12.77 17.5 12 17.5ZM14.97 11.17C14.82 9.77 13.72 8.68 12.33 8.53L14.97 11.17Z" fill="#666" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <div className={styles.leftRightAlignment}>
                                <div className={styles.checkboxText}>
                                    <input
                                        type='checkbox'
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span>Remember me</span>
                                </div>
                                <a href="/reset-password" style={{ cursor: 'pointer' }}>
                                    Forgot Password ?
                                </a>
                            </div>

                            {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}

                            <div className={styles.loginButton}>
                                <button onClick={handleLogin} disabled={isSubmitting}>
                                    {isSubmitting ? 'Logging in...' : 'Login'}
                                    {!isSubmitting && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 20 15" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M18.8889 6.37387C16.18 6.37387 13.7111 3.87387 13.7111 1.12613V0H11.4889V1.12613C11.4889 3.12387 12.3533 4.99775 13.71 6.37387H0V8.62613H13.71C12.3533 10.0023 11.4889 11.8761 11.4889 13.8739V15H13.7111V13.8739C13.7111 11.1273 16.18 8.62613 18.8889 8.62613H20V6.37387H18.8889Z" fill="black" />
                                    </svg>}
                                </button>
                            </div>
                            <Authentication />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}