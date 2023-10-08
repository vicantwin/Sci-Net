"use client";
import Link from "next/link";
import { UserAuth } from "../firebase/context/AuthContext";
import styles from "../styles/navbar.module.css";

function Navbar() {
  const { user } = UserAuth();
  return (
    <div>
      <div role="navigation">
        <ul className={styles.ul}>
          <li className={styles.li}>
            <Link className={styles.a} href="/">
              Home
            </Link>
          </li>
          <li className={styles.li}>
            <a
              target="_blank"
              className={styles.a}
              href="https://github.com/TsugikuniVi/Sci-Net"
            >
              GitHub
            </a>
          </li>
          {user ? (
            <>
              <li className={styles.li}>
                <Link className={styles.a} href="/profile">
                  Profile
                </Link>
              </li>
              <li className={styles.li}>
                <Link className={styles.a} href={"/signin"}>
                  Account Page
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className={styles.li}>
                <Link className={styles.a} href="/signin">
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
