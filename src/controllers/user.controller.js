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
    throw res.status(500).json({error : "Error generating tokens"});
  }
}

const registerUser = async(req , res)=>{
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
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if(!createdUser){
    return res.status(400).json({error : "User not created"});
  }
  
  return res.status(201).json({message : "User created successfully" , user : createdUser});


}
export {registerUser};