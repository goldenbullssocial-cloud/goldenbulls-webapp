'use client';

import React, { useState, useEffect } from 'react';
import styles from './new-password.module.scss';
import Input from '@/components/input';
import { useRouter, useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { updatePassword } from '@/services/authService';
import { errorMessages } from '@/utils/constant';

const LoginBullImage = '/assets/images/login-bull.png';
const LockIcon = '/assets/icons/lock.svg';

export default function NewPassword() {
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const email = searchParams.get('email');
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    submit: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('reset_email');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast.error("Email not found. Redirecting to login.");
      setTimeout(() => router.push('/login'), 2000);
    }
  }, [router]);

  const validatePassword = (value) => {
    if (!value) return "Password is required.";
    if (value.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
    if (errors.submit) setErrors(prev => ({ ...prev, submit: "" }));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: "" }));
    if (errors.submit) setErrors(prev => ({ ...prev, submit: "" }));
  };

  const handleSubmit = async () => {
    const passwordError = validatePassword(password);
    let confirmPasswordError = "";
    if (password !== confirmPassword) {
      confirmPasswordError = "Passwords do not match.";
    }

    if (passwordError || confirmPasswordError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmPasswordError,
        submit: "",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await updatePassword({
        email: email,
        password: password
      });

      if (data.success) {
        toast.success("Password updated successfully.");
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        toast.dismiss();
        toast.error(errorMessages[data?.message] ?? "Failed to update password.");
        setErrors(prev => ({ ...prev, submit: errorMessages[data?.message] ?? "Failed to update password." }));
      }
    } catch (error) {
      console.error("Update password error:", error);
      const serverMessage = error.response?.data?.message;
      if (serverMessage && errorMessages[serverMessage]) {
        toast.dismiss();
        toast.error(errorMessages[serverMessage]);
        setErrors(prev => ({ ...prev, submit: errorMessages[serverMessage] }));
      } else {
        toast.dismiss();
        toast.error("An error occurred. Please try again.");
        setErrors(prev => ({ ...prev, submit: "An error occurred. Please try again." }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.newpasswordWrapper}>
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
                  Create a new password
                </h1>
              </div>
              <div className={styles.bottomSpacing}>
                <Input
                  label='New Password'
                  placeholder='Enter your password'
                  icon={LockIcon}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  error={errors.password}
                  onIconClick={() => setShowPassword(!showPassword)}
                />
              </div>
              <Input
                label='Confirm New Password'
                placeholder='Re-Enter your password'
                icon={LockIcon}
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={errors.confirmPassword}
                onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />

              {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}

              <div className={styles.loginButton}>
                <button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Set new password'}
                  {!isSubmitting && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 20 15" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.8889 6.37387C16.18 6.37387 13.7111 3.87387 13.7111 1.12613V0H11.4889V1.12613C11.4889 3.12387 12.3533 4.99775 13.71 6.37387H0V8.62613H13.71C12.3533 10.0023 11.4889 11.8761 11.4889 13.8739V15H13.7111V13.8739C13.7111 11.1273 16.18 8.62613 18.8889 8.62613H20V6.37387H18.8889Z" fill="black" />
                  </svg>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
