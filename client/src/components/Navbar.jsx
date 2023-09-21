/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import pageUtils from '../utils/pageUtils'
import { IoIosLogOut } from 'react-icons/io'
import logo from '../assets/logo.png'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsPersonWorkspace } from 'react-icons/bs'

const Navbar = ({ api }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await api.get('/users/userName');
        setUsername(response.data.username);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching username: ', error);
        setIsLoading(false);
      }
    };

    fetchUsername();
  }, [api]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/auth/signup');
  }

  return (
    <div className="flex justify-center items-center navbar-box w-full sticky z-50">
      <div className="navbar w-[80%] p-1">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 gap-3">
              <NavLink to="/questionpage" className='flex flex-start justify-center items-center p-3 navlink-box'>
                <AiOutlinePlus />
                <p className='text-lg font-semibold ml-1'>Create</p>
              </NavLink>
              <NavLink to="/myworkspace" className='flex flex-start justify-center items-center p-3 navlink-box'>
                <BsPersonWorkspace />
                <p className='text-lg font-semibold ml-1'>My Workspace</p>
              </NavLink>
            </ul>
          </div>
          <NavLink to="/" className="flex justify-center items-center cursor-pointer px-5">
              <img src={logo} alt="Logo" className='w-[32px] h-[32px]' />
            <h1 className='font-red-hat leading-relaxed text-2xl font-semibold ml-3'>KryptoInsight</h1>
          </NavLink>
        </div>
        <div className="navbar-center hidden lg:flex gap-2">
          <ul className="menu menu-horizontal px-1 gap-3">
            <NavLink to="/questionpage" className='flex flex-start justify-center items-center px-3 py-2 navlink-box cursor-pointer'>
              <AiOutlinePlus className='w-5 h-5' />
              <p className='text-lg font-semibold ml-1'>Create</p>
            </NavLink>
            <NavLink to="/myworkspace" className='flex flex-start justify-center items-center px-3 py-2 navlink-box cursor-pointer'>
              <BsPersonWorkspace className='w-5 h-5' />
              <p className='text-lg font-semibold ml-2'>My Workspace</p>
            </NavLink>
          </ul>
        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-bottom dropdown-end">
            <div className='flex justify-end items-center gap-2'>
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  <p className='cursor-pointer font-bold' tabIndex={0}>{username}</p>
                  <div
                    className="flex items-center justify-center rounded-lg cursor-pointer"
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: pageUtils.getBackgroundColor(username),
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '20px',
                    }}
                    tabIndex={0}
                  >
                    {username[0].toUpperCase()}
                  </div>
                </>
              )}
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 flex flex-col gap-1">
              <li>
                <button className='btn btn-sm btn-ghost'>
                  <NavLink to={'/user/userAccount'}>
                    Account Settings
                  </NavLink>
                </button>
              </li>
              <li>
                <button className='btn btn-sm bg-red-500 text-white w-full flex justify-center items-center gap-2' onClick={handleLogout}>
                  Log out
                  <IoIosLogOut />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar