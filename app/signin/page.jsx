"use client";
import { useEffect, useState } from "react";
import { UserAuth } from "../firebase/context/AuthContext";
import styles from "../styles/signin.module.css";
import { db } from "../firebase/config";
import { deleteDoc, collection, getDocs, doc } from "firebase/firestore";
import { toast } from "sonner";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { user, googleSignIn, logOut } = UserAuth();

  async function deleteReq(id) {
    const reqDoc = doc(db, "requests", id);
    await deleteDoc(reqDoc);
    window.location.reload();
  }

  async function fetchData() {
    try {
      const response = await getDocs(collection(db, "requests"));
      setData(response.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function deleteAll() {
    await fetchData();
    data.length > 0
      ? await Promise.all(
          data.map(async (request) => {
            await deleteReq(request.id);
          }),
          toast.success("All Docs Deleted!")
        )
      : toast.error("Failed to delete all docs");
  }

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  return (
    <div className="body">
      {loading ? null : user ? (
        <div>
          <p>
            Welcome, <b>{user.displayName}</b>
          </p>
          <button onClick={handleSignOut}>Sign out</button>
          {user.displayName === process.env.NEXT_PUBLIC_ADMIN_NAME ? (
            <div>
              <br />
              <button onClick={deleteAll}>Delete All Docs</button>
            </div>
          ) : null}
        </div>
      ) : (
        <ul>
          <h3 className={styles.label}>Sign in with:</h3>
          <div className={styles.customBtn} onClick={handleSignIn}>
            <span className={styles.icon}></span>
          </div>
          <br />
        </ul>
      )}
    </div>
  );
}
