"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./getInTouch.module.scss";
import Button from "@/components/button";
import { motion } from "framer-motion";
import { contactUs } from "@/services/contact";
import toast from "react-hot-toast";

const AddressIcon = "/assets/icons/Address.svg";
const CallIcon = "/assets/icons/call.svg";
const GmailIcon = "/assets/icons/gmail.svg";
const FacebookIcon = "/assets/icons/facebook-outline.svg";
const InstagramIcon = "/assets/icons/instagram-outline.svg";
const TwitterIcon = "/assets/icons/twitter-outline.svg";
const LinkdinIcon = "/assets/icons/linkdin-outline.svg";

/* ---------------- Animations ---------------- */

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* ---------------- Component ---------------- */
const validateEmail = (email) => {
  const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  return re.test(String(email));
};
export default function GetInTouch() {
  const [form, setForm] = useState({
    firstName: "",
    email: "",
    description: "",
  });
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const countryRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!form.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!form.description.trim()) {
      newErrors.description = "Message is required";
      isValid = false;
    }

    if (!isPrivacyChecked) {
      newErrors.privacy = "You must agree to the privacy policy";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setForm({
      firstName: "",

      email: "",

      description: "",
    });
    setIsPrivacyChecked(false);
    setErrors({});
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };
  const handleDisabledButtonClick = () => {
    if (!isPrivacyChecked) {
      setErrors((prev) => ({
        ...prev,
        privacy: "You must agree to the privacy policy",
      }));
      toast.error("Please tick the checkbox to agree to our privacy policy");
    }
  };

  const handleSubmit = async (e) => {
    if (!isPrivacyChecked) {
      handleDisabledButtonClick();
      return;
    }
    e.preventDefault();
    // Validate the form
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await contactUs(form);
      toast.success("Message sent successfully! We will get back to you soon.");
      resetForm();
      return response;
    } catch (error) {
      console.error("Error during contact:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.getInTouch} id="get-in-touch">
      <div className="container-md">
        <motion.div
          className={styles.grid}
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Left Content */}
          <motion.div className={styles.griditems} variants={fadeLeft}>
            <motion.h2 variants={fadeUp}>get in touch</motion.h2>

            <motion.div className={styles.icongrid} variants={fadeUp}>
              <img src={AddressIcon} alt="AddressIcon" />
              <div>
                <h3>Address</h3>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever.
                </p>
              </div>
            </motion.div>

            <motion.div className={styles.icongrid} variants={fadeUp}>
              <img src={CallIcon} alt="CallIcon" />
              <div>
                <h3>Contact Details</h3>
                <a href="callto:+180052554589">+1 800-525-54-589</a>
              </div>
            </motion.div>

            <motion.div className={styles.icongrid} variants={fadeUp}>
              <img src={GmailIcon} alt="GmailIcon" />
              <div>
                <h3>Email Us</h3>
                <a href="mailto:test@email.com">test@email.com</a>
              </div>
            </motion.div>

            <motion.div className={styles.line} variants={fadeUp} />

            <motion.div className={styles.followus} variants={fadeUp}>
              <span>Follow Us :</span>
              <div className={styles.socialIcon}>
                {[FacebookIcon, InstagramIcon, TwitterIcon, LinkdinIcon].map(
                  (icon, i) => (
                    <motion.img
                      key={i}
                      src={icon}
                      alt="social"
                      whileHover={{ y: -4, scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  ),
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Form */}
          <motion.div className={styles.griditems} variants={fadeRight}>
            <motion.div className={styles.blackBox} variants={container}>
              <form onSubmit={handleSubmit}>
                <motion.h4 variants={fadeUp}>Leave Us Your Info.</motion.h4>

                <motion.div className={styles.formControl} variants={fadeUp}>
                  <input
                    placeholder="Your Name"
                    type="text"
                    name="firstName"
                    label="First Name"
                    value={form.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                  />
                  {errors.firstName && (
                    <p className={styles.error}>{errors.firstName}</p>
                  )}
                </motion.div>

                <motion.div className={styles.formControl} variants={fadeUp}>
                  <input
                    type="text"
                    placeholder="Email Address"
                    name="email"
                    label="Email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                  {errors.email && (
                    <p className={styles.error}>{errors.email}</p>
                  )}
                </motion.div>

                <motion.div className={styles.formControl} variants={fadeUp}>
                  <textarea
                    placeholder="Message"
                    name="description"
                    label="Message"
                    value={form.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                  />
                  {errors.description && (
                    <p className={styles.error}>{errors.description}</p>
                  )}
                </motion.div>

                <motion.div className={styles.checkboxText} variants={fadeUp}>
                  <input
                    type="checkbox"
                    checked={isPrivacyChecked}
                    onChange={(e) => {
                      setIsPrivacyChecked(e.target.checked);
                      if (e.target.checked && errors.privacy) {
                        setErrors((prev) => ({ ...prev, privacy: "" }));
                      }
                    }}
                  />
                  <label>
                    You agree to our friendly
                    <span> Privacy policy. </span>
                  </label>
                  {errors.privacy && (
                    <p className={styles.error}>{errors.privacy}</p>
                  )}
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Button
                    text="Send Message"
                    type="submit"
                    disabled={!isPrivacyChecked || isSubmitting}
                    style={{
                      cursor:
                        !isPrivacyChecked || isSubmitting
                          ? "not-allowed"
                          : "pointer",
                    }}
                  />
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
