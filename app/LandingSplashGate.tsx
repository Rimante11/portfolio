"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

interface LandingSplashGateProps {
  children: React.ReactNode;
}

const LandingSplashGate = ({ children }: LandingSplashGateProps) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSplash(false);
      if (window.location.hash !== "#home") {
        window.history.replaceState(null, "", "#home");
      }
    }, 2000);

    return () => window.clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className={styles.splashScreen} role="status" aria-live="polite" aria-label="Loading home page">
        <div className={styles.splashFingerprintWrap}>
          <Image
            className={styles.splashFingerprintIcon}
            src="/fingerprint.png"
            alt="Fingerprint"
            width={84}
            height={84}
            priority
          />
        </div>
        <p className={styles.splashLoadingText}>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default LandingSplashGate;
