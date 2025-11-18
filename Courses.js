import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import CourseCard from "./CourseCard";
import CourseDetail from "./CourseDetail";

const Courses = ({ currentUser }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      const snapshot = await getDocs(collection(db, "courses"));
      const data = await Promise.all(snapshot.docs.map(async doc => {
        const courseData = doc.data();
        courseData.id = doc.id;
        const lessonsSnap = await getDocs(collection(db, `courses/${doc.id}/lessons`));
        courseData.lessons = lessonsSnap.docs.map(ld => ({ ...ld.data(), id: ld.id }));
        return courseData;
      }));
      setCourses(data);
    };
    fetchCourses();
  }, []);

  const filtered = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()));

  if(selectedCourse) {
    return (
      <div>
        <button onClick={()=>setSelectedCourse(null)}>Курстарға қайту</button>
        <CourseDetail course={selectedCourse} currentUser={currentUser} />
      </div>
    );
  }

  return (
    <div>
      <input placeholder="Курстарды ізде..." value={search} onChange={e=>setSearch(e.target.value)} />
      {filtered.map(c=> <CourseCard key={c.id} course={c} onSelect={setSelectedCourse} />)}
    </div>
  );
};

export default Courses;
