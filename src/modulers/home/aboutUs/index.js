"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import styles from "./aboutUs.module.scss";
const WhoWeAreImage = '/assets/images/who-we-are.png';

const AboutUs = () => {
  const router = useRouter();

  const handleMoreAboutUs = () => {
    router.push("/about-us");
  };

  return (
    <section className={styles.aboutUsSection}>
      <div className="container-md">
        <div className={styles.grid}>
          <div className={styles.griditems}>
            <h2>
              Who we are
            </h2>
            <p>
              We have been active in the markets for the last 5 years. Everything taught here comes from live market experience, not copied strategies or theory-heavy content. The focus is on understanding price behavior, managing risk properly, and trading with discipline. Through this journey, several traders from our academy have grown into mentors and fund managers. This is not about fast results — it’s about building traders who can survive and
              stay consistent.
            </p>
            <div className={styles.buttonDesign}>
              <button>
                <span>
                  Learn More
                </span>
              </button>
            </div>
          </div>
          <div className={styles.griditems}>
            <div className={styles.image}>
              <img src={WhoWeAreImage} alt="WhoWeAreImage" />

            </div>          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
