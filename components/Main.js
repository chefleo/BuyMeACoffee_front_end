import Image from "next/image";
import PresentationImage from "../public/presentation.jpg";
import React, { useEffect, useState } from "react";
import Loading from "./Loading.js";
import styles from "../styles/Main.module.css";
import { Web3Button } from "@web3modal/react";
import {
  useAccount,
  useWaitForTransaction,
  usePrepareContractWrite,
  useContractWrite,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { parseEther } from "viem";

import { Toaster, toast } from "sonner";

import { contractAddress, contractABI } from "../utils/contractInfo.js";

function Main({ refetchMemos }) {
  // Component state
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  // Component Wagmi state to avoid hydration warning/error
  const [connectionStat, setConnectionStat] = useState();
  const [addr, setAddr] = useState();

  const [loading, setLoading] = useState(false);

  // const [messagePopup, setMessagePopup] = useState('')
  // const [isVisible, setIsVisible] = useState(false)

  // Wagmi Account
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  useEffect(() => {
    if (chain?.id !== 280) {
      switchNetwork?.(280);
    }
  }, [chain, switchNetwork]);

  // Wagmi Write call
  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: "buyCoffee",
    args: [name, message],
    enabled: name !== "" && message !== "",
    value: parseEther("0.001"),
    onSuccess(data) {
      console.log("Success prepare buyCoffee", data);
    },
  });

  const { write: buyMeACoffee, data: dataBuyMeACoffee } = useContractWrite({
    ...config,
    onSuccess(data) {
      console.log("Success write buyCoffee", data);
      setLoading(true);
    },
    onError(err) {
      console.log("Error write buyCoffee", err.message);
      if (err.message.includes("User rejected the request")) {
        setLoading(false);
        toast.error("User rejected the request");
      } else {
        setLoading(false);
        setMessage("");
        setName("");
        toast.error("Something wrong");
      }
    },
  });

  useWaitForTransaction({
    hash: dataBuyMeACoffee?.hash,
    enabled: dataBuyMeACoffee,
    onSuccess(data) {
      refetchMemos();
      setName("");
      setMessage("");
      setLoading(false);
      console.log(data);
      toast.success(`Transaction successfull`, {
        action: {
          label: "Explorer",
          onClick: () =>
            window.open(
              `https://goerli.explorer.zksync.io/tx/${data.transactionHash.toString()}`,
              "_blank"
            ),
        },
      });
    },
  });

  // copy the value to state here
  useEffect(() => {
    setConnectionStat(isConnected);
  }, [isConnected]);

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <main className={styles.main_container}>
      <div className={styles.container}>
        <Toaster position="top-center" richColors />
        <div className={styles.image_container}>
          <Image
            priority={true}
            className={styles.image}
            src={PresentationImage}
            layout="fill"
            objectFit="contain"
            alt="Chefleo"
          />
        </div>

        <section className={styles.container_form}>
          {connectionStat && (
            <>
              <form className={styles.form}>
                <div>
                  <label>Name</label>
                  <br />

                  <input
                    id="name"
                    type="text"
                    placeholder="John"
                    onChange={onNameChange}
                    value={name}
                  />
                </div>
                <br />
                <div>
                  <label>Send Leonardo a message</label>
                  <br />

                  <textarea
                    rows={3}
                    placeholder="Enjoy your coffee!"
                    id="message"
                    onChange={onMessageChange}
                    value={message}
                    required
                  ></textarea>
                </div>
                <div className={styles.btn_container}>
                  <button
                    className={styles.btn}
                    disabled={loading === true ? "disabled" : ""}
                    type="button"
                    onClick={() => {
                      setLoading(true);
                      buyMeACoffee?.();
                    }}
                  >
                    {loading ? (
                      <Loading text={"Buying coffee.."} />
                    ) : (
                      "Send 1 Coffee for 0.001ETH"
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
          <Web3Button icon="hide" label="Connect Wallet" balance="hide" />
        </section>

        <div className={styles.svg_container}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="h-[180px] w-full fill-current text-[#E5BA73]"
          >
            <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z"></path>
          </svg>
        </div>
      </div>
    </main>
  );
}

export default Main;

// import { useContractWrite, useWaitForTransaction } from 'wagmi'

// function Main() {

//   // ... code ...

//   const { write: buyMeACoffee, data: dataBuyMeACoffee } = useContractWrite({
//     ...config,
//     onSuccess(data) {
//       console.log('Success write buyCoffee', data)
//     },
//   })

//   useWaitForTransaction({
//     hash: dataBuyMeACoffee?.hash,
//     enabled: dataBuyMeACoffee,
//     onSuccess(data) {
//       refetchMemos()
//     },
//   })

//   return (
//     // .. code ..
//   )
// }
