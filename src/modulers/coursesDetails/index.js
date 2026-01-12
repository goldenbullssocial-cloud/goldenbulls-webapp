  import React from "react";
import styles from "./coursesDetails.module.scss";
import CoursesDetailsBanner from "./coursesDetailsBanner";
import CourseContent from "./courseContent";
import OnDemandCourses from "../courses/onDemandCourses";
import ClassroominYourPocket from "../home/classroominYourPocket";
import FaqSection from "../home/faqSection";
import { topCoursesData } from "@/constants";
export default function CoursesDetails() {
  return (
    <div>
      <CoursesDetailsBanner />
      <CourseContent />
      <OnDemandCourses title="similar courses" data={topCoursesData.live} />
      <ClassroominYourPocket />
      <FaqSection />
    </div>
  );
}
