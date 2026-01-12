import React, { Fragment } from "react";
import CoursesDetails from "@/modulers/coursesDetails";
import { topCoursesData } from "@/constants";

export async function generateMetadata({ params }) {
  const { id } = params;
  
  // Find course from all categories
  const allCourses = [
    ...topCoursesData.recorded,
    ...topCoursesData.live,
    ...topCoursesData.inPerson
  ];
  
  const course = allCourses.find(c => c.id === id);
  
  if (!course) {
    return {
      title: "Course Details - Golden Bulls",
      description: "Explore detailed information about our trading courses.",
    };
  }
  
  return {
    title: `${course.title} - Golden Bulls`,
    description: `Learn ${course.title} with ${course.author}. ${course.duration} of comprehensive content. Level: ${course.level}. Price: ${course.price}`,
    keywords: `${course.title}, trading course, ${course.author}, forex, crypto, ${course.level} level`,
  };
}

const CourseDetails = () => {
  return (
    <Fragment>
      <CoursesDetails />
    </Fragment>
  );
};

export default CourseDetails;
