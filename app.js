// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBvWDhmgbbGStO5zG6pEsdiWWvAC3HKvvM",
  authDomain: "prob1-c8abe.firebaseapp.com",
  projectId: "prob1-c8abe",
  storageBucket: "prob1-c8abe.firebasestorage.app",
  messagingSenderId: "346549546310",
  appId: "1:346549546310:web:14599cebcc1e343c918947"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const authSection = document.getElementById("auth-section");
const userSection = document.getElementById("user-section");
const welcome = document.getElementById("welcome");
const coursesDiv = document.getElementById("courses");

// ===== AUTH =====
function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email,password)
    .then(()=>alert("Тіркелу сәтті!"))
    .catch(err=>alert(err.message));
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email,password)
    .catch(err=>alert(err.message));
}

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .catch(err=>alert(err.message));
}

function logout() { auth.signOut(); }

auth.onAuthStateChanged(user=>{
  if(user){
    authSection.style.display="none";
    userSection.style.display="block";
    welcome.textContent=`Қош келдің, ${user.email}`;
    loadCourses();
  } else {
    authSection.style.display="block";
    userSection.style.display="none";
  }
});

// ===== COURSES =====
async function loadCourses(){
  const snapshot = await db.collection("courses").get();
  displayCourses(snapshot.docs);
}

function displayCourses(docs){
  coursesDiv.innerHTML="";
  docs.forEach(doc=>{
    const data = doc.data();
    const courseDiv = document.createElement("div");
    courseDiv.className="course";
    courseDiv.innerHTML=`<strong>${data.title}</strong>: ${data.description}`;

    const lessonDiv = document.createElement("div");
    db.collection("courses").doc(doc.id).collection("lessons").get().then(lessonSnap=>{
      lessonSnap.docs.forEach(lessonDoc=>{
        const lessonData = lessonDoc.data();
        const lDiv = document.createElement("div");
        lDiv.className="lesson";
        lDiv.innerHTML=`<strong>${lessonData.title}</strong>: ${lessonData.content}`;

        const commentsDiv = document.createElement("div");
        db.collection("courses").doc(doc.id).collection("lessons").doc(lessonDoc.id)
          .collection("comments").get().then(comSnap=>{
            comSnap.docs.forEach(cDoc=>{
              const cData = cDoc.data();
              const cDiv = document.createElement("div");
              cDiv.className="comment";
              cDiv.textContent=`${cData.user}: ${cData.text}`;
              commentsDiv.appendChild(cDiv);
            });
          });

        const commentInput = document.createElement("input");
        commentInput.placeholder="Комментарий жаз...";
        const commentBtn = document.createElement("button");
        commentBtn.textContent="Жібер";
        commentBtn.onclick = ()=>{
          if(auth.currentUser && commentInput.value.trim()!==""){
            db.collection("courses").doc(doc.id).collection("lessons").doc(lessonDoc.id)
              .collection("comments").add({
                user: auth.currentUser.email,
                text: commentInput.value.trim()
              });
            commentInput.value="";
          }
        }

        lDiv.appendChild(commentsDiv);
        lDiv.appendChild(commentInput);
        lDiv.appendChild(commentBtn);
        lessonDiv.appendChild(lDiv);
      });
    });

    courseDiv.appendChild(lessonDiv);
    coursesDiv.appendChild(courseDiv);
  });
}

// ===== SEARCH =====
async function searchCourses(){
  const query = document.getElementById("search").value.toLowerCase();
  const snapshot = await db.collection("courses").get();
  const results = snapshot.docs.filter(doc=>{
    const data = doc.data();
    return data.title.toLowerCase().includes(query) || data.description.toLowerCase().includes(query);
  });
  displayCourses(results);
}
