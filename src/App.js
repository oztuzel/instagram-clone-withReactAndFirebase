import React, {
  useState,
  useEffect,
  Fragment,
  useCallback,
  useMemo,
} from "react";
import style from "./App.module.css";
import Post from "./Post";
import { db, firebaseApp } from "./firebase.js";
import { getAuth } from "firebase/auth";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Button } from "@mui/material";
import { MainContext } from "./context/context";
import SignUp from "./layer/SignUp";
import ImageUpload from "./ImageUpload";

function App() {
  const [signUp, setSignUp] = useState(false);
  const [signIn, setSignIn] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  
  const auth = getAuth(firebaseApp);
  
  useEffect(() => {
    const postsRef = collection(db, "posts");
    const dataTimestamp = query(postsRef, orderBy("timestamp", "desc"));
    let data = onSnapshot(
      dataTimestamp,
      (snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      },
      (error) => {
        alert(error.message);
      }
    );
  }, [posts]);

  const clickSignUp = useCallback(() => {
    setSignUp(signUp === false ? true : false);
  }, []);

  const clickSignIn = useCallback(() => {
    setSignIn(signIn === false ? true : false);
  }, []);

  const data = useMemo(() => {
    return {
      user,
      setUser,
      signIn,
      setSignIn,
      signUp,
      setSignUp,
    };
  });

  return (
    <MainContext.Provider value={data}>
      <Fragment>
        <div className={!signUp ? style.app : style.appGrey}>
          <div className={style["app__header"]}>
            <img
              className={style["app__headerImage"]}
              src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
              alt="instagram"
            />
            {!user ? (
              <div>
                <Button onClick={clickSignIn}> Sign In </Button>
                <Button onClick={clickSignUp}> Sign Up </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  auth.signOut();
                  setUser(null);
                }}
              >
                Logout
              </Button>
            )}
          </div>

          <div className={style.posts}>
            {posts.map(({ id, post }) => (
              <Post
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
                key={id}
                postId={id}
                currentUser={user ? auth.currentUser.displayName : ''}
              />
            ))}
          </div>

          {user ? (
            <ImageUpload username={auth.currentUser.displayName} />
          ) : (
            <h3> You need the login to upload</h3>
          )}
        </div>
      </Fragment>
      {signUp && <SignUp />}
      {signIn && <SignUp />}
    </MainContext.Provider>
  );
}
export default React.memo(App);
