"use client";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import styles from "./coursesDetails.module.scss";
import CoursesDetailsBanner from "./coursesDetailsBanner";
import CourseContent from "./courseContent";
import OnDemandCourses from "../courses/onDemandCourses";
import ClassroominYourPocket from "../home/classroominYourPocket";
import FaqSection from "../home/faqSection";
import { topCoursesData } from "@/constants";
import { getCourseByType } from "@/services/dashboard";
export default function CoursesDetails() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params?.id;
  const courseType = searchParams.get("courseType");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourseByType();
        setCourses(response.payload.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const similarCourses = courses[courseType]?.filter(
    (course) => course._id !== courseId && course.courseType === courseType
  );

  return (
    <div>
      <CoursesDetailsBanner />
      <CourseContent />
      <OnDemandCourses title="similar courses" data={similarCourses} activeType={courseType} loading={loading} />
      <ClassroominYourPocket />
      <FaqSection />
    </div>
  );
}
