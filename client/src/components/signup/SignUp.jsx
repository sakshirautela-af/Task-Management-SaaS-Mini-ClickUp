import { useEffect, useState } from "react"
import { createUserDetails } from '../api/userApi'
import "./SignUp.css"
import { useNavigate } from "react-router-dom"
import SignIn from "../login/SignIn";

export default function Signup() {
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    useEffect(() => {
    }, [email, firstName, lastName, phone, password, repassword])
    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !phone || !password || !repassword) {
            alert("fill all")
        }
        const newUser = { firstName, lastName, email, password, phone }
        try {
            const res = await createUserDetails(newUser)
            alert(res.message || "Signup successful!");
            // navigate('/signin')
        } catch (error) {
            console.error(error);
            alert("An error occurred during signup.");
        }
    }
    return <div className="sign-up">
        <form onSubmit={handleSignUp}>
            <div className="user-name">
                <input className="name" placeholder=" First Name" onChange={(e) => {
                    setFirstName(e.target.value);
                }} />
                <input className="name" placeholder=" Last Name" onChange={(e) => {
                    setLastName(e.target.value);
                }} /></div>
            <input placeholder=" Email" onChange={(e) => {
                setEmail(e.target.value);
            }} />
            <input placeholder="phone" onChange={(e) => {
                setPhone(e.target.value);
            }} />
            <input placeholder="passsword" onChange={(e) => {
                setPassword(e.target.value);
            }} />
            <input placeholder="Confirm passsword" onChange={(e) => {
                setRepassword(e.target.value);
            }} />
            <button type="submit">Submit</button>
        </form>
    </div>
}