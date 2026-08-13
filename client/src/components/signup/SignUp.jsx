import { useEffect, useState } from "react"
import { createUserDetails, sendMail } from '../api/userApi'
import "./SignUp.css"
import { useNavigate } from "react-router-dom"
import SignIn from "../login/SignIn";

export default function Signup() {
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState("")
    useEffect(() => {
    }, [email, firstName, lastName, password, repassword])
    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!firstName || !lastName || !email || !password || !repassword) {
            setErrorMsg("Please fill in all required fields.");
            return;
        }
        if (password !== repassword) {
            setErrorMsg("Passwords do not match.");
            return;
        }
        const newUser = { firstName, lastName, email, password, otp }
        try {
            //verify email first
            const email_res = await sendMail(email)
            if (!email_res.ok) {
                setErrorMsg(email_res.data?.message || "Failed to send OTP")
                return;
            }
            setOtpSent(true);
            const res = await createUserDetails(newUser)
            if (!res.ok) {
                setErrorMsg(res.data?.message || "Failed to create account")
                return;
            }
            alert(res.data?.message || "Signup successful!");
            // navigate('/signin')
        } catch (error) {
            console.error(error);
            setErrorMsg("An error occurred during signup.");
        }
    }
    return (
        <div className="auth-page">
            <div className="auth-card signup-card">
                <h2>Create Account</h2>
                {errorMsg && <p className="error-message">{errorMsg}</p>}
                <form className="auth-form" onSubmit={handleSignUp}>
                    <div className="name-group">
                        <input className="auth-input" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} />
                        <input className="auth-input" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <input className="auth-input" type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} />
                    <input className="auth-input" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <input className="auth-input" type="password" placeholder="Confirm Password" onChange={(e) => setRepassword(e.target.value)} />

                    {otpSent && <input className="auth-input" type="text" placeholder="OTP" onChange={(e) => setOtp(e.target.value)} />}
                    <button className="auth-btn" type="submit">Create Account</button>
                </form>
                <a href="/signin" className="auth-link">Already have an account? <span>Sign In</span></a>
            </div>
        </div>
    );
}