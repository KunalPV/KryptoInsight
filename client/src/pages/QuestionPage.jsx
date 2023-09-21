/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect, useContractRead, useBalance, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsFillTrashFill } from 'react-icons/bs'
import { FaEthereum } from 'react-icons/fa'
import { BsWallet2 } from 'react-icons/bs'
import { IoExitOutline } from 'react-icons/io5'
import { MdArrowBackIosNew } from 'react-icons/md'
import tokenUtils from '../utils/tokenUtils'
import kryptonAbi from '../../abi/kryptonAbi.json'
import surveyAbi from '../../abi/surveyAbi.json'
import SuccessToast from '../components/SuccessToast';
import ErrorToast from '../components/ErrorToast';

const kryptonAddress = '0x317E70D9Fca08D1104E0C5CA5f470EA5BAac658a';
const surveyAddress = "0x9519aec5F016DcEfbfB8e78e3a031D51a31b13e2";
const ownerAddress= "0x43536656cc67B2513DE53bafb4b44BFBf3286B85";

const QuestionPage = ({ api }) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect({
    connector: new MetaMaskConnector
  });
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([{ questionText: '', questionType: '' }]);
  const formRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [calculatedReward, setCalculatedReward] = useState(0);
  const [isInvalidPercentage, setIsInvalidPercentage] = useState(false);
  const [totalSendToken, setTotalSendToken] = useState(0);
  const [randomHash] = useState(() => {
    const currentDate = new Date().toISOString();
    const inputString = `none${currentDate}`;
    const finalHash = CryptoJS.SHA256(inputString).toString();
    return finalHash;
  });

  const disconnectAndSetNull = () => {
    disconnect();
  }


  const userTokenBalance = useBalance({
    address: address,
    token: kryptonAddress,
  })

  const { config: approveConfig } = usePrepareContractWrite({
    address: kryptonAddress,
    abi: kryptonAbi,
    functionName: 'approve',
    args: [surveyAddress, (totalSendToken * 1e18)],
  });

  const { data: approveData, write: approveWrite, isLoading: isApproveLoading } = useContractWrite(approveConfig);

  const { isSuccess: isApproveSuccess } = useWaitForTransaction({
    hash: approveData?.hash
  });

  const allowanceRead = useContractRead({
    address: kryptonAddress,
    abi: kryptonAbi,
    functionName: 'allowance',
    args: [address, surveyAddress]
  });

  const { config: sendTokenConfig } = usePrepareContractWrite({
    address: surveyAddress,
    abi: surveyAbi,
    functionName: 'sendTokens',
    args: [address, ownerAddress, (totalSendToken * 1e18), randomHash]
  })

  const { data: sendTokenData, write: sendTokenWrite, isLoading: isSendTokensLoading } = useContractWrite(sendTokenConfig);

  const { isSuccess: isSendTokenSuccess, isIdle: isSendTokensIdle } = useWaitForTransaction({
    hash: sendTokenData?.hash
  })

  useEffect(() => {
    if(isApproveSuccess) {
      setSuccessMessage('Message Approved successfully!');
      sendTokenConfig
    } else if(isApproveSuccess) {
      setErrorMessage('Error setting approval');
    }
  }, [isApproveSuccess]);

  useEffect(() => {
    if(isSendTokenSuccess) {
      setSuccessMessage('Kryptons Sent successfully!');
      userTokenBalance
    } else if(isSendTokenSuccess && !isSendTokensIdle) {
      setErrorMessage('Error sending tokens');
    }
  }, [isSendTokenSuccess]);

  const handleAddQuestion = () => {
    setQuestions(prevQuestions => [...prevQuestions, { questionText: '', questionType: '' }]);
  }

  const handleQuestionChange = (index, name, value) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = prevQuestions.map((question, idx) => {
        if(idx == index) {
          return { ...question, [name]: value }
        }
        return question;
      })
      return updatedQuestions;
    });
  };

  const handleRemoveQuestion = (index) => {
    if(index === 0 && questions.length === 1) {
      return;
    }

    setQuestions(prevQuestions => {
      const updatedQuestions = prevQuestions.filter((_, idx) => idx !== index);
      return updatedQuestions;
    });
  };

  const handleTotalRewardChange = (event) => {
    setTotalSendToken(Number(event.target.value));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('accessToken');

    const surveyCreator = tokenUtils.getUserIdFromToken(token);

    const formData = {
      surveyName: formRef.current.surveyName.value,
      surveyTag: formRef.current.surveyTag.value,
      totalReward: totalSendToken,
      rewardPercentage: Number(formRef.current.rewardPercentage.value),
      questions: questions,
      surveyCreator: surveyCreator,
      hashedData: randomHash,
    };

    try {
      const response = await api.post('/survey', formData);

      // console.log(response.data);
      setQuestions([{ questionText: '', questionType: '' }]);
      formRef.current.reset();
      
      setSuccessMessage('Submitted Successfully. Survey Created!');

      setTimeout(() => {
        setSuccessMessage('');
        navigate('/');
      }, 1000);
    } catch (error) {
      setErrorMessage('Error creating survey!');
      console.error('Error creating survey: ', error);
    }
  }

  const handleRewardChange = () => {
    const totalReward = Number(formRef.current.totalReward.value);
    const rewardPercentage = Number(formRef.current.rewardPercentage.value);

    if (rewardPercentage > 50 || rewardPercentage <= 0) {
      setIsInvalidPercentage(true);
      setCalculatedReward(0);
    } else {
      setIsInvalidPercentage(false);
      const rewardPerPerson = (totalReward * rewardPercentage) / 100;
      setCalculatedReward(Math.floor(rewardPerPerson));
    }
  };

  const handleSendTokenButton = () => {
    if(isApproveSuccess) {
      console.log(isApproveSuccess)
      sendTokenWrite?.();
    }
  }

  return (
    <div className='w-full flex flex-col justify-center items-center m-4'>
      {successMessage && <SuccessToast message={successMessage} />}
      {errorMessage && <ErrorToast message={errorMessage} />}
      <div className='w-[75%] flex justify-between items-center py-1'>
        <Link to="/" className='p-2 hero-box rounded-lg cursor-pointer'>
          <MdArrowBackIosNew className='w-6 h-6' />
        </Link>
        <h1 className='text-3xl font-bold'>Create New Survey</h1>
        <div></div>
      </div>

      <div className='w-[75%] hero-box flex flex-col justify-center items-center my-4 rounded-2xl'>

        <div className='my-4 mx-10 w-full flex justify-around items-center'>
          {isConnected && address ? (
            <div className='flex justify-center items-center text-xl w-[50%]'>
              <span className='mr-2'>Balance: </span>
              <span className='font-bold'>{userTokenBalance?.isSuccess ? Number(userTokenBalance.data?.formatted).toFixed(2) : (
                <span className="loading loading-spinner loading-sm"></span>
              )}</span>
              <FaEthereum className='font-bold text-2xl' />
            </div>
          ) : (
            <span className='w-[50%] flex justify-center items-center text-xl'>Please connect the wallet.</span>
          )}
          <div className='w-[50%] flex justify-center items-center'>
            {isConnected ? (
              <button type="button" className='btn w-56 bg-black text-white m-2 hover:text-black focus:border-black' onClick={disconnectAndSetNull}>
                  {address ? `${address.slice(0, 5)}...${address.slice(38)}` : "Disconnect"}
                  <IoExitOutline className='text-2xl' />
              </button>
            ) : (
              <button className='btn bg-black text-white m-2 hover:text-black focus:border-black' onClick={() => { connect() }}>
                  <BsWallet2 className='text-2xl' />
                  Connect Wallet
              </button>
            )}
          </div>
        </div>
        
        <div className='border-b border-stone-500 w-[90%]' />

        <form className='w-full flex flex-col justify-center items-center my-4' ref={formRef}>

          <div className='w-full flex md:flex-row flex-col justify-center items-center gap-4 m-3'>
            <div className='w-full flex flex-col justify-center items-center gap-2'>
              <label htmlFor='surveyName' className='font-semibold text-xl'>Survey Name</label>
              <input required id='surveyName' type="text" placeholder="Ex: UoB Adv. Comp Sci Survey" className="input input-bordered w-full max-w-xs" />
            </div>
            <div className='w-full flex flex-col justify-center items-center gap-2'>
              <label htmlFor='surveyTag' className='font-semibold text-xl'>Survey Tag</label>
              <select required id='surveyTag' className="select select-bordered w-full max-w-xs" defaultValue={''}>
                <option disabled value=''>Question Tags</option>
                <option value='education'>Education</option>
                <option value='medical'>Medical</option>
                <option value='business'>Business</option>
              </select>
            </div>
          </div>

          <div className='w-full flex md:flex-row flex-col justify-center items-center gap-4 mb-4'>
            <div className='w-full flex flex-col justify-center items-center gap-2'>
              <label htmlFor='totalReward' className='font-semibold text-xl'>Total Reward</label>
              <input required id='totalReward' type="number" placeholder="Ex: 500 Tokens" className="input input-bordered w-full max-w-xs" min={1} onChange={handleTotalRewardChange} />
            </div>
            <div className='w-full flex flex-col justify-center items-center gap-2'>
              <label htmlFor='rewardPercentage' className='font-semibold text-xl'>Reward per person (%)</label>
              <input required id='rewardPercentage' type="number" placeholder="Ex: (5 - 95)%" className="input input-bordered w-full max-w-xs" min={1} max={50} onChange={handleRewardChange} />
            </div>
          </div>

          <div className='mb-2'>
            {isInvalidPercentage ? (
              <span className='text-red-700'>Please set a reasonable reward percentage to ensure equitable distribution of rewards among participants.</span>
            ) : (
              calculatedReward > 0 && (
                <span className='text-green-700'>Each person who fills the survey will get {calculatedReward} Points per reward.</span>
              )
            )}
          </div>

          <div className='border-b border-stone-500 w-[90%]' />

          {questions.map((question, index) => (
            <div className='mt-4 flex flex-col justify-center items-center w-[85%] gap-4' key={index}>
              <input
                required
                type="text"
                placeholder="Enter your question here"
                className="input input-bordered w-full"
                name={`questionText-${index}`}
                value={question.questionText}
                onChange={(event) => handleQuestionChange(index, 'questionText', event.target.value)}
              />
              <div className='flex justify-center items-center md:flex-row flex-col gap-24'>
                <select
                  required
                  className="select select-bordered w-64"
                  name={`questionType-${index}`}
                  value={question.questionType || ''}
                  onChange={(event) => handleQuestionChange(index, 'questionType', event.target.value)}
                >
                  <option disabled value=''>Question Type</option>
                  <option value='short-text'>Short Text</option>
                  <option value='long-text'>Long Text</option>
                  <option value='number'>Number</option>
                  <option value='yes-no'>Yes/No</option>
                </select>
                <button
                  type='button'
                  className="btn w-64 bg-red-300 text-red-700 flex justify-center items-center"
                  onClick={() => handleRemoveQuestion(index)}
                >
                  <BsFillTrashFill />
                  Remove
                </button>
              </div>
            </div>
          ))}

          {questions.length >= 1 && (
            <button
              type='button'
              className='btn mt-4 bg-black text-white hover:bg-white hover:text-black hover:border-black w-64'
              onClick={handleAddQuestion}
            >
              <AiOutlinePlus className='w-4 h-4' />
              Add More
            </button>
          )}

          <div className='flex flex-col justify-center items-center w-[85%] md:justify-end md:items-end mt-4 gap-2'>
            <div className='flex flex-col md:flex-row justify-center items-center gap-2'>
              <p className='flex justify-center items-center gap-2'>
                <span>BlockChain Allowance:</span>
                <span className='text-xl'>{allowanceRead.data ? parseFloat(BigInt(allowanceRead.data)) / 1e18 : 0}</span>
              </p>
              <div className="join w-64">
                <button type='button' className={`btn w-32 join-item bg-green-600 text-white hover:border-green-600 hover:text-green-600 hover:bg-white ${isConnected && address ? '' : 'btn-disabled'}`} onClick={() => approveWrite?.()}>
                  {isConnected && address ? (
                    isApproveLoading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                      )
                      : 'Approve'
                      )
                    : 'Connect Wallet'
                  }
                </button>
                <button type='button' className={`btn w-32 join-item bg-green-600 text-white hover:border-green-600 hover:text-green-600 hover:bg-white ${address ? '' : 'btn-disabled'}`} onClick={() => handleSendTokenButton?.()}>
                  {address ? (
                    isSendTokensLoading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                      ) : 'Pay'
                      ) : 'Pay'}
                </button>
              </div>
            </div>
            
            <button type='submit' className={`btn bg-green-600 text-white w-64 text-lg hover:border-green-600 hover:text-green-600 hover:bg-white`} onClick={handleSubmit}>
              Submit
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}

export default QuestionPage


{/* 

<div className='mt-4 flex md:flex-row flex-col justify-center items-center w-[85%] gap-4'>
  <input type="text" placeholder="Enter your question here" className="input input-bordered w-full max-w-xs" />
  <select className="select select-bordered w-full max-w-xs">
    <option disabled selected>Question Type</option>
    <option>Short Text</option>
    <option>Long Text</option>
    <option>Number</option>
    <option>Yes/No</option>
    <option>Rating</option>
  </select>
  <button className="btn w-64 bg-red-300 text-red-700 flex justify-center items-center">
    <img src={bin} alt="bin" className='w-4 h-4' />
    Remove
  </button>
</div>
<button className='btn mt-4 bg-black text-white hover:bg-white hover:text-black hover:border-black w-64'>Add More</button>

*/}