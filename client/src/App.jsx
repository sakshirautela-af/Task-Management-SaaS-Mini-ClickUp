import { useState } from 'react'
import './App.css'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Signup from './components/signup/SignUp'
import UserRoutes from './components/routes/userroutes'
import Home from "./components/home"
import SignIn from './components/login/SignIn'
function App() {
  return (
  //  <BrowserRouter>
  //     <Routes>
  //       <Route path="/" element={<Home />} />
  //     </Routes>
  //   </BrowserRouter>
  <>
    <SignIn/>
  </>
  );
}

export default App
