import "../styles/globals.css";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { zkSyncTestnet } from "wagmi/chains";

if (!process.env.WALLET_CONNECT_PROJECT_ID) {
  throw new Error("You need to provide WALLET_CONNECT_PROJECT_ID env variable");
}

const chains = [zkSyncTestnet];
const projectId = process.env.WALLET_CONNECT_PROJECT_ID;

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

function MyApp({ Component, pageProps }) {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <Component {...pageProps} />
      </WagmiConfig>

      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeVariables={{
          "--w3m-background-color": "#C58940",
          "--w3m-accent-color": "#C58940",
        }}
      />
    </>
  );
}

export default MyApp;
