"use client";
import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import styles from "./coursesDetails.module.scss";
import CoursesDetailsBanner from "./coursesDetailsBanner";
import CourseContent from "./courseContent";
import OnDemandCourses from "../courses/onDemandCourses";
import ClassroominYourPocket from "../home/classroominYourPocket";
import FaqSection from "../home/faqSection";

export default function CoursesDetails() {
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params?.id;
  const courseType = searchParams.get("courseType");

  return (
    <div>
      <CoursesDetailsBanner />
      <CourseContent />
      <OnDemandCourses title="Similar courses" activeType={courseType} excludeCourseId={courseId} />
      <ClassroominYourPocket />
      <FaqSection />
    </div>
  );
}
