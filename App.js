import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Auth from "./components/Auth";
import Courses from "./components/Courses";
import "./styles.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, setUser);
  }, []);

  return (
    <div className="App">
      <header>
        <h1>EduPlatform</h1>
      </header>
      {!user ? <Auth user={user} setUser={setUser} /> : <Courses currentUser={user} />}
    </div>
  );
}

export default App;
