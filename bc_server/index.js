const express = require("express");
const dotenv = require('dotenv');
const Moralis = require("moralis").default;
const Web3 = require('web3');
const cors = require('cors');
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const kryptonAbi = require('./abi/kryptonAbi.json');
const surveyAbi = require('./abi/surveyAbi.json')
const tokenRoutes = require('./routes/tokenRoutes');
const surveyRoutes = require('./routes/surveyRoutes');

const app = express();
app.use(cors());
dotenv.config();
const port = 8080;

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const kryptonAddress = process.env.KRYPTON_ADDRESS;
const surveyAddress = process.env.SURVEY_ADDRESS;
const ownerAddress = process.env.OWNER_ADDRESS;
const chain = EvmChain.MUMBAI;

// app.use('/tokenContract', tokenRoutes);
// app.use('/surveyContract', surveyRoutes);

app.get('/smartContract/createRequest', async (req, res) => {
  try {
    const { _spender, _value } = req.query;

    const tokenApproval = await Moralis.EvmApi.utils.runContractFunction({
      chain,
      address: kryptonAddress,
      abi: kryptonAbi,
      functionName: "approve",
      params: { _spender, _value }
    });
    return res.status(200).json({ approval: tokenApproval.raw });
  } catch (error) {
    console.log("Error while createRequest", error);
    return res.status(500).json({ error: "Failed to send tokens to the owner." })
  }
})

// app.get("/getData", async (req, res) => {
//   try {
//     const { userAddress } = req.query;

//     const metadataResponse = await Moralis.EvmApi.token.getTokenMetadata({
//       addresses: [kryptonAddress],
//       chain,
//     })

//     const walletBalance = await Moralis.EvmApi.token.getWalletTokenBalances({
//       chain,
//       tokenAddresses: [kryptonAddress],
//       address: userAddress,
//     })

//     const tokenDetails = {
//       tokenName: metadataResponse.raw[0].name,
//       tokenSymbol: metadataResponse.raw[0].symbol,
//       decimals: metadataResponse.raw[0].decimals,
//       balance: walletBalance.raw[0]?.balance / (10**walletBalance.raw[0]?.decimals)
//     }

//     const ercMints = await Moralis.EvmApi.token.getErc20Mints({
//       chain,
//       "contractAddresses": [kryptonAddress],
//       "walletAddresses": [userAddress]
//     });

//     const ercMintsDetails = ercMints.result[0]._data.valueDecimal;

//     const myName = await Moralis.EvmApi.utils.runContractFunction({
//       chain,
//       address: surveyAddress,
//       abi: surveyAbi,
//       functionName: "getMyName",
//       params: { _user: userAddress }
//     })
//     const myNameDetails = myName.raw;

//     const ownerInfo = await Moralis.EvmApi.utils.runContractFunction({
//       chain,
//       address: surveyAddress,
//       abi: surveyAbi,
//       functionName: "owner",
//       params: {}
//     })
//     const ownerInfoDetails = ownerInfo.raw;

//     return res.status(200).json({ tokenDetails, myNameDetails, ownerInfoDetails });
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// })

Moralis.start({
  apiKey: MORALIS_API_KEY
}).then(() => {
  app.listen(port, () => {
    console.log(`KryptoInsight Blockchain listening on port ${port}`);
  });
})