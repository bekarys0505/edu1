import React, { useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";

const Auth = ({ user, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Тіркелу сәтті!");
    } catch (err) {
      alert(err.message);
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  const googleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      alert(err.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  if (user) {
    return (
      <div>
        <p>Қош келдің, {user.email}</p>
        <button onClick={logout}>Шығу</button>
      </div>
    );
  }

  return (
    <div>
      <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input type="password" placeholder="Құпия сөзді енгіз" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button onClick={register}>Тіркелу</button>
      <button onClick={login}>Кіру</button>
      <button onClick={googleLogin}>Google арқылы кіру</button>
    </div>
  );
};

export default Auth;
