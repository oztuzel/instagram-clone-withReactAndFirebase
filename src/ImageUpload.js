import { Button } from "@mui/material";
import React, { useState } from "react";
import style from "./ImageUpload.module.css";
import { storage, db } from "./firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, serverTimestamp, addDoc } from "firebase/firestore";

function ImageUpload({ username }) {
  console.log('imageUpload is running')
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const postsRef = collection(db, "posts");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress function
        const progressing = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progressing);
      },
      (err) => {
        // error function
        alert(err.message);
      },
      () => {
        // complete function
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          // post image inside database
          addDoc(postsRef, {
            timestamp: serverTimestamp(),
            caption: caption,
            imageUrl: url,
            username: username,
          })
            .then(() => {})
            .catch((err) => {
              alert(err.message);
            });
        });
        setProgress(0);
        setCaption("");
        setImage(null);
      }
    );
  };

  return (
    <div className={style.imageUpload}>
      <progress className={style.progress} value={progress} max="100" />
      <input
        type="text"
        placeholder="Enter a caption..."
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <input type="file" onChange={handleChange} />
      <Button className={style.button} onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
}

export default ImageUpload;
