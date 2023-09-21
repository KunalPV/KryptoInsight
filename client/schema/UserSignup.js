import * as yup from 'yup';

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
// Minimum five characters, at least one letter and one number.

const UserSignup = yup.object().shape({
    username: yup.string().required("Username is required"),
    email: yup.string().email("Please enter a valid email").required("Email is required"),
    password: yup
        .string()
        .min(5)
        .matches(passwordRules, {message: "Please create a stronger password, should contain atleast 1 capital letter and 1 number."})
        .required('Password is required.')
})

export default UserSignup;