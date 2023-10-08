import styles from "../styles/discussions.module.css";

export default function FileViewer({ url }) {
  return <iframe src={url} className={styles.iframe} />;
}
