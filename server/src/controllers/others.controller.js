import * as otherService from "../service/other.service.js"
export const sendSignUpMail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const response = await otherService.initiateSignup(email);
        if (response.error) {
            return res.status(response.status || 400).json({ message: response.error });
        }
        res.status(200).json({
            message: "otp sent sucessfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "failed to send otp"
        })
    }
}

export const sendforgetPassMail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const response = await otherService.initiateForgetPassword(email);
        if (response.error) {
            return res.status(response.status || 400).json({ message: response.error });
        }
        res.status(200).json({
            message: "otp sent sucessfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "failed to send otp"
        })
    }
}