import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { UserAuth } from "../firebase/context/AuthContext";
import { toast } from "sonner";
import styles from "../styles/discussions.module.css";

function Discussions({ docId }) {
  const { user } = UserAuth();
  const [discussions, setDiscussions] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Fetch comments for the specific request (docId)
    const commentsRef = collection(db, "discussions", docId, "comments");
    const commentsQuery = query(commentsRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => doc.data());
      setDiscussions(commentsData);
    });

    return () => {
      unsubscribe(); // Unsubscribe from real-time updates when component unmounts
    };
  }, [docId]);

  const handleAddComment = async () => {
    if (newComment.trim() === "") {
      return;
    }

    try {
      // Generate a unique comment ID based on timestamp
      const commentId = new Date().toISOString();

      // Add a new discussion document to Firestore with the unique comment ID
      await setDoc(doc(db, "discussions", docId, "comments", commentId), {
        text: newComment,
        timestamp: serverTimestamp(),
        uid: user?.uid || "anon",
        displayName: user?.displayName || "Anonymous",
      });

      toast.success(`Added Comment '${newComment}'`);

      // Clear the input field
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Error adding comment:", error);
    }
  };

  return (
    <div>
      <h2>Discussions</h2>
      <ul className={styles.container}>
        {discussions.map((comment) => (
          <div>
            <li key={comment.id} className={styles.item}>
              <h3 className={styles.label}>{comment.displayName}:</h3>
              <p>{comment.text}</p>
            </li>
            <br />
          </div>
        ))}
      </ul>
      <div>
        <textarea
          rows={newComment.split("\n").length + 1} // Calculate rows based on line breaks
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className={styles.input}
        />
        <button onClick={handleAddComment} className={styles.submit}>
          Add Comment
        </button>
      </div>
    </div>
  );
}

export default Discussions;
