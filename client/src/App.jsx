import { BrowserRouter, Routes, Route } from "react-router-dom"
import Signup from './components/signup/SignUp'
import Home from "./components/home/home.jsx"
import SignIn from './components/login/SignIn'
import Projects from './components/projects/Projects.jsx'
import Tasks from './components/tasks/tasks.jsx'
import ForgetPassword from "./components/forgetpass/Forgetpass.jsx"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/forgetpass" element={<ForgetPassword/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App
