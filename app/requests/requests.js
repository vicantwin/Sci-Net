"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { db, storage } from "../firebase/config";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import styles from "../styles/requests.module.css";
import { v4 as uuidv4 } from "uuid";
import { UserAuth } from "../firebase/context/AuthContext";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/navigation";

export default function Requests() {
  const navigate = useRouter();
  const { user } = UserAuth();
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requester: user?.displayName || "",
    language: "",
    tags: [],
  });
  const [isFormVisible, setFormVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [docId, setDocId] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Function to handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const uploadFile = async () => {
    if (selectedFile) {
      try {
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}_${selectedFile.name}`;

        const storageRef = ref(storage, `requests/${docId}/${fileName}`);

        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            toast.loading(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error("Error uploading file:", error);
            toast.error("Error uploading file. Check console.");
          },
          () => {
            toast.success("File uploaded successfully");
            getDownloadURL(storageRef).then((url) => {
              console.log("File URL:", url);

              setFileUrl(url);
            });
          }
        );
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Error uploading file. Check console.");
      }
    }
  };

  useEffect(() => {
    const filteredResults = data.filter((request) => {
      // Customize this filtering logic based on your requirements.
      // For example, you can search by title, description, requester, etc.
      const searchFields = [
        request.title,
        request.description,
        request.requester,
        request.language,
        request.tags.join(", "),
      ];

      return searchFields.some((field) =>
        field.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    setFilteredData(filteredResults);
  }, [searchQuery, data]);

  useEffect(() => {
    // sourcery skip: avoid-function-declarations-in-blocks
    async function fetchData() {
      try {
        const response = await getDocs(collection(db, "requests"));
        setData(response.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
    setDocId(uuidv4());
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

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
      await setDoc(doc(db, "requests", docId), {
        title,
        description,
        requester,
        language,
        tags,
        fileUrl,
      });

      toast.success(`Request Sent, with ID: '${docId}'!`, {
        onAutoClose: (t) => {
          window.location.reload(false);
        },
      });
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
      {data ? (
        <div>
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
              {user ? null : (
                <input
                  autoComplete="off"
                  className={styles.input}
                  type="text"
                  name="requester"
                  placeholder="Name"
                  value={formData.requester}
                  onChange={handleInputChange}
                />
              )}
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
              <input
                type="file"
                accept=".pdf, .docx, .jpg, .png, .gif" // Specify accepted file types
                onChange={handleFileSelect}
              />
              <button className={styles.submit} onClick={uploadFile}>
                Upload File
              </button>
              <br />
              <button className={styles.submit} onClick={handleSubmit}>
                Submit
              </button>
            </div>
          )}
          <br />
          <input
            autoComplete="off"
            className={styles.search}
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <ul className={styles.list}>
            {filteredData.length > 0 ? (
              filteredData.map((request) => (
                <div>
                  <li
                    key={request.id}
                    className={styles.item}
                    onClick={() => navigate.push(`/requests/${request.id}`)}
                  >
                    <div className={styles.content}>
                      <p>
                        <span className={styles.label}>Title:</span>{" "}
                        {request.title} <br />
                        <span className={styles.label}>Description:</span>{" "}
                        {request.description} <br />
                        <span className={styles.label}>Requester:</span>{" "}
                        {request.requester} <br />
                        {/* <span className={styles.label}>File URL:</span>{" "}
                    {request.fileUrl} <br /> */}
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
              <li className={styles.noData}>No Requests Found</li>
            )}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export async function generateMetadata() {
  return {
    title: "Requests - Open Sci-net",
    description: "The Requests Page",
  };
}
