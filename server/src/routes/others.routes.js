import {sendSignUpMail,sendforgetPassMail} from "../controllers/others.controller.js"
import express from "express"
const router=express.Router();
router.post("/signup-otp",sendSignUpMail)
router.post("/forgetpass-otp",sendforgetPassMail)
export default router;