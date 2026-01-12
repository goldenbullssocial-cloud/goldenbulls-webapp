"use client";

import React, { useState } from 'react';
import styles from './register.module.scss';
import Input from '@/components/input';
// import Button from '@/components/button';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { signUp } from '@/services/authService';
import Authentication from '@/components/authentication';

const LoginBullImage = '/assets/images/login-bull.png';
const EmailIcon = '/assets/icons/email.svg';
const LockIcon = '/assets/icons/lock.svg';
const UserIcon = '/assets/icons/user.svg';
const GoogleIcon = '/assets/icons/google-icon.svg';

const errorMessages = {
    "EMAIL_ALREADY_EXISTS": "This email is already registered.",
    "SERVER_ERROR": "Something went wrong. Please try again."
};

export default function Register() {
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const router = useRouter();
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        submit: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateName = (value, field) => {
        if (!value) return `${field} is required.`;
        const trimmedValue = value.trim();
        if (trimmedValue.length < 2) return `${field} must be at least 2 characters long.`;
        const nameRegex = /^[A-Za-z\s'-]+$/;
        if (!nameRegex.test(trimmedValue)) {
            return `${field} can only contain letters, spaces, hyphens, and apostrophes.`;
        }
        return "";
    };

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
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(value)) {
            return "Password must be at least 6 characters, include uppercase, lowercase, number, and special character.";
        }
        return "";
    };

    const validateConfirmPassword = (value, password) => {
        if (!value) return "Confirm Password is required.";
        if (value !== password) return "Passwords do not match.";
        return "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSignup = () => {
        const firstNameError = validateName(data.firstName, "First Name");
        const lastNameError = validateName(data.lastName, "Last Name");
        const emailError = validateEmail(data.email);
        const passwordError = validatePassword(data.password);
        const confirmPasswordError = validateConfirmPassword(
            data.confirmPassword,
            data.password
        );

        const newErrors = {
            firstName: firstNameError,
            lastName: lastNameError,
            email: emailError,
            password: passwordError,
            confirmPassword: confirmPasswordError,
            submit: "",
        };

        setErrors(newErrors);

        if (firstNameError || lastNameError || emailError || passwordError || confirmPasswordError) {
            return;
        }

        setIsSubmitting(true);

        // Combine first and last name for API
        const fullName = `${data.firstName} ${data.lastName}`.trim();

        signUp({
            name: fullName,
            email: data.email,
            password: data.password,
            // Sending empty strings for location as they are not in UI now
            country: "",
            state: "",
            city: "",
            referredBy: ""
        })
            .then((response) => {
                if (response.success) {
                    setIsSubmitting(false);
                    toast.success("User Signup successfully.");
                    setErrors({
                        firstName: "",
                        lastName: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        submit: "",
                    });
                    router.push("/login"); // Fixed to /login as per previous correction
                } else {
                    setIsSubmitting(false);
                    toast.error(
                        errorMessages[response?.message] ??
                        "User Signup failed. Please try again."
                    );
                }
            })
            .catch((error) => {
                setIsSubmitting(false);
                const serverMessage = error.response?.data?.message;
                setErrors((prev) => ({
                    ...prev,
                    submit: (serverMessage && errorMessages[serverMessage]) || "User Signup failed. Please try again.",
                }));
            });
    };

    return (
        <div className={styles.registerWrapper}>
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
                                <h1>Sign Up</h1>
                                <h3>Already have an account?</h3>
                                <p>
                                    You can <span onClick={() => router.push('/login')} style={{ cursor: 'pointer' }}>Login here !</span>
                                </p>
                            </div>

                            <div className={styles.twocol}>
                                <Input
                                    label='First Name'
                                    placeholder='Enter your first name'
                                    icon={UserIcon}
                                    name="firstName"
                                    value={data.firstName}
                                    onChange={handleChange}
                                    error={errors.firstName}
                                />
                                <Input
                                    label='Last Name'
                                    placeholder='Enter your Last name'
                                    icon={UserIcon}
                                    name="lastName"
                                    value={data.lastName}
                                    onChange={handleChange}
                                    error={errors.lastName}
                                />
                            </div>

                            <div className={styles.bottomSpacing}>
                                <Input
                                    label='Email'
                                    placeholder='Enter your email address'
                                    icon={EmailIcon}
                                    name="email"
                                    value={data.email}
                                    onChange={handleChange}
                                    error={errors.email}
                                />
                            </div>

                            <div className={styles.bottomSpacing}>
                                <Input
                                    label='Create a Password'
                                    placeholder='Enter your password'
                                    icon={LockIcon}
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                    onIconClick={() => setShowPassword(!showPassword)}
                                />
                            </div>

                            <Input
                                label='Confirm Password'
                                placeholder='Re-Enter your password'
                                icon={LockIcon}
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={data.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                                onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            />

                            {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}

                            <div className={styles.loginButton}>
                                <button onClick={handleSignup} disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : 'Continue'}
                                    {!isSubmitting && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 20 15" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M18.8889 6.37387C16.18 6.37387 13.7111 3.87387 13.7111 1.12613V0H11.4889V1.12613C11.4889 3.12387 12.3533 4.99775 13.71 6.37387H0V8.62613H13.71C12.3533 10.0023 11.4889 11.8761 11.4889 13.8739V15H13.7111V13.8739C13.7111 11.1273 16.18 8.62613 18.8889 8.62613H20V6.37387H18.8889Z" fill="black" />
                                    </svg>}
                                </button>
                            </div>
                            <Authentication />
                            {/* <div className={styles.continueGoogle}>
                                <button>
                                    Continue with
                                    <img src={GoogleIcon} alt='GoogleIcon' />
                                </button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
