/* eslint-disable react/prop-types */
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import UserLogin from '../../../schema/UserLogin';

const Login = ({ api }) => {
    const navigate = useNavigate();

    const onSubmit = async (values, actions) => {
        try {
            // console.log(values);
            // console.log(actions);
            
            const response = await api.post('/auth/login', values);
            const token = response.data.token;
            localStorage.setItem('accessToken', token);

            if(response.status === 200) {
                navigate('/');
            }
            actions.resetForm();
        } catch (error) {
            if(error.response.status === 404) {
                formik.setFieldError('email', 'User not found. Try signing up Instead');
            } else if(error.response.status === 400) {
                formik.setFieldError('password', 'Invalid credentials.');
            } else {
                console.log('Unexpected response error: ', error.response.status)
            }
        }
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        onSubmit,
        validationSchema: UserLogin,
    });

    return (
        <div className={`w-full`}>
            <div 
                className="w-full flex flex-col justify-center items-center"
            >
                <div className="w-full flex justify-end items-center p-4 gap-2">
                    <p>Don&apos;t have an account yet?</p>
                    <Link to="/auth/signup">
                        <button type='button' className="btn bg-white border-black hover:bg-black hover:text-white">
                                Sign Up
                        </button>
                    </Link>
                </div>
                <div className="w-[25%] mt-10 flex flex-col justify-center items-center gap-2 p-2">
                    <h1 className="text-5xl font-semibold">KryptoInsight</h1>
                    <p className="text-lg font-semibold">Hello, who&apos;s this?</p>
                    <form onSubmit={formik.handleSubmit} className="w-full flex flex-col justify-center items-center gap-2">
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
                        <span className="flex items-start w-full text-xs text-stone-500 underline cursor-pointer">Forgot Password?</span>
                        <button className='btn bg-black text-white border-black hover:text-black hover:bg-white w-full text-sm flex justify-center items-center' disabled={formik.isSubmitting} type='submit'>
                            {formik.isSubmitting ? <span className="loading loading-spinner"></span> : "Login to KryptoInsight"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login