import '../styles/globals.css'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'

if (!process.env.WALLET_CONNECT_PROJECT_ID) {
  throw new Error('You need to provide WALLET_CONNECT_PROJECT_ID env variable')
}

const chains = [sepolia]
const projectId = process.env.WALLET_CONNECT_PROJECT_ID

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

function MyApp({ Component, pageProps }) {
  return (
  <>
    <WagmiConfig config={wagmiConfig}>
      <Component {...pageProps} />
    </WagmiConfig>

    <Web3Modal projectId={projectId} ethereumClient={ethereumClient} 
      themeVariables={{
        '--w3m-background-color': '#C58940',
        '--w3m-accent-color': '#C58940',
      }} 
      explorerRecommendedWalletIds={[
        'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
        'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
        '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369'
      ]} />
  </>
)
}

export default MyApp
