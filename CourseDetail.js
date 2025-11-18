import React from "react";
import LessonCard from "./LessonCard";

const CourseDetail = ({ course, currentUser }) => {
  return (
    <div className="course-detail">
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      {course.lessons.map((lesson,i)=>(
        <LessonCard key={i} lesson={lesson} courseId={course.id} currentUser={currentUser} />
      ))}
    </div>
  );
};

export default CourseDetail;
