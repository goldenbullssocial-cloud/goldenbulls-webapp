import React from 'react'
import styles from './successfullyPassword.module.scss';
const LoginBullImage = '/assets/images/login-bull.png';
const LockImage = '/assets/images/lock-round.png';
export default function SuccessfullyPassword() {
    return (
        <div className={styles.successfullyPassword}>
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
                                    the new password is set successfully
                                </h1>
                            </div>
                            <div className={styles.lockImage}>
                                <img src={LockImage} alt='LockImage' />
                            </div>
                            <div className={styles.loginButton}>
                                <button>
                                    Go to Login<svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 20 15" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.8889 6.37387C16.18 6.37387 13.7111 3.87387 13.7111 1.12613V0H11.4889V1.12613C11.4889 3.12387 12.3533 4.99775 13.71 6.37387H0V8.62613H13.71C12.3533 10.0023 11.4889 11.8761 11.4889 13.8739V15H13.7111V13.8739C13.7111 11.1273 16.18 8.62613 18.8889 8.62613H20V6.37387H18.8889Z" fill="black" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
