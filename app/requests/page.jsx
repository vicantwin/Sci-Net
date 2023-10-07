"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc } from "firebase/firestore";
import styles from "../styles/requests.module.css";
import { UserAuth } from "../firebase/context/AuthContext";

function Requests() {
  const { user } = UserAuth();
  console.log(user);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requester: "",
    language: "",
    tags: [],
  });
  const [isFormVisible, setFormVisible] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getDocs(collection(db, "requests"));
        setData(response.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleTagInputChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      tags: value.split(",").map((tag) => tag.trim()), // Split tags by comma and trim spaces
    });
  };

  const handleSubmit = async () => {
    const { title, description, requester, language, tags } = formData;
    console.log(title, description, requester, language, tags);

    try {
      const docRef = await addDoc(collection(db, "requests"), {
        title,
        description,
        requester,
        language,
        tags,
      });

      toast.success(`Request Sent, with ID: ${docRef.id} !`);
      setFormData({
        title: "",
        description: "",
        requester: user?.displayName,
        language: "",
        tags: [],
      });
      setFormVisible(false);
    } catch (error) {
      toast.error("Error adding data. Check console.");
      console.error("Error adding data:", error);
    }
  };

  const toggleFormVisibility = () => {
    setFormVisible(!isFormVisible);
  };

  return (
    <div className={styles.abc}>
      <h1>
        <b>
          <i>Requests</i>
        </b>
      </h1>
      <br />
      <button className="button" onClick={toggleFormVisibility}>
        {isFormVisible ? "Hide Form" : "Create Request"}
      </button>
      {isFormVisible && (
        <div className={styles.form}>
          <input
            autoComplete="off"
            className={styles.input}
            style={{ borderRadius: "20px 20px 0 0" }}
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
          />
          <input
            autoComplete="off"
            className={styles.input}
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
          />
          {!user ? (
            <input
              autoComplete="off"
              className={styles.input}
              type="text"
              name="requester"
              placeholder="Name"
              value={formData.requester}
              onChange={handleInputChange}
            />
          ) : null}
          <input
            autoComplete="off"
            className={styles.input}
            type="text"
            name="language"
            placeholder="Language"
            value={formData.language}
            onChange={handleInputChange}
          />
          <input
            autoComplete="off"
            className={styles.input}
            style={{
              borderRadius: "0 0 20px 20px",
              borderBottomColor: "rgb(245, 245, 245)",
            }}
            type="text"
            placeholder="Tags (comma-separated)"
            value={formData.tags}
            onChange={handleTagInputChange}
          />
          <button className={styles.submit} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}
      <ul className={styles.list}>
        {data.length > 0 ? (
          data.map((request, index) => (
            <div>
              <li key={request.id} className={styles.item}>
                <div className={styles.content}>
                  <p>
                    <span className={styles.label}>Title:</span> {request.title}{" "}
                    <br />
                    <span className={styles.label}>Description:</span>{" "}
                    {request.description} <br />
                    <span className={styles.label}>Requester:</span>{" "}
                    {request.requester} <br />
                    <span className={styles.label}>Language:</span>{" "}
                    {request.language} <br />
                    <span className={styles.label}>Tags:</span>{" "}
                    {request.tags.join(", ")}
                  </p>
                </div>
              </li>
              <br />
            </div>
          ))
        ) : (
          <li className={styles.noData}>No data Available</li>
        )}
      </ul>
    </div>
  );
}

export default Requests;
