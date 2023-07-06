import '../styles/globals.css'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'

import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { publicProvider } from 'wagmi/providers/public'
import { infuraProvider } from "wagmi/providers/infura";
import { baseGoerli } from 'wagmi/chains'

if (!process.env.INFURA_ID) {
  throw new Error('You need to provide WALLET_CONNECT_PROJECT_ID env variable')
}

const chains = [baseGoerli]
const projectId = process.env.INFURA_ID

const { publicClient } = configureChains(chains, [infuraProvider({ projectId }), publicProvider()])
const wagmiConfig = createConfig({
  connectors: [new CoinbaseWalletConnector({
    chains,
    options: {
      appName: "BuyMeACoffee",
    },
  })],
  publicClient
})

function MyApp({ Component, pageProps }) {
  return (
  <>
    <WagmiConfig config={wagmiConfig}>
      <Component {...pageProps} />
    </WagmiConfig>
  </>
)
}

export default MyApp
