const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const chain = EvmChain.MUMBAI;
const surveyAbi = require("../abi/surveyAbi.json");
const surveyAddress = "0x9519aec5F016DcEfbfB8e78e3a031D51a31b13e2";

const getOwner = async (req, res) => {
  try {
    const ownerInfo = await Moralis.EvmApi.utils.runContractFunction({
      chain,
      address: surveyAddress,
      abi: surveyAbi,
      functionName: "owner",
      params: {}
    });

    return res.status(200).json({ owner: ownerInfo.raw });
  } catch (error) {
    console.error("Error fetching owner: ", error);
    return res.status(500).json({ error: "Failed to fetch the owner" });
  }
}

const getToken = async (req, res) => {
  try {
    const tokenInfo = await Moralis.EvmApi.utils.runContractFunction({
      chain,
      address: surveyAddress,
      abi: surveyAbi,
      functionName: "kryptonToken",
      params: {}
    });

    return res.status(200).json({ token: tokenInfo.raw });
  } catch (error) {
    console.error("Error fetching the krypton token: ", error);
    return res.status(500).json({ error: "Failed to the krypton token" });
  }
}

const getMyNameByAddress = async (req, res) => {
  try {
    const { userAddress } = req.query;

    const userName = await Moralis.EvmApi.utils.runContractFunction({
      chain,
      address: surveyAddress,
      abi: surveyAbi,
      functionName: "getMyName",
      params: { _user: userAddress }
    });

    return res.status(200).json({ name: userName.raw })
  } catch (error) {
    console.error("Error fetching the name by address: ", error);
    return res.status(500).json({ error: "Failed to the name by address" });
  }
}

const getMyRequests = async (req, res) => {
  try {
    const { userAddress } = req.query;

    const response = await Moralis.EvmApi.utils.runContractFunction({
      chain,
      address: surveyAddress,
      abi: surveyAbi,
      functionName: "getMyRequests",
      params: { _user: userAddress }
    });

    return res.status(200).json({ myRequests: response.raw })
  } catch (error) {
    console.error("Error fetching the requests by address: ", error);
    return res.status(500).json({ error: "Failed to the requests by address" });
  }
}

const getMyHistory = async (req, res) => {
  try {
    const { userAddress } = req.query;

    const response = await Moralis.EvmApi.utils.runContractFunction({
      chain,
      address: surveyAddress,
      abi: surveyAbi,
      functionName: "getMyHistory",
      params: { _user: userAddress }
    });

    return res.status(200).json({ myHistory: response.raw })
  } catch (error) {
    console.error("Error fetching the history by address: ", error);
    return res.status(500).json({ error: "Failed to the history by address" });
  }
}

const getSurveyHistory = async (req, res) => {
  try {
    const { userAddress } = req.query;

    const response = await Moralis.EvmApi.utils.runContractFunction({
      chain,
      address: surveyAddress,
      abi: surveyAbi,
      functionName: "getSurveyHistory",
      params: { _user: userAddress }
    });

    return res.status(200).json({ surveyHistory: response.raw })
  } catch (error) {
    console.error("Error fetching the survey history by address: ", error);
    return res.status(500).json({ error: "Failed to the survey history by address" });
  }
}

const surveyController = {
  getOwner,
  getToken,
  getMyNameByAddress,
  getMyRequests,
  getMyHistory,
  getSurveyHistory
}

module.exports = surveyController;