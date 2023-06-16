import { ethers } from "ethers";
import Head from 'next/head'
import React, { useEffect, useState } from "react";
import styles from "../styles/index.module.css";
import Main from '../components/Main'
import Card from '../components/Card'
import Footer from '../components/Footer'
import { contractAddress, contractABI } from '../utils/contractInfo.js'


export default function Home() {
  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  const [contractLoaded, setContractLoaded] = useState(false);
  const [memos, setMemos] = useState([]);

  // console.log('contractAddress:',contractAddress);
  // console.log('contractABI:',contractABI);

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length > 0) {
        const account = accounts[0];
        setCurrentAccount(account);
      } else {
        console.log("Make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }
  
  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window;
      
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const { chainId } = await provider.getNetwork();

        if (chainId !== 5) {
          console.log(`Please go to the Goerli Network`);
          alert('Please go to the Goerli Network');
          
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x5' }],
          });
          window.location.reload();
        }

        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          provider
        );

        const memos = await buyMeACoffee.getMemos();

        setContractLoaded(true);

        setMemos(memos);
      } else {
        console.log("Metamask is not connected");
      }
    } catch (error) {
      console.log(error);
    }
  };



  useEffect(() => {
    getMemos()
  }, [currentAccount])

  useEffect(() => {
    let buyMeACoffee;
    isWalletConnected();

    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewMemo = (from, timestamp, name, message) => {
      timestamp = new Date().getTime();
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp / 1000),
          message,
          name
        }
      ]);
    };

    const { ethereum } = window;

    // Listen for new memo events.
    // if (ethereum) {
    //   const provider = new ethers.providers.Web3Provider(ethereum, "any");
    //   const signer = provider.getSigner();
    //   buyMeACoffee = new ethers.Contract(
    //     contractAddress,
    //     contractABI,
    //     signer
    //   );

    //   buyMeACoffee.on("NewMemo", onNewMemo);
    // }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("NewMemo", onNewMemo);
      }
    }
  }, []);

  return (

    <div className={styles.main}>
      <Head>
        <title className={styles.title}>Buy Leonardo a Coffee!</title>
        <meta name="description" content="Tipping site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main currentAccount={currentAccount} setCurrentAccount={setCurrentAccount}/>

      <div className={styles.grid}>
        {contractLoaded && (memos.map((memo, idx) => {
          const timestamp = new Date(memo.timestamp * 1000);
          return (
            <Card key={idx} id={idx} name={memo.name} message={memo.message} timestamp={timestamp} />
          )
        }))}
      </div>

      <Footer />

    </div>
  )

}
