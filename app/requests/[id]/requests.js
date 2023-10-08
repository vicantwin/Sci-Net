"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import FileViewer from "@/app/components/FileViewer";
import Discussions from "@/app/components/Discussions";
import styles from "@/app/styles/discussions.module.css";
import Image from "next/image";

export default function Requests({ params }) {
  const [data, setData] = useState([]);
  const docId = params.id;
  const docRef = doc(db, "requests", docId);

  // State for storing file URL and type
  const [fileUrl, setFileUrl] = useState(null);
  const [fileType, setFileType] = useState(null);

  useEffect(() => {
    // sourcery skip: avoid-function-declarations-in-blocks
    async function fetchData() {
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const request = docSnapshot.data();
        setData(request);
        const { fileUrl } = request;
        const fileType = getFileExtension(fileUrl);
        setFileUrl(fileUrl);
        setFileType(fileType);
        // console.log(fileUrl, "\n", "\n", fileType);
      } else {
        console.log("Document does not exist");
      }
    }

    fetchData();
  }, [docRef]);

  // Function to get file extension
  const getFileExtension = (url) => {
    const parts = url.split(".");
    return parts[parts.length - 1];
  };
  return (
    <div className={styles.content}>
      {data ? (
        <div>
          <h1 className={styles.label}>{data.title}</h1>
          <h3>{data.requester}</h3>
          <p>{data.description}</p>
          <br />

          {fileUrl && fileType ? (
            fileType.startsWith("pdf") || fileType.startsWith("docx") ? (
              <div>
                {" "}
                <h2>File Viewer</h2>
                <FileViewer url={fileUrl} />
              </div>
            ) : fileType.startsWith("jpg") ||
              fileType.startsWith("png") ||
              fileType.startsWith("gif") ? (
              <div>
                {" "}
                <h2>File Viewer</h2>{" "}
                <Image
                  src={fileUrl}
                  alt="File"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              </div>
            ) : (
              <div>Unsupported file type</div>
            )
          ) : (
            <div>No Files Uploaded</div>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <Discussions docId={docId} />
    </div>
  );
}
