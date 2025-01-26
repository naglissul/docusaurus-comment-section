import React, { useState, useEffect } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  addDoc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { useFirebase } from "./FirebaseContext";
import {
  Box,
  Button,
  List,
  ListItem,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";

export default function CommentSection({
  postId,
  isDefaultVerified: propVerified = true,
}) {
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [docVerified, setDocVerified] = useState(propVerified);
  const [comments, setComments] = useState([]);
  const { db } = useFirebase();

  useEffect(() => {
    const postRef = doc(db, "posts", postId);

    // Check if the post exists and create it if it doesn't
    getDoc(postRef).then((snap) => {
      if (!snap.exists()) {
        setDoc(postRef, { isDefaultVerified: propVerified })
          .then(() => console.log(`Post ${postId} created.`))
          .catch((error) => console.error("Error creating post:", error));
      } else {
        setDocVerified(snap.data().isDefaultVerified);
      }
    });

    // Listen for updates to the post
    const unsubPost = onSnapshot(postRef, (snap) => {
      if (snap.exists()) {
        setDocVerified(snap.data().isDefaultVerified);
      } else {
        setDocVerified(propVerified);
      }
    });

    // Listen for comments on the post
    const commentsRef = collection(db, "comments");
    const q = query(commentsRef, where("postId", "==", postId));
    const unsubComments = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach((d) => {
        const data = d.data();
        if (data.timestamp && typeof data.timestamp.toDate === "function") {
          data.timestamp = data.timestamp.toDate();
        }
        if (
          data.createdAtClient &&
          typeof data.createdAtClient.toDate === "function"
        ) {
          data.createdAtClient = data.createdAtClient.toDate();
        }
        list.push({ id: d.id, ...data });
      });
      setComments(list);
    });

    return () => {
      unsubPost();
      unsubComments();
    };
  }, [postId, db, propVerified]);

  async function submitComment() {
    if (!docVerified)
      alert(
        "Your comment is not verified and won't be visible until verified."
      );

    const clientTimestamp = new Date();

    const newComment = {
      postId,
      content,
      name,
      isAuthor: false,
      email,
      verified: docVerified,
      timestamp: serverTimestamp(),
      createdAtClient: clientTimestamp,
    };

    try {
      await addDoc(collection(db, "comments"), newComment);
      setContent("");
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("There was an error adding your comment. Please try again.");
    }
  }

  function formatDate(date) {
    if (!(date instanceof Date)) {
      console.error("formatDate: Expected a Date object, received:", date);
      return "Invalid Date";
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  const displayedComments = comments.filter((c) => c.verified);

  return (
    <Box
      sx={{
        maxWidth: 600,
        minWidth: 600,
        width: 600,
        margin: "0 auto",
        p: 2,
      }}
    >
      <h2>Comments</h2>
      <List>
        {displayedComments.map((c) => {
          let displayTimestamp = "";
          if (c.timestamp instanceof Date) {
            displayTimestamp = formatDate(c.timestamp);
          } else if (c.createdAtClient instanceof Date) {
            displayTimestamp = formatDate(c.createdAtClient);
          } else {
            displayTimestamp = "Just now";
          }

          return (
            <ListItem key={c.id} sx={{ display: "block" }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {c.name || "Anonymous"}
              </Typography>
              <Typography fontSize="8px" color="textSecondary" sx={{ mb: 1 }}>
                {displayTimestamp}
              </Typography>
              <Typography variant="body1">{c.content}</Typography>
              <hr />
            </ListItem>
          );
        })}
      </List>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
        }}
      >
        <TextareaAutosize
          placeholder="Comment*"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ minHeight: 100 }}
        />
        <TextField
          label="Name (optional)"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email (optional, not shown)"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button variant="contained" onClick={submitComment}>
          Add Comment
        </Button>
      </Box>
    </Box>
  );
}
