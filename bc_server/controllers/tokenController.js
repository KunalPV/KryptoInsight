const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const chain = EvmChain.MUMBAI;
const kryptonAbi = require("../abi/kryptonAbi.json");
const tokenAddress = "0x317E70D9Fca08D1104E0C5CA5f470EA5BAac658a";

const getTokenBalanceByAddress = async (req, res) => {
  try {
    const { userAddress } = req.query;

    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
      chain,
      "tokenAddresses": [
        tokenAddress
      ],
      "address": userAddress
    });

    return res.status(200).json({ tokens: response.raw });
  }
  catch (error) {
    console.error("Error fetching tokens: ", error);
    return res.status(500).json({ error: "Failed to fetch the tokens" });
  }
}

const tokenController = {
  getTokenBalanceByAddress
}

module.exports = tokenController;