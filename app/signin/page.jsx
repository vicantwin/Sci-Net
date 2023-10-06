"use client";
import { useEffect, useState } from "react";
import { UserAuth } from "../firebase/context/AuthContext";
import styles from "../styles/signin.module.css";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const { user, googleSignIn, logOut } = UserAuth();

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
      {loading ? null : !user ? (
        <ul>
          <h3 className={styles.label}>Sign in with:</h3>
          <div className={styles.customBtn} onClick={handleSignIn}>
            <span className={styles.icon}></span>
            <span className={styles.buttonText}>Google</span>
          </div>
          <br />
        </ul>
      ) : (
        <div>
          <p>
            Welcome, <b>{user.displayName}</b>
          </p>
          <button onClick={handleSignOut}>Sign out</button>
        </div>
      )}
    </div>
  );
}
