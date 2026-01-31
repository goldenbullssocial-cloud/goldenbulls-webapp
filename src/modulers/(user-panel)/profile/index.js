"use client";
import React, { useEffect, useState } from "react";
import styles from "./profile.module.scss";
import Input from "@/components/input";
import Button from "@/components/button";
import CustomDropdown from "@/components/customDropdown";
import { getProfile, editProfile, uploadImage } from "@/services/dashboard";
import { getCookie } from "../../../../cookie";
import toast from "react-hot-toast";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
  GetCountries,
  GetState,
  GetCity,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { regions } from "@/utils/regions";

const ProfileImage = "/assets/images/profile-upload.png";
const EditIcon = "/assets/icons/edit.svg";

export default function Profile() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        city: '',
        state: '',
        country: '',
        gender: ''
    });
    const [countryId, setCountryId] = useState(0);
    const [stateId, setStateId] = useState(0);
    const [cityId, setCityId] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
    const [phoneError, setPhoneError] = useState('');
    const countryRef = React.useRef(null);
    const fileInputRef = React.useRef(null);
    const [profileImagePreview, setProfileImagePreview] = useState(ProfileImage);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const user = getCookie('user');
                if (user) {
                    try {
                        const parsedUser = JSON.parse(user);
                        const response = await getProfile(parsedUser._id);

                        if (response.success) {
                            const data = response.payload.data[0];
                            setFormData({
                                firstName: data.firstName || '',
                                lastName: data.lastName || '',
                                phoneNumber: data.phone || data.phoneNumber || '',
                                email: data.email || '',
                                city: data.city || '',
                                state: data.state || '',
                                country: data.country || '',
                                gender: data.gender || ''
                            });
                            if (data.countryCode) {
                                setSelectedCountryCode(`+${data.countryCode}`);
                            }
                            if (data.profileImage) {
                                // If the image path is relative, you might need to prefix it with your base URL
                                // For now, we'll set it directly and let the onError handler handle it if it fails
                                setProfileImagePreview(data.profileImage);
                            }

                            // Set location IDs from API data
                            if (data.country) {
                                const countries = await GetCountries();
                                console.log('All countries:', countries);
                                const foundCountry = countries.find(c => c.name === data.country);
                                console.log('Found country:', foundCountry, 'for', data.country);
                                if (foundCountry) {
                                    setCountryId(foundCountry.id);
                                    console.log('Set countryId to:', foundCountry.id);

                                    // Set state ID if state exists
                                    if (data.state) {
                                        const states = await GetState(foundCountry.id);
                                        console.log('All states for country:', states);
                                        const foundState = states.find(s => s.name === data.state);
                                        console.log('Found state:', foundState, 'for', data.state);
                                        if (foundState) {
                                            setStateId(foundState.id);
                                            console.log('Set stateId to:', foundState.id);

                                            // Set city ID if city exists
                                            if (data.city) {
                                                const cities = await GetCity(foundCountry.id, foundState.id);
                                                console.log('All cities for state:', cities);
                                                const foundCity = cities.find(c => c.name === data.city);
                                                console.log('Found city:', foundCity, 'for', data.city);
                                                if (foundCity) {
                                                    setCityId(foundCity.id);
                                                    console.log('Set cityId to:', foundCity.id);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } catch (error) {
                        console.error("Error parsing user cookie:", error);
                    }
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Failed to load profile data");
            } finally {
                setLoading(false);
            }

            // Set location IDs from API data
            if (data.country) {
              const countries = await GetCountries();
              console.log("All countries:", countries);
              const foundCountry = countries.find(
                (c) => c.name === data.country,
              );
              console.log("Found country:", foundCountry, "for", data.country);
              if (foundCountry) {
                setCountryId(foundCountry.id);
                console.log("Set countryId to:", foundCountry.id);

                // Set state ID if state exists
                if (data.state) {
                  const states = await GetState(foundCountry.id);
                  console.log("All states for country:", states);
                  const foundState = states.find((s) => s.name === data.state);
                  console.log("Found state:", foundState, "for", data.state);
                  if (foundState) {
                    setStateId(foundState.id);
                    console.log("Set stateId to:", foundState.id);

                    // Set city ID if city exists
                    if (data.city) {
                      const cities = await GetCity(
                        foundCountry.id,
                        foundState.id,
                      );
                      console.log("All cities for state:", cities);
                      const foundCity = cities.find(
                        (c) => c.name === data.city,
                      );
                      console.log("Found city:", foundCity, "for", data.city);
                      if (foundCity) {
                        setCityId(foundCity.id);
                        console.log("Set cityId to:", foundCity.id);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Debug: Log when IDs change
  useEffect(() => {
    console.log("Location IDs updated:", { countryId, stateId, cityId });
  }, [countryId, stateId, cityId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCountryChange = (e) => {
    setCountryId(e.id);
    setFormData((prev) => ({
      ...prev,
      country: e.name,
      state: "",
      city: "",
    }));
    setStateId(0);
    setCityId(0);


    // Clear errors for country and dependent fields
    if (errors.country) {
      setErrors((prev) => ({
        ...prev,
        country: "",
        state: "",
        city: "",
      }));
    }
  };
            let parsedUser;
            try {
                parsedUser = JSON.parse(user);
            } catch (error) {
                console.error("Error parsing user cookie:", error);
                toast.error("Session error. Please log in again.");
                return;
            }

  const handleStateChange = (e) => {
    setStateId(e.id);
    setFormData((prev) => ({
      ...prev,
      state: e.name,
      city: "",
    }));
    setCityId(0);

    // Clear errors for state and dependent city
    if (errors.state || errors.city) {
      setErrors((prev) => ({
        ...prev,
        state: "",
        city: "",
      }));
    }
  };

  const handleCityChange = (e) => {
    setCityId(e.id);
    setFormData((prev) => ({
      ...prev,
      city: e.name,
    }));

    // Clear city error
    if (errors.city) {
      setErrors((prev) => ({
        ...prev,
        city: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
      newErrors.firstName = "First name can only contain letters and spaces";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
      newErrors.lastName = "Last name can only contain letters and spaces";
    }

    // Phone validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = "Phone number must be at least 10 digits";
    } else if (formData.phoneNumber.length > 15) {
      newErrors.phoneNumber = "Phone number cannot exceed 15 digits";
    }

    // Email validation (though it's disabled, we should still validate if empty)
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Country validation
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    // State validation
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    // Gender validation
    if (!formData.gender.trim()) {
      newErrors.gender = "Gender is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix all validation errors");
      return;
    }

    try {
      setSaving(true);
      const user = getCookie("user");
      if (!user) {
        toast.error("User not found");
        return;
      }

      const parsedUser = JSON.parse(user);

      let profileImageUrl = profileImagePreview;

      // If a new file is selected, upload it first
      if (selectedFile) {
        const uploadResponse = await uploadImage(selectedFile);
        if (uploadResponse.success) {
          profileImageUrl = uploadResponse.payload;
        } else {
          toast.error("Failed to upload image");
          setSaving(false);
          return;
        }
      }

      // Prepare data according to API format (JSON)
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phoneNumber,
        countryCode: selectedCountryCode.replace("+", ""),
        city: formData.city,
        state: formData.state,
        country: formData.country,
        gender: formData.gender,
        profileImage: profileImageUrl,
      };

      const response = await editProfile(parsedUser._id, updateData);

      if (response.success) {
        toast.success("Profile updated successfully!");
        setSelectedFile(null); // Reset file after success
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.title}>
        <h2>Edit Profile</h2>
      </div>
      <div className={styles.profile} onClick={triggerFileInput}>
        <img
          src={profileImagePreview}
          alt="ProfileImage"
          className={styles.img}
        />
        <div className={styles.editIcon}>
          <img src={EditIcon} alt="EditIcon" />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          style={{ display: "none" }}
        />
      </div>
      <div className={styles.profileInformation}>
        <div className={styles.twoCol}>
          <Input
            label="First Name"
            placeholder="Enter First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            smallInput
            error={errors.firstName}
          />
          <Input
            label="Last Name"
            placeholder="Enter Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            smallInput
            error={errors.lastName}
          />
          <div className={styles.telephoninputmain}>
            <div className={styles.dropdownrelative} ref={countryRef}>
              <label>Phone</label>
              <div className={styles.telephoninput}>
                <div className={styles.countrycodeselectormain}>
                  <div className={styles.countrycodeselectorrelative}>
                    <div
                      className={styles.countrycodeselector}
                      onClick={() => setShowCountryDropdown((prev) => !prev)}
                    >
                      <span>{selectedCountryCode}</span>
                      <div className={styles.dropdownarrow}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M5 7.5L10 12.5L15 7.5"
                            stroke="#999999"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    {showCountryDropdown && (
                      <div className={styles.dropdown}>
                        <div className={styles.searchContainer}>
                          <input
                            type="text"
                            placeholder="Search country code..."
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className={styles.dropdownSpacing}>
                          {regions
                            .filter(
                              (region) =>
                                region.numberCode.includes(searchTerm) ||
                                region.name
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase()) ||
                                region.code
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase()),
                            )
                            .map((region) => (
                              <div
                                className={styles.iconText}
                                key={region.code}
                                onClick={() => {
                                  const newCountryCode = region.numberCode;
                                  setSelectedCountryCode(newCountryCode);
                                  setShowCountryDropdown(false);
                                  setSearchTerm("");
                                }}
                              >
                                <span className={styles.countryCode}>
                                  {region.numberCode}
                                </span>
                                <span className={styles.countryName}>
                                  ({region.code}) {region.name}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={styles.separator}>|</div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter your number"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 15);
                      setFormData({ ...formData, phoneNumber: value });
                      if (phoneError) setPhoneError("");
                    }}
                    onBlur={(e) => {
                      if (e.target.value && e.target.value.length < 10) {
                        setPhoneError(
                          "Phone number must be at least 10 digits",
                        );
                      } else {
                        setPhoneError("");
                      }
                    }}
                    className={`${styles.phoneInput} ${phoneError ? styles.error : ""}`}
                  />
                  {phoneError && (
                    <span className={styles.errorMessage}>{phoneError}</span>
                  )}
                  {errors.phoneNumber && (
                    <span className={styles.errorMessage}>
                      {errors.phoneNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Input
            label="Email"
            placeholder="Enter Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            smallInput
            disabled
            error={errors.email}
          />
          <div className={styles.selectWrapper}>
            <label>Country</label>
            <CountrySelect
              onChange={handleCountryChange}
              placeHolder="Select Country"
              defaultValue={countryId}
              key={`country-${countryId}`}
            />
            {errors.country && (
              <span className={styles.errorMessage}>{errors.country}</span>
            )}
          </div>
          <div className={styles.selectWrapper}>
            <label>State</label>
            <StateSelect
              countryid={countryId}
              onChange={handleStateChange}
              placeHolder="Select State"
              defaultValue={stateId}
              key={`state-${stateId}`}
            />
            {errors.state && (
              <span className={styles.errorMessage}>{errors.state}</span>
            )}
          </div>
          <div className={styles.selectWrapper}>
            <label>City</label>
            <CitySelect
              countryid={countryId}
              stateid={stateId}
              onChange={handleCityChange}
              placeHolder="Select City"
              defaultValue={cityId}
              key={`city-${cityId}`}
            />
            {errors.city && (
              <span className={styles.errorMessage}>{errors.city}</span>
            )}
          </div>
          <CustomDropdown
            label="Gender"
            value={formData.gender}
            onChange={handleChange}
            placeholder="Select your gender"
            error={errors.gender}
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Other", label: "Other" },
            ]}
          />
          {errors.gender && (
            <span className={styles.errorMessage}>{errors.gender}</span>
          )}
        </div>
        <div className={styles.saveButton}>
          <Button
            className={styles.buttonwidth}
            text={saving ? "Saving..." : "Save"}
            disabled={loading || saving}
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
}
