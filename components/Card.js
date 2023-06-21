import React from 'react'
import styles from '../styles/Card.module.css'

function Card({ name, message, timestamp }) {
  return (
    <div className={styles.container_card}>
      <h3>From: {name}</h3>
      <p className={styles.message}>{message}</p>
      <p className={styles.timestamp}>Timestamp: {timestamp.toString()}</p>
    </div>
  )
}

export default Card
