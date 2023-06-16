import Image from 'next/image'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import Loading from './Loading.js'
import { TransactionPopup, ErrorPopup } from './Popups.js'
import styles from '../styles/Main.module.css'

import { contractAddress, contractABI } from '../utils/contractInfo.js'

/**       
    https://goerli.etherscan.io/address/0x3eFb409C56306b82d2B59eef266B1067678f5CdA
*/

function Main({ currentAccount, setCurrentAccount }) {
  // Component state
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const [loading, setLoading] = useState(false)

  const [messagePopup, setMessagePopup] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const hidePopup = () => {
    if (!!isVisible) {
      setIsVisible(false)
    }
    if (!!error) {
      setError(false)
    }
  }

  const onNameChange = (event) => {
    setName(event.target.value)
  }

  const onMessageChange = (event) => {
    setMessage(event.target.value)
  }

  const checkNetwork = async (provider) => {
    const { chainId } = await provider.getNetwork()

    if (chainId !== 5) {
      console.log(`Please go to the Goerli Network`)

      setError(true)
      setErrorMessage('Please go to the Goerli Network')

      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x5' }], // chainId must be in HEX with 0x in front
      })
    }
  }

  // Wallet connection logic
  const isWalletConnected = async () => {
    setLoading(true)

    try {
      const { ethereum } = window

      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length > 0) {
        const account = accounts[0]
        console.log('wallet is connected! ' + account)

        const provider = new ethers.providers.Web3Provider(ethereum)

        await checkNetwork(provider)

        setCurrentAccount(account)
        setLoading(false)
      } else {
        console.log('Make sure MetaMask is connected')
        setLoading(false)
      }
    } catch (error) {
      console.log('error: ', error)
      setLoading(false)
    }
  }

  const connectWallet = async () => {
    setLoading(true)

    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('please install MetaMask')
        setError(true)
        setErrorMessage('Please install MetaMask')
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })

      setCurrentAccount(accounts[0])

      const provider = new ethers.providers.Web3Provider(ethereum)

      await checkNetwork(provider)

      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const buyCoffee = async () => {
    setLoading(true)

    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, 'any')

        await checkNetwork(provider)

        const signer = provider.getSigner()
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        console.log('buying coffee..')
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name ? name : 'John',
          message ? message : 'Enjoy your coffee!',
          { value: ethers.utils.parseEther('0.001') }
        )

        await coffeeTxn.wait()

        console.log('mined ', coffeeTxn.hash)

        console.log('coffee purchased!')

        // Clear the form fields.
        setName('')
        setMessage('')
        setIsVisible(true)
        setMessagePopup(coffeeTxn.hash.toString())
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
      setError(true)
      setErrorMessage(
        'User denied transaction signature or something gone wrong'
      )
    }
  }

  useEffect(() => {
    isWalletConnected()
  }, [])

  return (
    <div className={styles.main_container}>
      <div className={styles.popup}>
        <TransactionPopup
          className="fixed"
          message={messagePopup}
          hidePopup={hidePopup}
          isVisible={isVisible}
        />
        <ErrorPopup
          className="fixed"
          message={errorMessage}
          hidePopup={hidePopup}
          error={error}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.image_container}>
          <Image
            priority={true}
            className={styles.image}
            src="/presentation.jpg"
            layout="fill"
            objectFit="contain"
          />
        </div>

        <div className={styles.container_form}>
          {currentAccount ? (
            <div>
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
                    disabled={loading === true ? 'disabled' : ''}
                    type="button"
                    onClick={buyCoffee}
                  >
                    {loading ? (
                      <Loading text={'Buying coffee..'} />
                    ) : (
                      'Send 1 Coffee for 0.001ETH'
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button className={styles.btn} onClick={connectWallet}>
              {loading ? (
                // <Loading text={'Loading...'}/>
                <></>
              ) : (
                'Connect your wallet'
              )}
            </button>
          )}
        </div>

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
    </div>
  )
}

export default Main
