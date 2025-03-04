import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try{
        const {userId} = req.body;
        const user = await userModel.findById(userId)
        if(!user) {
            return res.json({success:false, message: "User not Found!"})
        }
        return res.json({
            success: true,
            userData:{
            name: user.name,
            isAccountVerified: user.isAccountVerified
            }
        })

    }
    catch(err) {
        return res.json({success:false, message: err.message})
    }

}