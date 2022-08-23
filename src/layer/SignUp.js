import React, { Fragment, useEffect, useState } from "react";
import ReactDom from "react-dom";
import style from "./SignUp.module.css";
import { MainContext, useContext } from "../context/context";
import { Button } from "@mui/material";
import Input from "../Input";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { firebaseApp } from "../firebase";

function SignUp() {
  const { user, setUser, signIn, setSignIn, signUp, setSignUp } =
    useContext(MainContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        console.log(authUser);
        setUser(authUser);
        setUsername(authUser.displayName);
      } else {
        // user has logged out
        setUser(null);
      }
    });

    return () => {
      // cleanup function
      unsubscribe();
    };
  }, [auth]);

  const clickSignUp = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        updateProfile(auth.currentUser, { displayName: username }).catch(
          (err) => {
            alert(err.message);
          }
        );
      })
      .catch((error) => alert(error.message));
    setSignUp(false);
  };

  const clickSignIn = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      alert(error.message);
    });
    setUser(auth.currentUser);
    setSignIn(false);
  };

  return ReactDom.createPortal(
    <Fragment>
      {signUp && (
        <>
          <div
            className={style.back}
            onClick={() => {
              setSignUp(false);
            }}
          />
          <div className={style.overlay}>
            <form className={style.signUp}>
              <center>
                <img
                  className={style.overlayImage}
                  src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
                  alt="instagram"
                />
              </center>
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" onClick={clickSignUp}>
                Sign Up
              </Button>
            </form>
          </div>
        </>
      )}
      {signIn && (
        <>
          <div
            className={style.back}
            onClick={() => {
              setSignIn(false);
            }}
          />
          <div className={style.overlay}>
            <form className={style.signUp}>
              <center>
                <img
                  className={style.overlayImage}
                  src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
                  alt="instagram"
                />
              </center>

              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" onClick={clickSignIn}>
                Sign In
              </Button>
            </form>
          </div>
        </>
      )}
    </Fragment>,
    document.getElementById("overlay")
  );
}

export default SignUp;
