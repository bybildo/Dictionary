import { useState, useEffect } from "react";
import styles from './style.module.css';
import { useGoogleAuth } from "@hooks/useGoogleAuth";
import ShowMessage from "@components/showMessage";
import { useTimeoutShowMessage } from "@hooks/useTimeoutShowMessage";

function Authorization({ isServerDown, setAuthorized }) {
  const [activeSection, setActiveSection] = useState(isServerDown ? "local" : "google");
  const { showMessage, setShowMessage } = useTimeoutShowMessage(2000);
  const login = useGoogleAuth(setAuthorized);

  const handleLocalClick = () => {
    localStorage.setItem("isLocal", "true");
    setAuthorized(true);
  };

  return (
    <div style={{background: '#0A1128', height: '100vh'}}>
      <div className={styles["sign-in"]}>
        <ShowMessage style={showMessage ? { opacity: '1' } : { opacity: '0' }} message={'Sorry, the server is currently unavailable.'} />
        <div className={styles.window}>
          <div className={activeSection === "local" ? styles["color-section-left"] : styles["color-section-right"]}></div>

          <div
            className={styles["google-section"]}
            style={{ width: activeSection === "google" ? "72%" : "28%" }}
            onMouseEnter={() => !isServerDown && setActiveSection("google")}
            onClick={() => isServerDown && setShowMessage(true)}
          >
            <ul>
              <li><h1>Google</h1></li>
              <li className={`${styles["google-text"]} ${activeSection === "google" ? styles["text-visible"] : styles["text-hidden"]}`}>
                <p>Saving data to the server<span>All functions work</span></p>
              </li>
              <li className={`${styles["google-text"]} ${activeSection === "google" ? styles["text-visible"] : styles["text-hidden"]}`}>
                <p className={styles.button} onClick={() => login()}>Sign in</p>
              </li>
            </ul>
          </div>

          <div
            className={styles["local-section"]}
            style={{ width: activeSection === "local" ? "72%" : "28%" }}
            onMouseEnter={() => setActiveSection("local")}
          >
            <ul>
              <li><h1>Local</h1></li>
              <li className={`${styles["local-text"]} ${activeSection === "local" ? styles["text-visible"] : styles["text-hidden"]}`}>
                <p>Saving data to the device<span>Not all functions work</span></p>
              </li>
              <li className={`${styles["local-text"]} ${activeSection === "local" ? styles["text-visible"] : styles["text-hidden"]}`}>
                <p className={styles.button} onClick={handleLocalClick}>Do not enter</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Authorization;
