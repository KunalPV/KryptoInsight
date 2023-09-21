/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineUser } from 'react-icons/ai'
import { useFormik } from 'formik'
import UserSignup from '../../../schema/UserSignup';

const Signup = ({ api }) => {
    const navigate = useNavigate();

    const [hasAccount, setHasAccount] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const onSubmit = async (values, actions) => {
        try {
            // console.log(values);

            const response = await api.post('/auth/signup', values);
            const token = response.data.token;
            localStorage.setItem('accessToken', token);
            
            if(response.status === 200) {
                navigate('/auth/verifyUser');
            } else {
                console.log('Error signing up: ', response.data);
            }

            actions.resetForm();
        } catch (error) {
            console.error('Error verifying user:', error);
            formik.setFieldError('verificationCode', 'Error verifying user');
        }
    }

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: ''
        },
        onSubmit,
        validationSchema: UserSignup,
    });

    return (
        <div className="w-full flex md:flex-row flex-col justify-center items-center h-screen bg-[#131313]">
            <div className="w-[50%] h-full flex flex-col justify-between items-center text-white gap-4 text-start relative z-10">
                <div></div>
                <div className="absolute z-2 top-[-120px] right-[-120px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 813 400" fill="none">
                        <path opacity="0.5" d="M545.549 -214.551C485.556 -223.544 475.059 -94.4236 415.073 -103.454C378.273 -108.994 376.46 -166.525 339.624 -161.226C304.487 -156.172 312.023 -110.971 283.028 -90.6444C203.357 -34.7909 104.098 -243.311 41.7376 -154.819C-48.8296 -26.3002 260.13 -18.6558 207.638 80.7562C178.985 135.021 65.2206 106.65 75.5823 167.04C91.1652 257.861 245.333 134.631 303.863 202.782C343.006 248.36 287.416 327.561 342.9 351.132C407.533 378.588 407.046 252.038 472.88 227.552C590.28 183.889 673.067 441.519 765.838 357.85C858.83 273.983 614.746 171.95 660.99 56.0227C683.422 -0.210576 794.251 0.00808451 771.818 -56.2246C748.035 -115.844 650.247 -26.8597 595.814 -61.4328C541.711 -95.7963 609.07 -205.029 545.549 -214.551Z" stroke="white" strokeOpacity="0.5" strokeWidth="50" strokeDasharray="3.85 3.85"/>
                    </svg>
                </div>
                <div className="absolute z-2 bottom-0 left-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="295" viewBox="0 0 436 295" fill="none">
                        <path opacity="0.5" d="M168.549 25.4492C108.556 16.4562 98.0595 145.576 38.0726 136.546C1.2727 131.006 -0.539916 73.4751 -37.3759 78.7736C-72.5131 83.8277 -64.9774 129.029 -93.9723 149.356C-173.643 205.209 -272.902 -3.31119 -335.262 85.1811C-425.83 213.7 -116.87 221.344 -169.362 320.756C-198.015 375.021 -311.779 346.65 -301.418 407.04C-285.835 497.861 -131.667 374.631 -73.1366 442.782C-33.9937 488.36 -89.5841 567.561 -34.0997 591.132C30.5325 618.588 30.0459 492.038 95.8803 467.552C213.28 423.889 296.067 681.519 388.838 597.85C481.83 513.983 237.746 411.95 283.99 296.023C306.422 239.789 417.251 240.008 394.818 183.775C371.035 124.156 273.247 213.14 218.814 178.567C164.711 144.204 232.07 34.9712 168.549 25.4492Z" stroke="white" strokeOpacity="0.5" strokeWidth="50" strokeDasharray="3.85 3.85"/>
                    </svg>
                </div>
                <div className="w-[80%] flex flex-col gap-4">
                    <h1 className="md:text-5xl text-3xl">Frustrated with Surveys That Don&apos;t Value Your Time and Effort?</h1>
                    <p className="md:text-lg text-md text-stone-300">Break free from uninspiring surveys! KryptoInsight offers crypto rewards for your valuable insights.</p>
                </div>
                <p className="font-light p-8 flex flex-col text-center">
                    © 2023 KryptoInsight. 
                    <span>All rights reserved. | Privacy Policy | Terms of Use</span>
                </p>
            </div>


            <div 
                className={`w-[50%] h-full flex flex-col justify-between items-center md:rounded-l-3xl rounded-none bg-white`}
            >
                <div className="flex justify-end items-center gap-2 w-full p-4">
                    <p>Already have an account?</p>
                    <Link to="/auth/login">
                        <button type='button' className="btn bg-white border-black hover:bg-black hover:text-white">
                            Log in
                        </button>
                    </Link>
                </div>
                <div className="flex flex-col justify-around items-center w-full gap-4">
                    <h1 className="text-5xl font-semibold">KryptoInsight</h1>
                    <p className="font-light text-lg">Your data deserves the highest level of protection</p>
                    {hasAccount ?
                        <div>
                            <form onSubmit={formik.handleSubmit} className="w-full flex flex-col justify-center items-center gap-2">
                                <div className="w-full flex flex-col justify-center items-start gap-1">
                                    <label htmlFor="username">Username</label>
                                    <input 
                                        type="text"
                                        id="username"
                                        placeholder="Type your username"
                                        className={`input input-bordered w-full ${formik.errors.username && formik.touched.username ? 'border-red-500' : ''}`}
                                        value={formik.values.username}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.username && formik.touched.username ?  <p className='text-xs text-red-500'>{formik.errors.username}</p> : <></>}
                                </div>
                                <div className="w-full flex flex-col justify-center items-start gap-1">
                                    <label htmlFor="email">Email</label>
                                    <input 
                                        type="text"
                                        id="email"
                                        placeholder="Type your email"
                                        className={`input input-bordered w-full ${formik.errors.email && formik.touched.email ? 'border-red-500' : ''}`}
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.email && formik.touched.email ?  <p className='text-xs text-red-500'>{formik.errors.email}</p> : <></>}
                                </div>
                                <div className="w-full flex flex-col justify-center items-start gap-1">
                                    <label htmlFor="password">Password</label>
                                    <input 
                                        type="password"
                                        id="password"
                                        placeholder="Enter the password"
                                        className={`input input-bordered w-full ${formik.errors.password && formik.touched.password ? 'border-red-500' : ''}`}
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.password && formik.touched.password ?  <p className='text-xs text-red-500'>{formik.errors.password}</p> : <></>}
                                </div>
                                <button className='btn bg-black text-white hover:border-black hover:text-black hover:bg-white w-full text-sm flex justify-center items-center' disabled={formik.isSubmitting} type='submit'>
                                    {formik.isSubmitting ? <span className="loading loading-spinner"></span> : "Sign up to KryptoInsight"}
                                </button>
                                <button type='button' className='btn btn-link text-stone-500' onClick={() => setHasAccount(false)}>go back</button>
                            </form>
                        </div>
                    :
                        <div className="flex flex-col w-full justify-center items-center gap-3 mt-2">
                            <Link to='/admin' className='w-full flex justify-center items-center'>
                                <button type='button' className="btn btn-ghost hero-box w-[40%] text-sm flex flex-row justify-center items-center flex-nowrap">
                                    <AiOutlineUser className='w-4 h-4' /> Admin Page
                                </button>
                            </Link>

                            <div className='w-[50%] border-b-2 border-stone-300' />

                            <button type='button' className="btn bg-black text-white hover:border-black hover:text-black hover:bg-white w-[40%] text-sm flex justify-center items-center" onClick={() => setHasAccount(true)}>
                                Sign up with email
                            </button>
                        </div>
                    }
                </div>
                <div></div>
            </div>
        </div>
    )
}

export default Signup