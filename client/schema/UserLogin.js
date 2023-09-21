import * as yup from 'yup';

const UserLogin = yup.object().shape({
    email: yup.string().email("Please enter a valid email").required("Email is required"),
    password: yup
        .string()
        .min(5)
        .required('Password does not match.')
})

export default UserLogin;