import React, { useState } from "react";
import styles from "../styles/Card.module.css";
import X from "../public/X.svg";
import Image from "next/image";

function Card({ name, message, timestamp }) {
  const [loading, setLoading] = useState();

  return (
    <div className={styles.container_card}>
      <h3>From: {name}</h3>
      <p className={styles.message}>{message}</p>
      <p className={styles.timestamp}>Timestamp: {timestamp.toString()}</p>
    </div>
  );
}

export default Card;

// {loading ? (
//   <>
//     <div className="ml-2 h-5 w-5 inline-block relative">
//       <div className="spinner border-t-[#6f4e37]"></div>
//       <div className="spinner delay_45 border-t-[#6f4e37]"></div>
//       <div className="spinner delay_30 border-t-[#6f4e37]"></div>
//       <div className="spinner delay_15 border-t-[#6f4e37] "></div>
//     </div>
//   </>
// ) : (
//   <Image
//     onClick={() => {
//       setLoading(true);
//       removeMemo?.();
//     }}
//     src={X}
//     alt="X"
//     height="12"
//     width="12"
//   />
// )}
