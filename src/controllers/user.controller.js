import {User} from "../models/user.model.js";



const generateAccessAndRefreshTokens = async (userId) => {
  try{
    const user = await User.findById(userId)
    const accessToken = user.genrateAccessToken();
    const refreshToken = user.genrateRefreshToken();

    user.refreshToken = refreshToken; 
    await user.save()

    return { accessToken, refreshToken };
  }
  catch(err){
    throw new Error("Error generating tokens");
  }
}

const registerUser = async(req , res)=>{
  try{
    const {name , email , password , role} = req.body;

    if([name , email , password , role].some(field => field?.trim() === "")){
      return res.status(400).json({error : "All fields are required"});
    }

    const existedUser = await User.findOne({email})
    if(existedUser){
      return res.status(400).json({error : "User already exists"});
    }
    const user = await User.create(
      {
        name,
        email,
        password,
        role
      }
    )
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
      return res.status(400).json({message : "User not created"});
    }
    
    return res.status(201).json({
      message : "User created successfully",
      token: accessToken,
      refreshToken,
      user : createdUser
    });
  }
  catch(err){
    return res.status(500).json({message : "Error creating user"});
  }

};

const loginUser= async(req,res)=>{
  try{
    const {email , password, role} = req.body;
    const user= await User.findOne({email});
    if(!user){
      return res.status(400).json({error : "User not found Try Signing Up"});
    }
    const validatePassword =await user.comparePassword(password);
    if(!validatePassword){
      return res.status(400).json({error : "Invalid Password"});
    }
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    return res.status(200).json({message : "User logged in successfully", token: accessToken, refreshToken, user: loggedInUser})
  }


  catch(err){
    return res.status(500).json({message : "Error logging in user"});
  }
}

const logoutUser = async(req,res)=>{
  try{
    await User.findByIdAndUpdate(req.user._id , {refreshToken : null});
    const options = {
      httpOnly: true,
    }
    return res.
    status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json({message : "User logged out successfully"});
  }
  catch(err){
    return res.status(500).json({message : "Error logging out user"});  
     
  }
}
export {registerUser, loginUser , logoutUser};
