import React, { useCallback, useEffect, useState } from "react";
import style from "./Post.module.css";
import Avatar from "@mui/material/Avatar";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase.js";
import { MainContext, useContext } from "./context/context";

function Post({ postId, imageUrl, username, caption, currentUser }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const { user } = useContext(MainContext);

  useEffect(() => {
    let commentsRef = collection(db, "posts", postId, "comments");
    let dataRef = query(commentsRef, orderBy("timestamp", "desc"));
    let data;
    if (postId) {
      data = onSnapshot(
        dataRef,
        (snapshot) => {
          snapshot.docs.map((doc) => {
            return setComments((prevState) => [doc.data(), ...prevState]);
          });
        },
        (err) => {
          alert(err.message);
        }
      );
    }
    return () => {
      data();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    let commentsRef = collection(db, "posts", postId, "comments");
    addDoc(commentsRef, {
      text: comment,
      username: currentUser,
      timestamp: serverTimestamp(),
    });
    setComment("");
  };

  return (
    <div className={style.post}>
      <div className={style["post__header"]}>
        <Avatar
          className={style["post__avatar"]}
          alt="oztuzel"
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>

      <img className={style["post__image"]} src={imageUrl} alt="" />

      <h4 className={style["post__text"]}>
        <strong>{username}</strong> {caption}
      </h4>

      <div className={style.comments}>
        {comments.map((com) => {
          return (
            <p>
              <b>{com.username}</b> {com.text}
            </p>
          );
        })}
      </div>

      {user && (
        <form className={style.commentBox}>
          <input
            className={style.commentInput}
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            disabled={!comment}
            className={style.commentButton}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default React.memo(Post);
