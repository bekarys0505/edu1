// npm install firebase-admin
const admin = require("firebase-admin");
const fs = require("fs");

// Firebase Admin SDK JSON service account key
const serviceAccount = require("./serviceAccountKey.json"); // Firebase console-дан ал

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// JSON оқу
const data = JSON.parse(fs.readFileSync("courses.json", "utf8"));

async function importCourses() {
  for (const course of data.courses) {
    const courseRef = db.collection("courses").doc(course.id);
    await courseRef.set({
      title: course.title,
      description: course.description
    });

    for (const lesson of course.lessons) {
      const lessonRef = courseRef.collection("lessons").doc(lesson.id);
      await lessonRef.set({
        title: lesson.title,
        content: lesson.content
      });

      for (const comment of lesson.comments) {
        await lessonRef.collection("comments").add({
          user: comment.user,
          text: comment.text
        });
      }
    }
    console.log(`Курс ${course.title} импортталды!`);
  }
  console.log("Барлық курстар импортталды!");
}

importCourses().catch(console.error);
