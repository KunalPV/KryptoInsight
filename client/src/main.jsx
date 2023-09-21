import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'

import './index.css'

const alchemyApiKey = "jd8268MxZ0_Vt5qYJOjFeunQqc33Nmxx";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygon, polygonMumbai],
  [alchemyProvider({ apiKey: alchemyApiKey })],
)

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <Router>
        <App />
      </Router>
    </WagmiConfig>
  </React.StrictMode>,
)
