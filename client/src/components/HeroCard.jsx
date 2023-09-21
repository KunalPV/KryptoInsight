/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect, useContractWrite, usePrepareContractWrite, useWaitForTransaction, useBalance } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { AiOutlinePlus } from 'react-icons/ai'
import { BsWallet2 } from 'react-icons/bs'
import { FaEthereum, FaPlus } from 'react-icons/fa'
import { GoPaperAirplane } from 'react-icons/go'
import { IoExitOutline } from 'react-icons/io5'
import surveyAbi from '../../abi/surveyAbi.json';
import kryptonAbi from '../../abi/kryptonAbi.json'
import SuccessToast from './SuccessToast';
import ErrorToast from './ErrorToast';

const surveyAddress = "0x9519aec5F016DcEfbfB8e78e3a031D51a31b13e2";
const kryptonAddress = '0x317E70D9Fca08D1104E0C5CA5f470EA5BAac658a';
const ownerAddress= "0x43536656cc67B2513DE53bafb4b44BFBf3286B85";

const surveyContract = {
    address: surveyAddress,
    abi: surveyAbi,
};

const kryptonContract = {
    address: kryptonAddress,
    abi: kryptonAbi
}

const HeroCard = ({ api }) => {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const { connect } = useConnect({
        connector: new MetaMaskConnector
    })
    const [username, setUsername] = useState('');
    const [userBalance, setUserBalance] = useState(0);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const userTokenBalance = useBalance({
        address: address,
        token: kryptonAddress,
    })

    const { config: createRequestConfig } = usePrepareContractWrite({
        ...surveyContract,
        functionName: 'createRequest',
        args: [userBalance],
    });

    const { data: createRequestData, write: createRequestWrite } = useContractWrite(createRequestConfig);

    const { isSuccess: isCreateRequestDataSuccess, isIdle: isCreateRequestIdle } = useWaitForTransaction({
        hash: createRequestData?.hash
    })

    useEffect(() => {
        if(isCreateRequestDataSuccess & !isCreateRequestIdle) {
            setSuccessMessage('Request sent successfully!');

            const updateUserBalance = async () => {
                try {
                await api.put('/users/user/updateUser');
                } catch (error) {
                console.error('Error fetching user balance: ', error);
                }
            }

            updateUserBalance();
        } else if(isCreateRequestDataSuccess && !isCreateRequestIdle) {
            setErrorMessage(`Couldn't send the request`);
        }
    }, [isCreateRequestDataSuccess, isCreateRequestIdle, api]);

    useEffect(() => {
        // Fetch user's balance from the backend when the component mounts
        const fetchUserBalance = async () => {
            try {
            const response = await api.get('/users/userBalance');
            setUserBalance(response.data.userBalance);
            } catch (error) {
            console.error('Error fetching user balance: ', error);
            }
        };
    
        fetchUserBalance();
    }, [api]);

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const response = await api.get('/users/userName');
                setUsername(response.data.username);
            } catch (error) {
                console.error('Error fetching username: ', error);
            }
        };
    
        fetchUsername();
    }, [api]);

    const handleRedeemButton = () => {
        if(address === ownerAddress) {
            setErrorMessage('Requestor cannot be the admin.');
            return;
        } else {
            createRequestWrite?.();
        }
    }

    return (
        <div className="w-full flex flex-col justify-center items-center mt-4">
            {successMessage && <SuccessToast message={successMessage} />}
            {errorMessage && <ErrorToast message={errorMessage} />}

            <div className="flex justify-center items-center gap-2 md:flex-row flex-col">
                <Link to="/questionpage" className="w-[360px] h-[180px] border-2 rounded-xl flex justify-center items-center flex-col gap-1 bg-red-200 border-red-300 cursor-pointer">
                    <AiOutlinePlus className='w-10 h-10 text-red-700' />
                    <p className='text-red-600 font-semibold w-[144px]'>Create new survey</p>
                </Link>
                <div className="w-[360px] h-[180px] rounded-xl flex justify-start items-center flex-col hero-box">
                    {isConnected ? (
                        <button className='btn w-[96%] bg-black text-white m-2 hover:text-black focus:border-black' onClick={() => { disconnect() }}>
                            {address ? `${address.slice(0, 5)}...${address.slice(38)}` : "Disconnect"}
                            <IoExitOutline className='text-xl' />
                        </button>
                    ) : (
                        <button className='btn w-[96%] bg-black text-white m-2 hover:text-black focus:border-black' onClick={() => { connect() }}>
                            <BsWallet2 className='text-xl' />
                            Connect Wallet
                        </button>
                    )}
                    <div className='bg-stone-200 rounded-xl w-[96%] text-center h-[60%] flex flex-col justify-between items-center gap-2 p-2'>
                            {isConnected && (
                                <div className='flex justify-center items-center gap-2 w-full mt-2'>
                                    <div className='flex justify-center items-center text-xl'>
                                        <span className='mr-2'>Balance: </span>
                                        <span className='font-bold'>{userTokenBalance?.isSuccess ? Number(userTokenBalance.data?.formatted).toFixed(2) : (
                                            <span className="loading loading-spinner loading-sm"></span>
                                        )}</span>
                                        <FaEthereum />
                                    </div>

                                    <div className='border-l-2 border-stone-400 h-full' />

                                    <h1 className='font-semibold text-xl'>Points: {userBalance}</h1>
                                </div>
                            )}
                        {!isConnected ? (
                            <p className='text-lg text-stone-600 w-full h-full flex justify-center items-center'>Please connect your wallet <br /> to redeem points</p>
                        ) : (
                            <div className='w-full'>
                                <button className='btn bg-green-600 text-white w-[96%] hover:text-green-600 hover:border-green-600' onClick={()=>window.redeem_btn.showModal()} >
                                    Redeem
                                    <GoPaperAirplane className='text-lg' />
                                </button>
                                <dialog id="redeem_btn" className="modal modal-bottom sm:modal-middle">
                                    <form method="dialog" className="modal-box">
                                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                        <div className='flex flex-col justify-center items-center gap-2'>
                                            <div>
                                                <p className='flex justify-center items-center text-2xl'>Redeem Your Points for Kryptons <FaEthereum className='font-extrabold text-xl' /></p>
                                            </div>

                                            <div className='w-full border-b-2 border-stone-400' />

                                            <div className='w-full p-2 flex flex-col justify-center items-center gap-3'>
                                                <h1 className='font-semibold'>Account: {address ? `${address.slice(0, 6)}...${address.slice(37)}` : 'Connect Wallet'}</h1>
                                                <p className='flex justify-center items-center gap-1'>
                                                    <span>Click to redeem your</span>
                                                    <span className='font-extrabold text-xl flex justify-center items-center'>
                                                        {userBalance}
                                                        <FaEthereum />
                                                    </span>
                                                    <span>tokens.</span>
                                                </p>
                                                <button className='btn bg-green-600 text-white w-[96%] hover:text-green-600 hover:border-green-600' onClick={() => handleRedeemButton?.()}>
                                                    Redeem
                                                </button>
                                            </div>
                                        </div>
                                    
                                    </form>
                                </dialog>
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroCard