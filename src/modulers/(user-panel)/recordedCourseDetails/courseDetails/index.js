"use client";
import React, { useEffect, useState } from 'react'
import styles from './courseDetails.module.scss';
import Button from '@/components/button';
import ClockIcon from '@/icons/clockIcon';
import StarIcon from '@/icons/starIcon';
import classNames from 'classnames';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPaymentUrl } from '@/services/dashboard';
import toast from 'react-hot-toast';
import { getCourses, submitReview, updateVideoProgress, getBatches, downloadCourseCertificate, downloadStudentID } from '@/services/courses';
import { getChapters, getProfile } from '@/services/dashboard';
import { useRef } from 'react';
import CourseContent from '../courseContent';
import { getCookie } from '../../../../../cookie';

const PlayIcon = () => (
    <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="34" cy="34" r="34" fill="black" fillOpacity="0.4" />
        <path d="M45 34L28.5 43.5263L28.5 24.4737L45 34Z" fill="white" />
    </svg>
);

const CourseImageDefault = '/assets/images/course-lg.png';

const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 5L5 15M5 5L15 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ExpandIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 3H21M21 3V9M21 3L14 10M9 21H3M3 21V15M3 21L10 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function CourseDetails({ selectedVideo, chapters, onVideoSelect, onProgressUpdate }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');
    const [course, setCourse] = useState(null);
    const [currentPercentage, setCurrentPercentage] = useState(0); // This tracks the saved/highest percentage
    const [displayPercentage, setDisplayPercentage] = useState(0); // This tracks the live UI percentage
    const [currentChapter, setCurrentChapter] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [isDownloadingCertificate, setIsDownloadingCertificate] = useState(false);
    const [isDownloadingStudentID, setIsDownloadingStudentID] = useState(false);

    // Batch Modal State
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [selectedBatchId, setSelectedBatchId] = useState(null);
    const [isNearbyCenters, setIsNearbyCenters] = useState(false);
    const [batchData, setBatchData] = useState([]);
    const [isBatchesLoading, setIsBatchesLoading] = useState(false);

    // Before Proceed Modal State
    const [showBeforeProceedModal, setShowBeforeProceedModal] = useState(false);
    const [useWalletBalance, setUseWalletBalance] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [selectedBatch, setSelectedBatch] = useState(null);

    const type = searchParams.get('type');
    const isPaymentSuccess = searchParams.get('isPayment');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFailureModal, setShowFailureModal] = useState(false);

    useEffect(() => {
        if (isPaymentSuccess === 'true') {
            setShowSuccessModal(true);
            // Clean up the URL
            const url = new URL(window.location.href);
            url.searchParams.delete('isPayment');
            window.history.replaceState({}, '', url);
        } else if (isPaymentSuccess === 'false') {
            setShowFailureModal(true);
            // Clean up the URL
            const url = new URL(window.location.href);
            url.searchParams.delete('isPayment');
            window.history.replaceState({}, '', url);
        }
    }, [isPaymentSuccess]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userData = getCookie("user");
                if (userData) {
                    const parsedUser = JSON.parse(userData)._id;
                    const response = await getProfile(parsedUser);
                    const user = response?.payload?.data?.[0] || response?.payload?.data;
                    setUserProfile(user);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchUserProfile();
    }, []);

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!id) return;
            try {
                // Fetch course details
                const res = await getCourses({ id });
                if (res?.payload?.data) {
                    const data = res?.payload?.data;
                    setCourse(Array.isArray(data) ? data[0] : data);
                }

                // If chapters are passed and no video selected, set initial video
                if (!selectedVideo && chapters && chapters.length > 0) {
                    const firstChapter = chapters[0];
                    const savedPercent = parseFloat(firstChapter?.courseTracking?.percentage || 0);
                    setCurrentChapter(firstChapter);
                    setCurrentPercentage(savedPercent);
                    setDisplayPercentage(savedPercent);
                } else if (!selectedVideo && !chapters) {
                    // Only fetch if chapters were not passed (initial load fallback)
                    const chaptersRes = await getChapters(id);
                    const chaptersData = chaptersRes?.payload?.data || [];
                    if (chaptersData.length > 0) {
                        const firstChapter = chaptersData[0];
                        const savedPercent = parseFloat(firstChapter?.courseTracking?.percentage || 0);
                        setCurrentChapter(firstChapter);
                        setCurrentPercentage(savedPercent);
                        setDisplayPercentage(savedPercent);
                    }
                }
            } catch (error) {
                console.error("Error fetching course data:", error);
            }
        };

        fetchCourseData();
    }, [id, selectedVideo, chapters]);

    useEffect(() => {
        const fetchBatches = async () => {
            if (!id || !showBatchModal) return;
            try {
                setIsBatchesLoading(true);
                const res = await getBatches({
                    courseId: id,
                    isMatchBatch: isNearbyCenters
                });
                if (res?.payload?.data) {
                    setBatchData(res?.payload?.data);
                } else if (res?.payload) {
                    setBatchData(res?.payload);
                } else {
                    setBatchData([]);
                }
            } catch (error) {
                console.error("Error fetching batches:", error);
                setBatchData([]);
            } finally {
                setIsBatchesLoading(false);
            }
        };

        if (showBatchModal) {
            fetchBatches();
        }
    }, [id, showBatchModal, isNearbyCenters]);

    useEffect(() => {
        if (selectedVideo) {
            const savedPercent = parseFloat(selectedVideo?.percentageCompleted || 0);
            setCurrentChapter(selectedVideo);
            setCurrentPercentage(savedPercent);
            setDisplayPercentage(savedPercent);
        }
    }, [selectedVideo]);

    const handleVideoPause = async () => {
        if (!videoRef.current || !currentChapter) return;

        const video = videoRef.current;
        const playedPercentage = (video.currentTime / video.duration) * 100;

        // Update percentage only if it's higher than what's already saved
        if (playedPercentage > currentPercentage) {
            try {
                const trackingId = currentChapter?.chapterTrakingId || currentChapter?.courseTracking?._id;
                const chapterId = currentChapter?.chapterId || currentChapter?._id;

                if (trackingId && chapterId && id) {
                    const roundedPercent = Math.round(playedPercentage);
                    await updateVideoProgress(trackingId, chapterId, id, roundedPercent);
                    setCurrentPercentage(roundedPercent);
                    setDisplayPercentage(roundedPercent);
                    if (onProgressUpdate) onProgressUpdate();
                }
            } catch (error) {
                console.error("Error updating video progress:", error);
            }
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const playedPercentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            // Only update display if it's progressing forward or meaningful change
            if (playedPercentage > displayPercentage) {
                setDisplayPercentage(playedPercentage);
            }
        }
    };

    useEffect(() => {
        if (isPlaying && videoRef.current) {
            videoRef.current.play();
        }
    }, [isPlaying]);

    const handleLoadedMetadata = () => {
        if (videoRef.current && currentPercentage > 0 && currentPercentage < 100) {
            const resumeTime = (currentPercentage / 100) * videoRef.current.duration;
            videoRef.current.currentTime = resumeTime;
            setDisplayPercentage(currentPercentage);
        }
    };

    const handlePlayVideo = () => {
        setIsPlaying(true);
    };

    const courseData = Array.isArray(course) ? course[0] : course;

    const handlePayment = async () => {
        try {
            const batchId = selectedBatch?._id;
            const successUrl = new URL(window.location.href);
            successUrl.searchParams.set("isPayment", "true");
            if (batchId) {
                successUrl.searchParams.set("batchId", batchId);
            }

            const walletAmount = useWalletBalance ? Math.min(userProfile?.earningBalance || 0, courseData?.price || 0) : 0;
            const actualAmount = useWalletBalance ? Math.max(0, (courseData?.price || 0) - (userProfile?.earningBalance || 0)) : courseData?.price || 0;

            const cancelUrl = new URL(window.location.href);
            cancelUrl.searchParams.set("isPayment", "false");
            if (batchId) {
                cancelUrl.searchParams.set("batchId", batchId);
            }

            const paymentData = {
                success_url: successUrl.toString(),
                cancel_url: cancelUrl.toString(),
                courseId: id,
                isWalletUse: useWalletBalance,
                walletAmount: walletAmount,
                actualAmount: actualAmount,
                price: courseData?.price || 0,
                isPayment: true
            };

            // Only add batchId if it's provided (for live/physical courses)
            if (batchId) {
                paymentData.batchId = batchId;
            }

            const response = await getPaymentUrl(paymentData);
            if (response?.payload?.code !== "00000") {
                toast.error(
                    "A payment session is already active and will expire in 10 minutes. Please complete the current payment or try again after it expires."
                );
            } else if (response?.payload?.data?.checkout_url) {
                toast.success("Redirecting to payment...");
                router.replace(response.payload.data.checkout_url);
            } else {
                toast.error(response?.message || "Failed to process payment. Please try again.");
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Failed to process payment. Please try again.");
        } finally {
            setShowBeforeProceedModal(false);
        }
    };

    const handleEnrollClick = async () => {
        if (courseData?.isFree) {
            try {
                const response = await getPaymentUrl({ courseId: id });
                if (response?.payload?.code === "11111") {
                    setShowSuccessModal(true);
                } else {
                    toast.error(response?.message || "Enrollment failed. Please try again.");
                }
            } catch (error) {
                console.error("Free enrollment error:", error);
                toast.error("Enrollment failed. Please try again.");
            }
        } else if (type === 'live' || type === 'physical') {
            setShowBatchModal(true);
        } else {
            setShowBeforeProceedModal(true);
        }
    };

    const handleReviewSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a rating.");
            return;
        }
        try {
            setIsReviewSubmitting(true);
            const reviewData = {
                courseId: id,
                rating: rating,
                review: reviewText
            };
            const response = await submitReview(reviewData);
            if (response.success) {
                toast.success(response.message || "Review submitted successfully!");
                setShowReviewModal(false);
                setRating(0);
                setReviewText("");
            } else {
                toast.error(response.message || "Failed to submit review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error(error.message || "An error occurred while submitting the review.");
        } finally {
            setIsReviewSubmitting(false);
        }
    };

    const handleJoinMeeting = () => {
        const meetingLink = courseData?.payment?.[0]?.batchId?.meetingLink;
        if (meetingLink) {
            window.open(meetingLink, '_blank');
        } else {
            toast.error("Meeting link is not available");
        }
    };

    const handleDownloadCertificate = async () => {
        if (isDownloadingCertificate) return;

        setIsDownloadingCertificate(true);
        try {
            if (!id) {
                throw new Error("No course selected");
            }

            const response = await downloadCourseCertificate(id);

            if (!response) {
                throw new Error("No response received from the server");
            }

            const fileUrl = typeof response === "object" ? response.payload : response;

            if (!fileUrl) {
                throw new Error("Certificate URL is missing in the response");
            }

            const fileRes = await fetch(fileUrl);
            if (!fileRes.ok) throw new Error("Failed to fetch certificate");

            const blob = await fileRes.blob();

            const contentType = fileRes.headers.get("content-type") || "application/octet-stream";

            const extensionMap = {
                "application/pdf": "pdf",
                "image/jpeg": "jpg",
                "image/png": "png",
                "image/webp": "webp",
                "text/html": "html",
                "application/json": "json",
            };

            const extension = extensionMap[contentType] || "bin";
            const fileName = `certificate-${courseData?.CourseName?.replace(/\s+/g, "-").toLowerCase() || "course"}.${extension}`;

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);

            toast.success("Certificate downloaded successfully!");
        } catch (error) {
            console.error("Download error:", error);
            toast.error(error.message || "Failed to download certificate");
        } finally {
            setIsDownloadingCertificate(false);
        }
    };

    const handleDownloadStudentID = async () => {
        if (isDownloadingStudentID) return;

        setIsDownloadingStudentID(true);
        try {
            if (!id) {
                throw new Error("No course selected");
            }

            const batchId = courseData?.payment?.[0]?.batchId?._id;
            if (!batchId) {
                throw new Error("No batch selected");
            }

            const response = await downloadStudentID(id, batchId);

            if (!response) {
                throw new Error("No response received from the server");
            }

            const fileUrl = typeof response === "object" ? response.payload : response;

            if (!fileUrl) {
                throw new Error("Student ID URL is missing in the response");
            }

            const fileRes = await fetch(fileUrl);
            if (!fileRes.ok) throw new Error("Failed to fetch student ID");

            const blob = await fileRes.blob();

            const contentType = fileRes.headers.get("content-type") || "application/octet-stream";

            const extensionMap = {
                "application/pdf": "pdf",
                "image/jpeg": "jpg",
                "image/png": "png",
                "image/webp": "webp",
                "text/html": "html",
                "application/json": "json",
            };

            const extension = extensionMap[contentType] || "bin";
            const fileName = `student-${Date.now()}.${extension}`;

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);

            toast.success("Student ID downloaded successfully!");
        } catch (error) {
            console.error("Download error:", error);
            toast.error(error.message || "Failed to download student ID");
        } finally {
            setIsDownloadingStudentID(false);
        }
    };

    // Calculate average completion percentage
    const averageCompletion = chapters && chapters.length > 0
        ? chapters.reduce((sum, chapter) => sum + parseFloat(chapter?.courseTracking?.percentage || 0), 0) / chapters.length
        : 0;

    return (
        <div className={styles.courseDetails}>
            <div className={styles.grid}>
                <div className={styles.griditems}>
                    <div className={styles.contnetStyle}>
                        <div className={styles.subtitle}>
                            <span style={{ textTransform: 'capitalize' }}>
                                {courseData?.courseType ? `${courseData?.courseType} Courses` : "Recorded Course"}
                            </span>
                            <h3>
                                {courseData?.CourseName}
                            </h3>
                            <p>
                                {courseData?.description}
                            </p>
                        </div>
                        {(type === 'physical' && courseData?.isPayment === true) && (
                            <div className={styles.locationInfo}>
                                <img src="/assets/icons/locationGrey.svg" alt="Location" />
                                <span>
                                    {courseData?.payment?.[0]?.batchId?.centerId
                                        ? `${courseData.payment[0].batchId.centerId.centerName}, ${courseData.payment[0].batchId.centerId.city}, ${courseData.payment[0].batchId.centerId.state}, ${courseData.payment[0].batchId.centerId.country}`
                                        : "Location info not available"}
                                </span>
                            </div>
                        )}
                        <div className={styles.leftBottomAlignment}>
                            <div className={styles.time}>
                                <ClockIcon />
                                <span>
                                    {(type === 'live' || type === 'physical')
                                        ? `${courseData?.chapter?.length || 0} Days`
                                        : `${courseData?.hours} Hours`}
                                </span>
                            </div>

                            <div className={styles.dotButton}>
                                <div className={styles.dot}></div>
                                <button>
                                    <span style={{ textTransform: 'capitalize' }}>{courseData?.courseLevel}</span>
                                </button>
                            </div>

                            <div className={styles.ratingAlignment}>
                                <div className={styles.dot}></div>
                                <div className={styles.rating}>
                                    <StarIcon />
                                    <span>{courseData?.averageRating ? Number(courseData.averageRating).toFixed(1) : "0.0"}</span>
                                </div>
                            </div>

                            <div className={styles.ratingAlignment}>
                                {courseData?.isPayment ? (
                                    <div className={styles.time}>
                                        <span
                                            className={styles.addReviewLink}
                                            onClick={() => setShowReviewModal(true)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Add a Review
                                        </span>
                                    </div>
                                ) : (<>
                                    <div className={styles.dot}></div>
                                    <div className={styles.time}><span>{courseData?.language || "English"}</span></div></>)}
                            </div>
                        </div>
                    </div>
                    <CourseContent
                        onVideoSelect={onVideoSelect}
                        chapters={chapters}
                    />
                </div>
                <div className={styles.griditems}>
                    <div className={styles.stickySection}>
                        <div className={styles.card}>
                            <div className={styles.image}>
                                {(type === 'live' || type === 'physical') ? (
                                    courseData?.courseIntroVideo ? (
                                        <video
                                            src={courseData?.courseIntroVideo}
                                            controls
                                            autoPlay
                                            muted
                                            width="100%"
                                            height="326px"
                                            style={{ borderRadius: '12px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <>
                                            <img src={courseData?.courseVideo || CourseImageDefault} alt='CourseImage' />
                                            <div className={styles.playButtonOverlay} onClick={handlePlayVideo}>
                                                <PlayIcon />
                                            </div>
                                        </>
                                    )
                                ) : (
                                    // For recorded courses, use existing logic
                                    courseData?.isPayment ? (
                                        showVideoModal ? (
                                            <>
                                                <img src={courseData?.courseVideo || CourseImageDefault} alt='CourseImage' style={{ opacity: 0.3 }} />
                                                <div className={styles.playButtonOverlay} onClick={() => setShowVideoModal(false)}>
                                                    <span style={{ color: '#fff', textAlign: 'center' }}>Video playing in expanded view...<br /><br />Click to Close</span>
                                                </div>
                                            </>
                                        ) : (
                                            (isPlaying || selectedVideo?.url) ? (
                                                <>
                                                    <video
                                                        ref={videoRef}
                                                        src={selectedVideo?.url || currentChapter?.chapterVideo}
                                                        controls
                                                        onPause={handleVideoPause}
                                                        onEnded={handleVideoPause}
                                                        onLoadedMetadata={handleLoadedMetadata}
                                                        onTimeUpdate={handleTimeUpdate}
                                                        autoPlay={isPlaying}
                                                        width="100%"
                                                        height="326px"
                                                        style={{ borderRadius: '12px', objectFit: 'cover' }}
                                                    />
                                                    <div
                                                        className={styles.expandOverlay}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowVideoModal(true);
                                                        }}
                                                        title="Expand Video"
                                                    >
                                                        <ExpandIcon />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <img src={courseData?.courseVideo || CourseImageDefault} alt='CourseImage' />
                                                    <div className={styles.playButtonOverlay} onClick={handlePlayVideo}>
                                                        <PlayIcon />
                                                    </div>
                                                </>
                                            )
                                        )
                                    ) : (
                                        courseData?.courseIntroVideo ? (
                                            <video
                                                src={courseData?.courseIntroVideo}
                                                controls
                                                autoPlay
                                                muted
                                                width="100%"
                                                height="326px"
                                                style={{ borderRadius: '12px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <>
                                                <img src={courseData?.courseVideo || CourseImageDefault} alt='CourseImage' />
                                                <div className={styles.playButtonOverlay} onClick={handlePlayVideo}>
                                                    <PlayIcon />
                                                </div>
                                            </>
                                        )
                                    )
                                )}
                            </div>
                            <div className={styles.details}>
                                {courseData?.isPayment ? (
                                    type === 'recorded' ? (
                                        <div className={styles.progressContainer}>
                                            <div className={styles.progress}>
                                                <div
                                                    className={styles.active}
                                                    style={{ width: `${displayPercentage}%` }}
                                                ></div>
                                            </div>
                                            <div className={styles.bottomText}>
                                                <span>{Math.round(displayPercentage)}% Completed</span>
                                            </div>
                                            {averageCompletion === 100 ? (
                                                <div className={styles.button} style={{ marginBottom: '12px' }}>
                                                    <Button
                                                        text={isDownloadingCertificate ? "Downloading..." : "Download Certificate"}
                                                        onClick={handleDownloadCertificate}
                                                        disabled={isDownloadingCertificate}
                                                    />
                                                </div>
                                            ) : (
                                                <div className={styles.button}>
                                                    <Button
                                                        text="Resume Course"
                                                        onClick={handlePlayVideo}
                                                    />
                                                </div>
                                            )}
                                            {/* <div className={styles.button}>
                                                <Button
                                                    text="Resume Course"
                                                    onClick={handlePlayVideo}
                                                />
                                            </div> */}
                                        </div>) : (
                                        type === 'live' ? (
                                            <div className={styles.button}>
                                                <Button
                                                    text="Join Meeting"
                                                    onClick={handleJoinMeeting}
                                                />
                                            </div>) : (
                                            <div className={styles.button}>
                                                <Button
                                                    text={isDownloadingStudentID ? "Downloading..." : "Download Student ID"}
                                                    onClick={handleDownloadStudentID}
                                                    disabled={isDownloadingStudentID}
                                                />
                                            </div>
                                        )
                                    )
                                ) : (
                                    <>
                                        <div className={styles.twoText}>
                                            <div className={`${styles.typeBadge} ${courseData?.isFree ? styles.free : styles.paid}`}>
                                                {courseData?.isFree ? "Free" : "Paid"}
                                            </div>
                                            <h4>
                                                {courseData?.isFree !== true && ("$" + courseData?.price)}
                                            </h4>
                                            <ul>
                                                <li>
                                                    {courseData?.instructor}
                                                </li>
                                            </ul>
                                        </div>
                                        <div className={styles.button}>
                                            <Button text="Enroll Now" onClick={handleEnrollClick} />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Batch Selection Modal */}
            {showBatchModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2>Select A Batch</h2>
                            <button className={styles.closeBtn} onClick={() => setShowBatchModal(false)}>
                                <CloseIcon />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.batchGrid}>
                                {isBatchesLoading ? (
                                    <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#B6B6B6' }}>Loading batches...</p>
                                ) : batchData?.length > 0 ? (
                                    batchData.map((batch) => (
                                        <div
                                            key={batch._id}
                                            className={classNames(styles.batchCard, { [styles.selected]: selectedBatchId === batch._id })}
                                            onClick={() => {
                                                setSelectedBatchId(batch._id);
                                                setSelectedBatch(batch);
                                            }}
                                        >
                                            <h4>{batch.batchName || `Batch ${batch.startDate ? new Date(batch.startDate).getFullYear() : '2025'}`}</h4>
                                            <p>Starts: <strong>{batch.startDate ? new Date(batch.startDate).toLocaleDateString('en-GB') : (batch.startTime ? new Date(batch.startTime).toLocaleDateString('en-GB') : 'N/A')}</strong></p>
                                            <p>Ends: <strong>{batch.endDate ? new Date(batch.endDate).toLocaleDateString('en-GB') : (batch.endTime ? new Date(batch.endTime).toLocaleDateString('en-GB') : 'N/A')}</strong></p>
                                            <p>Center: <strong>{batch.centerId?.centerName || batch.centerName || 'Main Center'}</strong></p>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#B6B6B6' }}>No batches available for this course.</p>
                                )}
                            </div>

                            {/* <div className={styles.toggleContainer}>
                                <span>Find centers in the nearby area</span>
                                <label className={styles.switch}>
                                    <input
                                        type="checkbox"
                                        checked={isNearbyCenters}
                                        onChange={(e) => setIsNearbyCenters(e.target.checked)}
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                            </div> */}

                            <div className={styles.modalFooter}>
                                <button className={styles.cancelBtn} onClick={() => setShowBatchModal(false)}>
                                    <span>Cancel</span>
                                </button>
                                <Button
                                    text="Proceed to Payment"
                                    onClick={() => {
                                        if (!selectedBatchId) {
                                            toast.error("Please select a batch first");
                                            return;
                                        }
                                        setShowBatchModal(false);
                                        setShowBeforeProceedModal(true);
                                    }}
                                    disabled={!selectedBatchId}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Before You Proceed Modal */}
            {showBeforeProceedModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2>Before You Proceed</h2>
                            <button className={styles.closeBtn} onClick={() => setShowBeforeProceedModal(false)}>
                                <CloseIcon />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.beforeProceedBody}>
                                {type === 'recorded' ? (
                                    <p className={styles.modalText}>
                                        You are about to enroll in this recorded course.
                                        You will have lifetime access to all course materials after payment.
                                    </p>
                                ) : (
                                    <>
                                        <div className={styles.detailsSection}>
                                            <h3>Location Details</h3>
                                            <div className={styles.detailsGrid}>
                                                <div className={styles.detailItem}>
                                                    <label>City</label>
                                                    <span>{selectedBatch?.centerId?.city}</span>
                                                </div>
                                                <div className={styles.detailItem}>
                                                    <label>State</label>
                                                    <span>{selectedBatch?.centerId?.state}</span>
                                                </div>
                                                <div className={styles.detailItem}>
                                                    <label>Country</label>
                                                    <span>{selectedBatch?.centerId?.country}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.detailsSection}>
                                            <h3>Batch Details</h3>
                                            <div className={styles.simpleList}>
                                                <div className={styles.listItem}>
                                                    <label>Course Name</label>
                                                    <span>{selectedBatch?.courseId?.CourseName}</span>
                                                </div>
                                                <div className={styles.listItem}>
                                                    <label>Start Date</label>
                                                    <span>{selectedBatch?.startDate ? new Date(selectedBatch.startDate).toLocaleDateString('en-GB') : (selectedBatch?.startTime ? new Date(selectedBatch.startTime).toLocaleDateString('en-GB') : 'N/A')}</span>
                                                </div>
                                                <div className={styles.listItem}>
                                                    <label>End Date</label>
                                                    <span>{selectedBatch?.endDate ? new Date(selectedBatch.endDate).toLocaleDateString('en-GB') : (selectedBatch?.endTime ? new Date(selectedBatch.endTime).toLocaleDateString('en-GB') : 'N/A')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {userProfile?.earningBalance > 0 && (
                                    <div className={styles.walletSection}>
                                        <label className={styles.checkboxContainer}>
                                            <input
                                                type="checkbox"
                                                checked={useWalletBalance}
                                                onChange={(e) => setUseWalletBalance(e.target.checked)}
                                            />
                                            <span className={styles.checkboxLabel}>
                                                Use Wallet Balance
                                                <span className={styles.amount}>(Available: ${(userProfile?.earningBalance || 0).toFixed(2)})</span>
                                            </span>
                                        </label>
                                    </div>
                                )}

                                <div className={styles.noteSection}>
                                    <p>
                                        <strong>Note:</strong> Please verify all the details before proceeding to payment.
                                        Once payment is made, it cannot be refunded.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.modalFooter}>
                                <button className={styles.cancelBtn} onClick={() => setShowBeforeProceedModal(false)}>
                                    <span>Cancel</span>
                                </button>
                                <Button
                                    text="Proceed to Payment"
                                    onClick={handlePayment}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showReviewModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>

                            <h2>Add Review</h2>
                            <button className={styles.closeBtn} onClick={() => setShowReviewModal(false)}>
                                <CloseIcon />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.starRating}>
                                {[1, 2, 3, 4, 5].map((idx) => {
                                    // Calculate fill percent for this star
                                    let fill = 0;
                                    if (rating >= idx) {
                                        fill = 100;
                                    } else if (rating > idx - 1) {
                                        fill = 50;
                                    }

                                    return (
                                        <div key={idx} className={styles.star}>
                                            <div
                                                className={styles.halfStarLeft}
                                                onClick={() => setRating(idx - 0.5)}
                                            />
                                            <div
                                                className={styles.halfStarRight}
                                                onClick={() => setRating(idx)}
                                            />
                                            <StarIcon fillPercent={fill} id={`star_${idx}`} />
                                        </div>
                                    );
                                })}
                            </div>
                            <div className={styles.reviewInput}>
                                <textarea
                                    placeholder="Write a Review"
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                />
                            </div>
                            <div className={styles.submitSection}>
                                <Button
                                    text={isReviewSubmitting ? "Submitting..." : "Submit Review"}
                                    onClick={handleReviewSubmit}
                                    disabled={rating === 0 || isReviewSubmitting}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Expansion Modal */}
            {showVideoModal && (
                <div className={styles.modalOverlay} onClick={() => setShowVideoModal(false)}>
                    <div className={styles.videoModalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setShowVideoModal(false)}>
                            <CloseIcon />
                        </button>
                        <video
                            ref={videoRef}
                            src={selectedVideo?.url || currentChapter?.chapterVideo}
                            controls
                            autoPlay
                            onPause={handleVideoPause}
                            onEnded={handleVideoPause}
                            onLoadedMetadata={handleLoadedMetadata}
                            onTimeUpdate={handleTimeUpdate}
                            width="100%"
                            height="100%"
                            style={{ borderRadius: '12px' }}
                        />
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.successModalContent}>
                        <div className={styles.iconWrapper}>
                            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="40" cy="40" r="40" fill="#E8F5E9" />
                                <path d="M54.6667 29.3333L34.6667 49.3333L25.3334 40" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h2>Enrollment Successful!</h2>
                        <p>You've been successfully enrolled in this course. You now have full access to all course content.</p>
                        <div className={styles.successButton}>
                            <Button
                                text="Start Learning"
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    window.location.reload();
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Failure Modal */}
            {showFailureModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.successModalContent}>
                        <div className={styles.iconWrapper}>
                            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="40" cy="40" r="40" fill="#FFEBEE" />
                                <path d="M50 30L30 50M30 30L50 50" stroke="#F44336" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h2>Payment Failed!</h2>
                        <p>Your payment was cancelled or expired. Please try again to enroll in this course.</p>
                        <div className={styles.successButton}>
                            <Button
                                text="Try Again"
                                onClick={() => {
                                    setShowFailureModal(false);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
