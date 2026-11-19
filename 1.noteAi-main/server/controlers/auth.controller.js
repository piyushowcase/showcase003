import UserModel from "../models/user.model.js"
import { getToken } from "../utils/token.js"

export const googleAuth=async(req,res) => {
    try{
const {name , email} = req.body

let user = await UserModel.findOne({email})
if(!user){
    user=await UserModel.create({
        name,email
    })
}
 let token=await getToken(user._id) 
res.cookie("token",
    token,{
    httpOnly:true,
    // `secure: true` cookies are not stored when running the local app over HTTP.
    // Keep the production cross-site cookie configuration, but allow localhost dev.
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge:7*24*60*60*1000
}) 
return res.status(200).json(user)
 }
    catch (e){
        console.error("googleAuth error:", e)
        return res.status(500).json({message:`googleSignup Error ${e.message || e}`})

    }
}
export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (e) {
    console.error("logOut error:", e);
    return res.status(500).json({ message: `googleLogout Error ${e.message || e}` });
  }
};
