import Head from 'next/head'
import React, { useEffect, useState } from "react";
import styles from "../styles/index.module.css";
import Main from '../components/Main'
import Card from '../components/Card'
import Footer from '../components/Footer'
import { contractAddress, contractABI } from '../utils/contractInfo.js'
import { useContractRead } from 'wagmi'


export default function Home() {

  const { data: memos, refetch: refetchMemos, isFetched } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getMemos',
    onSuccess(data) {
      console.log('Success getMemos', data)
    },
    onError(error) {
      console.log('Error getMemos', error)
    },
  })

  return (

    <div className={styles.main}>
      <Head>
        <title className={styles.title}>Buy Leonardo a Coffee!</title>
        <meta name="description" content="Tipping site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main refetchMemos={refetchMemos}/>

      <div className={styles.grid}>
        {isFetched && (memos.map((memo, idx) => {
          const timestamp = new Date(memo.timestamp.toString() * 1000);
          return (
            <Card key={idx} id={idx} name={memo.name} message={memo.message} timestamp={timestamp} />
          )
        }))}
      </div>

      <Footer />

    </div>
  )

}
