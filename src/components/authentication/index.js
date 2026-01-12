'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './authentication.module.scss';
import { errorMessages } from '@/utils/constant';
import { setCookie } from '../../../cookie';
import { loginWithGoogle } from '@/services/authService';
import toast from 'react-hot-toast';

const GoogleIcon = '/assets/icons/google-icon.svg';

export default function Authentication() {
  const router = useRouter();

  const googleLogin = async () => {
    try {
      const data = await loginWithGoogle();      
      if (data.success) {
        toast.success("Login successful.");
        setCookie("userToken", data.payload.token);
        setCookie("user", data.payload);
        router.push("/library");
      } else {
        toast.error(errorMessages[data?.message] ?? errorMessages["default"]);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "Login Failed.");
    }
  };

  return (
    <div className={styles.authentication}>
          <div className={styles.continueGoogle}>
              <button onClick={googleLogin}>
                  Continue with
                  <img src={GoogleIcon} alt='GoogleIcon' />
              </button>
          </div>
    </div>
  );
}