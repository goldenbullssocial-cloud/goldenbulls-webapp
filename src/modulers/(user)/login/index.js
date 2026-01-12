"use client";

import React, { useState } from 'react';
import styles from './login.module.scss';
import Input from '@/components/input';
import Authentication from '@/components/authentication';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { signIn } from '@/services/authService';
import { errorMessages } from '@/utils/constant';
import { setCookie } from '../../../../cookie';

const LoginBullImage = '/assets/images/login-bull.png';
const EmailIcon = '/assets/icons/email.svg';
const LockIcon = '/assets/icons/lock.svg';

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
            console.error("Login error:", error);

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
        <div className={styles.loginpageWrapper}>
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
                                    error={errors.email}
                                />
                            </div>
                            <Input
                                label='Password'
                                placeholder='Enter your password'
                                icon={LockIcon}
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={handlePasswordChange}
                                error={errors.password}
                                onIconClick={() => setShowPassword(!showPassword)}
                            />
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
