import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

const LessonCard = ({ courseId, lesson }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      const snapshot = await getDocs(collection(db, `courses/${courseId}/lessons/${lesson.id}/comments`));
      setComments(snapshot.docs.map(doc => doc.data()));
    };
    fetchComments();
  }, [courseId, lesson.id]);

  const addComment = async () => {
    if(commentText.trim() === "") return;
    await addDoc(collection(db, `courses/${courseId}/lessons/${lesson.id}/comments`), { user: "CurrentUser", text: commentText });
    setCommentText("");
  };

  return (
    <div className="lesson-card">
      <h4>{lesson.title}</h4>
      <p>{lesson.content}</p>
      <div>
        {comments.map((c,i) => <p key={i}><strong>{c.user}</strong>: {c.text}</p>)}
      </div>
      <input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Коммент жаз..." />
      <button onClick={addComment}>Жібер</button>
    </div>
  );
};

export default LessonCard;
