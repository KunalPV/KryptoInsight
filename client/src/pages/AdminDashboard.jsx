import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect, useContractRead, useBalance, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { BsWallet2 } from 'react-icons/bs'
import { IoExitOutline } from 'react-icons/io5'
import { FaEthereum } from 'react-icons/fa'
import surveyAbi from '../../abi/surveyAbi.json'

const surveyAddress = "0x9519aec5F016DcEfbfB8e78e3a031D51a31b13e2";
const ownerAddress = "0x43536656cc67B2513DE53bafb4b44BFBf3286B85";

const AdminDashboard = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect({
      connector: new MetaMaskConnector
  });

  const [senderAddressData, setSenderAddressData] = useState([]);
  const [receiverAddressData, setReceiverAddressData] = useState([]);
  const [amountData, setAmountData] = useState([]);

  const readGetMyRequests = useContractRead({
    address: surveyAddress,
    abi: surveyAbi,
    functionName: 'getSurveyHistory',
    args: [address]
  });

  // const {  } = useWaitForTransaction()

  useEffect(() => {
    if(readGetMyRequests.isSuccess) {
      const data = readGetMyRequests.data || [];
      setSenderAddressData(data.map(item => item.sender));
      setReceiverAddressData(data.map(item => item.receiver));
      setAmountData(data.map(item => item.amount));
    }
  }, [readGetMyRequests.isSuccess]);

  // console.log(senderAddressData);
  // console.log(receiverAddressData);
  // console.log(amountData);

  const AdminDashboardTable = () => {
    return (
      <div className="overflow-x-auto w-[80%] hero-box rounded-lg h-[60vh]">
        <table className="table text-center">
          {/* head */}
          <thead>
            <tr className='text-lg '>
              <th className='font-normal'>No.</th>
              <th className='font-normal'>Sender</th>
              <th className='font-normal'>Receiver</th>
              <th className='font-normal'>Amount</th>
            </tr>
          </thead>
          <tbody className='w-full'>
            {readGetMyRequests.isSuccess ? (
              senderAddressData.length > 0 ? (
                senderAddressData.map((sender, index) => (
                  <tr key={index}>
                    <td className='font-normal'>{index + 1}</td>
                    <td className='font-normal'>{sender}</td>
                    <td className='font-normal'>{receiverAddressData[index]}</td>
                    <td className='font-normal'>{Number(amountData[index].toString()) / (1e18)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className='font-normal text-center'>
                    No requests to display.
                  </td>
                </tr>
              )
            ) : (
              <span className="loading loading-spinner loading-lg"></span>
            )}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="w-full h-[100vh] flex flex-col justify-start items-center">
      <div className="w-full p-4 flex justify-between items-center">
        <div className='w-[25%]'>
          <Link to='/admin'>
            <button className="btn bg-white border-black hover:bg-black hover:text-white">
              <AiOutlineArrowLeft />
              Go Back
            </button>
          </Link>
        </div>

        <div className='w-[50%] text-center'>
          <h1 className='text-3xl font-bold'>Admin Dashboard</h1>
        </div>
        <div className='w-[25%] flex justify-end items-center'>
          {isConnected ? (
              <button className='btn w-2/3 flex justify-between bg-black text-white m-2 hover:text-black focus:border-black' onClick={() => { disconnect() }}>
                <div></div>
                <span>{address ? `${address.slice(0, 5)}...${address.slice(38)}` : "Disconnect"}</span>
                <IoExitOutline className='text-xl' />
              </button>
            ) : (
              <button className='btn flex flex-nowrap justify-center items-center w-2/3 bg-black text-white m-2 hover:text-black focus:border-black' onClick={() => { connect() }}>
                <BsWallet2 className='text-xl' />
                <span>Connect Wallet</span>
              </button>
          )}
        </div>
      </div>

      <div className='w-full'>
        <div className='text-3xl p-4 w-full text-center'>
          Payment History
        </div>
        <div className='w-full text-xl  flex justify-center items-center flex-col'>
          {isConnected ? (
            ownerAddress === address ? (
              <AdminDashboardTable />
            ) : (
              <p>Connected user must be the admin.</p>
            )
          ) : (
            <p>Please connect your wallet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard