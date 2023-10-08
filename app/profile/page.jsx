"use client";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../firebase/context/AuthContext";
import Spinner from "../components/Spinner";

function Page() {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : user ? (
        <div>
          <img src={user.photoURL} alt={user.displayName} />
          <h1>
            Welcome, {user.displayName} - you are logged in to the profile page
            - a protected route.
          </h1>
          <h2>{user.email}</h2>
        </div>
      ) : (
        <p>You are NOT LOGGED IN!</p>
      )}
    </div>
  );
}

export default Page;
