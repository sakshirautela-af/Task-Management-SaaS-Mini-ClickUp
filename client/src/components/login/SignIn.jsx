import { useEffect, useState } from "react"
import { createUserDetails } from '../api/userApi'
import "./SignIn.css"
export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    useEffect(() => {
    }, [email, password])
    const handleSignIn = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("fill all")
        }
        const newUser = { email, password }

        try {
            const res = await createUserDetails(newUser)
            alert(res.message || "Signup successful!");

        } catch (error) {
            console.error(error);
            alert("An error occurred during signup.");
        }
    }
    return <div className="sign-up">
        <form onSubmit={handleSignIn}>
            <input placeholder=" Email" onChange={(e) => {
                setEmail(e.target.value);
            }} />
            <input placeholder="passsword" onChange={(e) => {
                setPassword(e.target.value);
            }} />
        </form>
    </div>
}