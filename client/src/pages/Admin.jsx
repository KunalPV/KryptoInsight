import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect, useContractRead, useBalance, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { BsWallet2 } from 'react-icons/bs'
import { IoExitOutline } from 'react-icons/io5'
import { FaEthereum } from 'react-icons/fa'
import kryptonAbi from '../../abi/kryptonAbi.json'
import surveyAbi from '../../abi/surveyAbi.json'
import SuccessToast from '../components/SuccessToast';
import ErrorToast from '../components/ErrorToast';

const kryptonAddress = '0x317E70D9Fca08D1104E0C5CA5f470EA5BAac658a';
const surveyAddress = "0x9519aec5F016DcEfbfB8e78e3a031D51a31b13e2";
const ownerAddress= "0x43536656cc67B2513DE53bafb4b44BFBf3286B85";

const Admin = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect({
      connector: new MetaMaskConnector
  });
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState([null, null, null]);
  const [addressData, setAddressData] = useState([]);
  const [amountData, setAmountData] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isAdmin = address === ownerAddress ? true : false;

  const adminBalance = useBalance({
    address: address,
    token: kryptonAddress,
  });

  const readGetMyRequests = useContractRead({
    address: surveyAddress,
    abi: surveyAbi,
    functionName: 'getMyRequests',
    args: [address]
  });

  useEffect(() => {
    if(readGetMyRequests.isSuccess) {
      setAddressData(readGetMyRequests.data[0]);
      setAmountData(readGetMyRequests.data[1]);
    }
  }, [readGetMyRequests]);

  const { config: approveConfig } = usePrepareContractWrite({
    address: kryptonAddress,
    abi: kryptonAbi,
    functionName: 'approve',
    args: [surveyAddress, (Number(selectedRowData[1]) * 1e18)],
  });

  const { data: approveData, write: approveWrite, isLoading: isApproveLoading } = useContractWrite(approveConfig);

  const { isSuccess: isApproveSuccess, isIdle: isApproveIdle } = useWaitForTransaction({
    hash: approveData?.hash
  });

  useEffect(() => {
    if(isApproveSuccess) {
      setSuccessMessage('Approved Successfully!');
    } else if(isApproveSuccess && !isApproveIdle) {
      setErrorMessage('Approval denied.');
    }
  }, [isApproveSuccess]);

  const { config: payRequestConfig } = usePrepareContractWrite({
    address: surveyAddress,
    abi: surveyAbi,
    functionName: 'sendTokens',
    args: [ownerAddress, selectedRowData[0], (Number?.(selectedRowData[1]) * 1e18), selectedRowData[2]]
  })

  const { data: payRequestData, write: payRequestWrite, isLoading: isPayRequestLoading } = useContractWrite(payRequestConfig);

  const { isSuccess: isPayRequestSuccess, isIdle: isPayRequestIdle } = useWaitForTransaction({
    hash: payRequestData?.hash
  })

  useEffect(() => {
    if(isPayRequestSuccess) {
      setSuccessMessage('Paid the requestor successfully!');
    } else if(isPayRequestSuccess && !isPayRequestIdle) {
      setErrorMessage('Error paying the requestor.');
    }
  }, [isPayRequestSuccess, isPayRequestIdle]);

  const handleRowClick = (index) => {
    setSelectedRowIndex(index);
    setSelectedRowData([addressData[index], amountData[index], index]);
  };

  // console.log(addressData)

  const AdminTable = () => {
    return  (
      <div className='overflow-y-auto hero-box rounded-lg flex flex-col justify-start items-center w-full'>
        <div className="overflow-x-auto w-full h-full">
          <table className="table text-lg w-full">
            {/* head */}
            <thead className='text-lg text-center'>
              <tr>
                <th>No.</th>
                <th>Address</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody className='text-center'>
              {readGetMyRequests.isSuccess ? (
                <>
                  {addressData?.map((addr, index) => {
                    const isSelected = selectedRowIndex ? selectedRowIndex[0] === index : false;

                    return (
                      <tr 
                      className={`${isSelected ? 'bg-base-200' : ''}  cursor-pointer hover`}
                      key={index}
                      onClick={() => handleRowClick(index)}
                      >
                        <th>{index + 1}</th>
                        <td>{addr}</td>
                        <td>{amountData[index].toString()}</td>
                      </tr>
                    )
                  })}
                </>
              ) : (
                <p>No requests yet.</p>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[100vh] flex flex-col justify-start items-center">
      {successMessage && <SuccessToast message={successMessage} />}
      {errorMessage && <ErrorToast message={errorMessage} />}
      <div className="w-full p-4 flex justify-between items-center">
        <div className='w-[25%]'>
          <Link to='/auth/signup'>
            <button className="btn bg-white border-black hover:bg-black hover:text-white">
              <AiOutlineArrowLeft />
              Go Back
            </button>
          </Link>
        </div>

        <div className='w-[50%] text-center'>
          <h1 className='text-3xl font-bold'>Admin</h1>
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

      <div className='w-full flex justify-center items-center p-10'>
        <div className='w-6/12 border border-stone-300 rounded-xl hero-box p-4 flex flex-col gap-4 justify-center items-center'>
          <div className='flex justify-between items-center w-full'>
            <div className='flex justify-center items-center gap-1 text-xl ml-4'>
              <p>Balance:</p>
              <span>
                {isConnected && isAdmin ? (
                  <>
                    {adminBalance.isLoading ? (
                      <span className="loading loading-spinner loading-md"></span>
                    ) : 
                      <span className='flex justify-center items-center font-bold text-2xl'>
                        {(Number(adminBalance.data?.formatted).toFixed(2))}
                        <FaEthereum className='font-extrabold' />
                      </span>
                    }
                  </>
                ) : "..."
                }
              </span>
            </div>
            <Link to='/admin/dashboard' className='w-full flex justify-end items-center' >
              <button className='btn w-64 bg-black text-white m-2 hover:text-black focus:border-black'>DashBoard</button>
            </Link>
          </div>
          
          <div className='w-full border-b-2 border-stone-300' />

          <div className='text-center text-xl w-full flex justify-center items-center'>
            {isConnected ? (
              <>
                {isAdmin ? (
                  <>
                    {
                      readGetMyRequests?.isSuccess ? (
                        <AdminTable />
                        ) : (
                        <span className="loading loading-spinner loading-lg"></span>
                      )
                    }
                  </>
                ) : (
                  <p>Connected Address is not admin address.</p>
                )}
              </>
            ) : (
              <p>Please connect your wallet.</p>
            )}
          </div>

          {isAdmin ? (
            <>
              {selectedRowData[0] ? (
                <>
                  <div className='w-full border-b-2 border-stone-300' />

                  <div className='flex justify-between items-center w-full text-lg px-4'>
                    <div className='flex flex-col gap-2'>
                      <h1 className='text-xl font-bold'>Selected User</h1>
                      <div className='flex justify-start items-center gap-2 flex-shrink'>
                        <h2>Address: </h2>
                        <p className='break-all text-base'>{selectedRowData[0]}</p>
                      </div>
                      <div className='flex justify-start items-center gap-2'>
                        <h2>Amount: </h2>
                        <p className='flex justify-center items-center'>
                          <span className='break-all'>{Number?.(selectedRowData[1])}</span>
                          <FaEthereum className='text-2xl' />
                          <span className='text-base'>or {`(${Number?.(selectedRowData[1]) * (1e18)} Wei)`}</span>
                        </p>
                      </div>
                    </div>
                    <div className='w-40'>
                      <div className="join join-vertical w-full">
                        <button type='button' className={`btn join-item bg-green-600 text-white hover:border-green-600 hover:text-green-600 hover:bg-white ${isConnected && address ? '' : 'btn-disabled'}`} onClick={() => approveWrite?.()}>
                          {isConnected && address ? (
                            isApproveLoading ? (
                              <span className="loading loading-spinner loading-sm"></span>
                              )
                              : 'Approve'
                              )
                            : 'Connect Wallet'
                          }
                        </button>
                        <button type='button' className={`btn join-item bg-green-600 text-white hover:border-green-600 hover:text-green-600 hover:bg-white ${isConnected && isApproveSuccess ? '' : 'btn-disabled'}`} onClick={() => payRequestWrite?.()}>
                        {isConnected && address ? (
                            isPayRequestLoading ? (
                              <span className="loading loading-spinner loading-sm"></span>
                              )
                              : 'Pay'
                              )
                            : 'Connect Wallet'
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className='flex justify-center items-center'>Please select an address to send the Kryptons <FaEthereum /> to.</p>
              )}
            </>
          ) : (
            <></>
          )}

        </div>
      </div>
    </div>
  )
}

export default Admin