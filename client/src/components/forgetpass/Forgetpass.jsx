import { useState } from "react"
import { resetUserPassword } from '../api/userApi'
import { sendForgetPassMail } from '../api/othersApi'
import { useNavigate } from "react-router-dom"
import "./Forgetpass.css"
export default function Forgetpass() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [otp,setOtp] = useState("");
    const [sentotp,setSentotp] = useState(false);
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSendOtp =  async(email) => {
        if (!email) {
            setErrorMsg("Please fill Email.");
            return;
        }
        try {
            const res =  await sendForgetPassMail(email);
            if (res.ok) {
            setSentotp(true)
                
            } else {
                setErrorMsg(
                    res.data?.message || "Invalid email."
                );
            }
        } catch (error) {
            console.error(error);
            setErrorMsg("An error occurred during sign in.");
        }
    };
    const setNewPassword=async(email,otp,password,repassword)=>{
        if(!otp || !password || !repassword){
            setErrorMsg("Missing details");
            return ;
        }
        if(password !== repassword){
            setErrorMsg("Passwords do not match");
            return;
        }
        try{
            const res=await resetUserPassword({email,otp,password});
            if(res.ok){
                navigate("/signin");
            } else {
                setErrorMsg(res.data?.message || "Failed to reset password.");
            }
        }catch(error){
            console.error(error);
            setErrorMsg("An error occurred. Please try again.");
        }
    }
    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Forget  Password</h2>
                {errorMsg && <p className="error-message">{errorMsg}</p>}
                   {!sentotp && <div><input
                        className="auth-input"
                        type="email"
                        placeholder="Email Address"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="button" className="auth-btn" onClick={() => handleSendOtp(email)}>send otp</button></div>
                    }
                    {sentotp && <div>
                    <input
                        className="auth-input"
                        type="text"
                        placeholder="Enter otp"
                        onChange={(e) => setOtp(e.target.value)
                       }/> 
                        <input
                        className="auth-input"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)
                       }/> 
                        <input
                        className="auth-input"
                        type="password"
                        placeholder="Re-type Password"
                        onChange={(e) => setRepassword(e.target.value)
                       }/> 
                       <button className="auth-btn" onClick={()=>setNewPassword(email,otp,password,repassword)}>Set Password</button></div>
                    }
                <a href="/signup" className="auth-link">Don't have an account? <span>Sign Up</span></a>
                <a href="/signin" className="auth-link">Already have an account? <span>Sign In</span></a>
            </div>
        </div>
    );
}