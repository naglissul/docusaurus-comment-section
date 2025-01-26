import React, { useState, useEffect } from "react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useFirebase } from "./FirebaseContext";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
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
    const docRef = doc(db, "comments", postId);
    const unsub = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setComments(data.comments || []);
        setDocVerified(data.isDefaultVerified);
      } else {
        setComments([]);
        setDocVerified(propVerified);
      }
    });
    return () => unsub();
  }, [postId, db, propVerified]);

  async function submitComment() {
    // If docVerified is false, let user know their comment won't be visible until verified
    if (!docVerified) {
      alert(
        "Your comment is not verified, so it won't be displayed until the post author verifies it."
      );
    }

    const newComment = {
      content,
      name,
      isAuthor: false,
      email,
      verified: docVerified,
    };

    await addComment(postId, newComment);
    setContent("");
    setName("");
    setEmail("");
  }

  async function addComment(postId, newComment) {
    const docRef = doc(db, "comments", postId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      await setDoc(docRef, {
        postId,
        isDefaultVerified: propVerified,
        comments: [newComment],
      });
    } else {
      await updateDoc(docRef, {
        comments: arrayUnion(newComment),
      });
    }
  }

  // Filter out comments that are not verified
  const displayedComments = comments.filter((c) => c.verified);
  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Comments for {postId}
      </Typography>
      <List>
        {displayedComments.map((c, idx) => (
          <ListItem key={idx}>
            <ListItemText primary={`${c.name || "Anonymous"}: ${c.content}`} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        <TextField
          label="Content"
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
