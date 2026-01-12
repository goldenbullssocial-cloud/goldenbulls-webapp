"use client";
import React, { useState } from 'react'
import styles from './footer.module.scss';
import Button from '../button';
import Link from 'next/link';
import { createNewsLetter } from '@/services/dashboard';
import toast from 'react-hot-toast';

const FooterLogo = '/assets/logo/footer-logo.svg';
const FacebookIcon = '/assets/icons/facebook.svg';
const TwitterIcon = '/assets/icons/twitter.svg';
const InstagramIcon = '/assets/icons/instagram.svg';
const LinkdinIcon = '/assets/icons/linkdin.svg';
const FooterBottomText = '/assets/images/footer-bottom-text.svg';

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const handleSubscribe = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await createNewsLetter({ email });
      if (res.success) {
        toast.success(res.message || "Subscribed successfully!");
        setEmail("");
        setIsAgreed(false);
      } else {
        toast.error(res.message || "Failed to subscribe.");
      }
    } catch (error) {
      console.error("Newsletter error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <footer className={styles.footer}>
        <div className='container-md'>
          <div className={styles.grid}>
            <div className={styles.griditems}>
              <div className={styles.footerLogo}>
                <img src={FooterLogo} alt='FooterLogo' />
              </div>
              <div className={styles.text}>
                <p>
                  Empowering traders with knowledge, community
                  and proven strategies for lasting financial success.
                </p>
              </div>
              <div className={styles.socialIconAlignment}>
                <div className={styles.icon}>
                  <img src={FacebookIcon} alt='FacebookIcon' />
                </div>
                <div className={styles.icon}>
                  <img src={TwitterIcon} alt='TwitterIcon' />
                </div>
                <div className={styles.icon}>
                  <img src={InstagramIcon} alt='InstagramIcon' />
                </div>
                <div className={styles.icon}>
                  <img src={LinkdinIcon} alt='LinkdinIcon' />
                </div>
              </div>
            </div>
            <div className={styles.griditems}>
              <div className={styles.text}>
                <h2>
                  Quick Links
                </h2>
                <div className={styles.line}></div>
                <Link href="/about-us" aria-label='About Us'>About Us</Link>
                <Link href="/courses" aria-label='Courses'>Courses</Link>
                <Link href="/blog" aria-label='Blogs'>Blogs</Link>
                <Link href="/contact-us" aria-label='Contact Us'>Contact Us</Link>
              </div>
              <div className={styles.text}>
                <h2>
                  Support
                </h2>
                <div className={styles.line}></div>
                <a aria-label='Terms of Service'>Terms of Service</a>
                <a aria-label='Privacy Policy'>Privacy Policy</a>
                <a aria-label='Telegram Group'>Telegram Group</a>
                <a aria-label='Refund Policy'>Refund Policy</a>
              </div>
              <div className={styles.text}>
                <h2>
                  For Mobile
                </h2>
                <div className={styles.line}></div>
                <a aria-label='Android App'>Android App</a>
                <a aria-label='iOS App'>iOS App</a>
              </div>
              <div className={styles.newsletter}>
                <h3>
                  Subscribe to Newsletter
                </h3>
                <p>
                  Get Monthly insights from founders around the globe. No
                  spam - promise.
                </p>
                <div className={styles.input}>
                  <input
                    type='text'
                    placeholder='Enter your Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className={styles.rightAlignment}>
                    <Button
                      text={loading ? "Submitting..." : "Submit"}
                      className={styles.buttonDesign}
                      onClick={handleSubscribe}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className={styles.checkboxText}>
                  <input
                    type='checkbox'
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                  />
                  <label>
                    I agree to the Privacy Policy
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.footerDetails}>
            <p>
              The content provided by Golden Bulls is for educational and informational purposes only and should not be considered financial, investment, trading, or legal
              advice. We do not provide personalized investment recommendations or guarantee any financial outcomes.
            </p>
            <p>
              Trading in financial markets, including forex, stocks, and cryptocurrencies, involves significant risk and may result in the loss of capital. Past performance is not indicative of future results.
            </p>
            <p>
              All strategies, examples, charts, and case studies shared in this course are for learning purposes only and should not be interpreted as a call to trade or invest.
            </p>
            <p>
              Users are responsible for conducting their own research and consulting with a qualified financial advisor before making any trading or investment decisions.
            </p>
            <p>
              By using this website and enrolling in our courses, you acknowledge and agree that Golden Bulls is not responsible for any financial losses or decisions made based on the information provided.
            </p>
          </div>
          <div className={styles.bottomText}>
            <img src={FooterBottomText} alt='FooterBottomText' />
          </div>
        </div>
      </footer>
      <div className={styles.copyRight}>
        <div className='container-md'>
          <p>
            © 2025 Golden Bulls Academy. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
