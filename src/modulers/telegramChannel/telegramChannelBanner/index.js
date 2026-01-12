'use client'
import React, { useState } from 'react'
import styles from './telegramChannelBanner.module.scss';
const BullImage = '/assets/images/telegram-bull.png'
const BullImageMobile = '/assets/images/bull-telegram.png'
import Button from '@/components/button'
import { motion } from 'framer-motion'
import DownloadApp from '@/components/downloadApp'

/* Left Content Animation */
const textVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

/* Right Image Infinite Animation */
const bullVariants = {
  animate: {
    rotateY: [0, 10, 0, -10, 0],
    rotateX: [0, 3, 0, -3, 0],
    // scale: [1, 1.02, 1],
    transition: {
      duration: 6,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
}
export default function TelegramChannelBanner() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  return (
    <div className={styles.herobanner}>
      <div className="container-md">
        <div className={styles.grid}>

          {/* LEFT CONTENT */}
          <div className={styles.griditems}>
            <motion.div
              className={styles.text}
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 variants={itemVariants}>
                <span> Serious </span> Market Insights for <span> Serious </span> Traders
              </motion.h1>

              <motion.p variants={itemVariants}>
                Get exclusive access to our private Telegram channel
                where learning, discipline, and real market discussions come together.
              </motion.p>

              <motion.div
                className={styles.buttonAlignment}
                variants={itemVariants}
              >
                <Button text="Subscribe Now" className={styles.fillbutton} />
                <button className={styles.outlineButton} onClick={() => setIsDownloadModalOpen(true)}>
                  Download App
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT IMAGE */}
          <div className={styles.griditems}>
            <motion.div
              className={styles.image}
              variants={bullVariants}
              animate="animate"
            >
              <img src={BullImage} alt="BullImage" />
              <img src={BullImageMobile} alt="BullImageMobile" />
            </motion.div>
          </div>

        </div>
      </div>
      <DownloadApp isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />
    </div>
  )
}
