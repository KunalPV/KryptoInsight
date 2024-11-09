/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect, useContractRead, useBalance, useContractWrite, usePrepareContractWrite, useWaitForTransaction, useToken } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { BiSolidCoinStack, BiSolidUser } from 'react-icons/bi'
import { MdContactPage } from 'react-icons/md'
import { VscLayersActive } from 'react-icons/vsc'
import { BsWallet2 } from 'react-icons/bs'
import { TbDotsVertical } from 'react-icons/tb'
import { IoExitOutline } from 'react-icons/io5'
import { FaEthereum, FaStarOfLife } from 'react-icons/fa'

const UserAccount = ({ api }) => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect({
      connector: new MetaMaskConnector
  });
  const kryptonAddress = '0x317E70D9Fca08D1104E0C5CA5f470EA5BAac658a';

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userAccount, setUserAccount] = useState({});
  const [activeSurveys, setActiveSurveys] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenInfo, setTokenInfo] = useState({});
  const [greeting, setGreeting] = useState('');

  const userTokenBalance = useBalance({
    address: address,
    token: kryptonAddress,
  });

  useEffect(() => {
    if(userTokenBalance.isSuccess) {
      setUserBalance(Number(userTokenBalance.data?.formatted)?.toFixed(2));
      setTokenSymbol(userTokenBalance.data?.symbol);
    }
  }, [userTokenBalance.isSuccess]);

  const kryptonInfo = useToken({
    address: kryptonAddress,
  });

  useEffect(() => {
    if(kryptonInfo.isSuccess) {
      setTokenInfo(kryptonInfo?.data);
    }
  }, [kryptonInfo.isSuccess]);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await api.get('/users/userAccountDetails');
        // console.log(response.data);
        setUserAccount(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching username: ', error);
        setIsLoading(false);
      }
    };

    const fetchActiveSurveys = async () => {
      try {
        const response = await api.get('/surveys/activeSurveys');
        // console.log(response.data);
        setActiveSurveys(response.data.count);
      } catch (error) {
        console.error('Error fetching active surveys: ', error);
      }
    };

    fetchAccount();
    fetchActiveSurveys();
  }, [api]);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await api.delete('/users/user/userAccount');

      localStorage.removeItem('accessToken');

      navigate('/auth/signup');
    } catch (error) {
      console.error('Error deleting user account: ', error);
    }
    finally {
      setIsDeleting(false);
    }
  }

  const getTimeStatus = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return "Good Morning";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  }

  useEffect(() => {
    setGreeting(getTimeStatus());
  }, []);

  return (
    <div className="w-full flex justify-center items-center mb-4">
      <div className="w-[75%] flex justify-center items-center mt-10 flex-col gap-6">
        <div className="w-full flex flex-col gap-4">
          <h1 className="text-5xl font-bold">{greeting}, {userAccount.username}.</h1>
          <p className="text-xl font-light">Welcome to your account settings page!</p>
        </div>

        <div className='hero-box w-full rounded-xl p-4'>
          <div className="px-2 w-full flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Account Details</h1>
            {isConnected ? (
              <button className='btn w-64 flex justify-between bg-black text-white hover:text-black focus:border-black' onClick={() => { disconnect() }}>
                <div></div>
                <span>{address ? `${address.slice(0, 5)}...${address.slice(38)}` : "Disconnect"}</span>
                <IoExitOutline className='text-xl' />
              </button>
            ) : (
              <button className='btn flex flex-nowrap justify-center items-center w-64 bg-black text-white hover:text-black focus:border-black' onClick={() => { connect() }}>
                <BsWallet2 className='text-xl' />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>

          <div className='border-t-2 border-stone-400 w-full my-4' />

          <div className="flex justify-center items-center my-2">
            <div className="stats shadow-xl border-stone-200 border-2">
  
              <div className="stat">
                <div className="stat-figure">
                  <BiSolidUser className='text-5xl font-bold' />
                </div>
                <div className="stat-title">Address</div>
                <div className="stat-value text-lg">{address}</div>
                <div className="stat-desc">Metamask</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure">
                  <FaEthereum className='text-5xl font-bold' />
                </div>
                <div className="stat-title">Balance</div>
                <div className="stat-value flex justify-center items-center gap-1">
                  {userBalance}
                  <span className='stat-desc h-full flex justify-center items-end py-1'>{tokenSymbol}</span>
                </div>
                <div className="stat-desc">Kryptons</div>
              </div>
              
            </div>
          </div>
        </div>

        <div className='hero-box w-full rounded-xl p-4'>
          <div className="px-2 w-full flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Account Details</h1>
          </div>

          <div className='border-t-2 border-stone-400 w-full my-4' />

          <div className="flex justify-center items-center my-2">
            <div className="stats stats-vertical shadow-xl border-stone-200 border-2">
  
              <div className="stat">
                <div className="stat-figure">
                  <svg xmlns="http://www.w3.org/2000/svg" className='w-14 h-14' data-name="Layer 1" viewBox="0 0 128 128" id="polygon"><path d="m85.52 45.58-43 24.85a5.24 5.24 0 0 1-5.2 0L23.55 62.5A5.2 5.2 0 0 1 21 58V42.14a5.2 5.2 0 0 1 2.6-4.5l13.73-7.93a5.24 5.24 0 0 1 5.2 0l13.73 7.93a5.2 5.2 0 0 1 2.6 4.5v7.61a1.3 1.3 0 0 0 1.94 1.13l7.15-4.13a2.59 2.59 0 0 0 1.29-2.25v-8.36a5.21 5.21 0 0 0-2.59-4.5L42.48 17.72a5.19 5.19 0 0 0-5.2 0L13.16 31.64a5.2 5.2 0 0 0-2.6 4.5V64a5.2 5.2 0 0 0 2.6 4.5l24.12 13.92a5.19 5.19 0 0 0 5.2 0l43-24.85a5.24 5.24 0 0 1 5.2 0l13.73 7.93a5.2 5.2 0 0 1 2.6 4.5v15.86a5.2 5.2 0 0 1-2.6 4.5l-13.69 7.93a5.24 5.24 0 0 1-5.2 0l-13.73-7.93a5.2 5.2 0 0 1-2.6-4.5v-7.62a1.29 1.29 0 0 0-1.94-1.12l-7.15 4.12a2.6 2.6 0 0 0-1.29 2.25v8.37a5.21 5.21 0 0 0 2.59 4.5l24.12 13.92a5.19 5.19 0 0 0 5.2 0l24.12-13.92a5.2 5.2 0 0 0 2.6-4.5V64a5.2 5.2 0 0 0-2.6-4.5L90.72 45.58a5.19 5.19 0 0 0-5.2 0Z"></path></svg>
                </div>
                <div className="stat-title">Token Address</div>
                <div className="stat-value text-lg">{tokenInfo.address}</div>
                <div className="stat-desc">Polygon Mumbai Testnet</div>
              </div>
              

                <div className="stats rounded-none shadow">
                  <div className="stat">
                    <div className="stat-figure">
                      <FaEthereum className='text-5xl font-bold' />
                    </div>
                    <div className="stat-title">Token</div>
                    <div className="stat-value">{tokenInfo?.name}</div>
                    <div className="stat-desc">{tokenInfo?.symbol}</div>
                  </div>
                  
                  <div className="stat">
                    <div className="stat-figure">
                      <TbDotsVertical className='text-5xl font-bold' />
                    </div>
                    <div className="stat-title">Decimals</div>
                    <div className="stat-value">{tokenInfo?.decimals}</div>
                    <div className="stat-desc">1 token = 1 * (1e18)</div>
                  </div>
                  
                  <div className="stat">
                    <div className="stat-figure">
                      <FaStarOfLife className='text-3xl font-bold' />
                    </div>
                    <div className="stat-title">Total Supply</div>
                    <div className="stat-value">{Number(tokenInfo?.totalSupply?.formatted).toFixed(2)}</div>
                    <div className="stat-desc">{tokenInfo?.symbol}</div>
                  </div>
                </div>

              
            </div>
          </div>
        </div>

        <div className="hero-box w-full rounded-xl p-4">
          <div className="px-2">
            <h1 className="text-2xl font-semibold">Profile Details</h1>
          </div>

          <div className='border-t-2 border-stone-400 w-full my-4' />

          <div className="flex justify-center items-center my-2">
            {
              isLoading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                <>
                  <div className="stats shadow-xl border-stone-200 border-2">
                    <div className="stat">
                      <div className="stat-figure">
                        <BiSolidCoinStack className='text-5xl font-bold' />
                      </div>
                      <div className="stat-title">Balance</div>
                      <div className="stat-value">{userAccount.userBalance}</div>
                      <div className="stat-desc">Points</div>
                    </div>
                    
                    <div className="stat">
                      <div className="stat-figure">
                        <MdContactPage className='text-5xl font-bold' />
                      </div>
                      <div className="stat-title">Surveys</div>
                      <div className="stat-value">{userAccount.surveysCreated}</div>
                      <div className="stat-desc">Surveys Created.</div>
                    </div>
                    
                    <div className="stat">
                      <div className="stat-figure">
                        <VscLayersActive className='text-5xl font-bold' />
                      </div>
                      <div className="stat-title">Active Surveys</div>
                      <div className="stat-value">{activeSurveys}</div>
                      <div className="stat-desc">No. of active surveys.</div>
                    </div>
                  </div>
                </>
              )
            }
          </div>
        </div>

        <div className='flex justify-end items-end w-full'>
          <button className={`btn btn-error hover:btn-ghost ${isDeleting ? 'btn-disabled' : ''}`} onClick={handleDeleteAccount}>
            {isDeleting ? <span className="loading loading-spinner loading-md"></span> : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserAccount