import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';

const VerifyUser = ({ api }) => {
  const navigate = useNavigate();
  const [disableButton, setDisableButton] = useState(false);

  const onSubmit = async (values, actions) => {
    try {
      // console.log(values)

      const response = await api.post('/auth/verifyUser', values); 
      console.log(response.data);

      if (response.status === 200) {
        navigate('/onboarding');
      } else {
        console.log('Verification failed:', response.data.message);
        formik.setFieldError('verificationCode', 'Invalid verification code');
      }

      actions.resetForm();
    } catch (error) {
      if(error) {
        formik.setFieldError('verificationCode', 'Entered code is not valid.');
    }
    }
  }

  const formik = useFormik({
    initialValues: {
      verificationCode: '',
    },
    onSubmit,
  })

  const handleResendCode = async () => {
    try {
      const  response = await api.post('/auth/resendVerifyCode');
      console.log(response.data);
      setDisableButton(true);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='w-full h-[100vh] flex justify-center items-center'>
      <div className="w-[25%] flex flex-col justify-center items-center gap-2 p-2">
        <h1 className="text-5xl font-semibold">KryptoInsight</h1>
        <p className="text-xl font-semibold">Enter the code</p>

        <form onSubmit={formik.handleSubmit} className='w-full flex flex-col justify-center items-center gap-2'>
          <div className='flex flex-col gap-2 justify-center items-center'>
            <label htmlFor="verificationCode" className='font-light text-sm w-full'>Enter the 6 Digit Code which we sent to your email, be careful not to share the code with anyone.</label>
            <input 
              type="text" 
              id='verificationCode'
              placeholder="Type your verification code" 
              className={`input input-bordered w-full ${formik.errors.verificationCode && formik.touched.verificationCode ? 'border-red-500' : ''}`}
              value={formik.values.verificationCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.verificationCode && formik.touched.verificationCode ?  <p className='text-xs text-red-500'>{formik.errors.verificationCode}</p> : <></>}
          </div>
          <button type='submit' className='btn'>Verify</button>
        </form>

        <div className='flex justify-center items-center gap-2'>
          <p className='text-sm'>Haven't received the code yet?</p>
          <button className={`btn btn-sm ${disableButton ? 'btn-disabled' : ''}`} onClick={() => handleResendCode()}>Resend Code.</button>
        </div>

        <button type='button' className='btn btn-link text-stone-500' onClick={() => navigate('/auth/signup')}>go back</button>
      </div>
    </div>
  )
}

export default VerifyUser