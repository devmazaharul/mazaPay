const { AppError } = require("../../utils/error");
const { validateUserData, isValidObjectId } = require("../../utils/validation");
const { accountService } = require("../services");

const createUser=async(req,res,next)=>{
  try {
    const name=req.body?.name;
    const email=req.body?.email;
    const address=req.body?.address;  
    if(!name || !email || !address) throw AppError("All fields are required (name, email, address)",400)
    if(!validateUserData({item:name,type:"name"})) throw AppError("Invalid name convention",400)
    if(!validateUserData({item:email,type:"email"})) throw AppError("Invalid email convention",400)
    if(!validateUserData({item:address,type:"address"})) throw AppError("Invalid address convention",400)

      const responce=await accountService.accountCreateService({name,email,address})
      if(responce?.status==200){
        res.status(200).json(responce)
      }
    
  } catch (error) {
    next(error)
  }         
}


const accessUser=async(req,res,next)=>{
  try {
    const email=req.body?.email;
    const pin=req.body?.pin;
      if(!email || !pin) throw AppError("Invalid email or pin")
        if(pin.length>5 || pin.length<4) throw AppError("Pin incorrect");
      if(!validateUserData({item:email,type:"email"})) throw AppError("Invalid email address");
      if(pin.length!==5) throw AppError("Invalid creadentials")

      const responce=await accountService.accessAccountService({email,pin})
      if(responce?.status==200){
        res.status(200).json(responce)
      }
   


  } catch (error) {
    next(error)
  }
}
const infoUser=async(req,res,next)=>{
  try {
    const userID=req.params?.id;
    const currentUsr=req.currentUserInfo;

    if(!userID) throw AppError("Invali user id");
    if(!isValidObjectId(userID)) throw AppError("Invalid user id");
    if((currentUsr?.item?._id).toString()!==userID) throw AppError("Invalid user id")
      res.status(200).json(currentUsr)

  } catch (error) {
    next(error)
  }
}
const updateUser=async(req,res,next)=>{
  try {
        const userID=req.params?.id;
    const currentUsr=req?.currentUserInfo;
    const newName=req.body?.name;
    const newAddress=req.body?.address;
  if(!newName && !newAddress) throw AppError("Invalid update oparation")
    if(!userID) throw AppError("Invali user id");
    if(!isValidObjectId(userID)) throw AppError("Invalid user id");
    if((currentUsr?.item?._id).toString()!==userID) throw AppError("Invalid user id")
      const responce=await accountService.updateUserInfo({currentUsr,newName,newAddress})
    if(responce?.status==200){
      res.status(200).json(responce)
    }
  } catch (error) {
    next(error)
  }
}
const changePin=async(req,res,next)=>{
  try {
        const userID=req.params?.id;
    const currentUsr=req.currentUserInfo;

    if(!userID) throw AppError("Invali user id");
    if(!isValidObjectId(userID)) throw AppError("Invalid user id");
    if((currentUsr?.item?._id).toString()!==userID) throw AppError("Invalid user id")
      //const responce=await ;
    
  } catch (error) {
    next(error)
  }
}
const resetPin=async(req,res,next)=>{
  try {
    
  } catch (error) {
    next(error)
  }
}


const getnarateApiKey=async(req,res,next)=>{
  try {
    const currentUser=req?.currentUserInfo;
    const marcentName=req.body?.marcentname;
    const callbackURL=req.body?.callbackurl;
    const websiteURL=req.body?.websiteurl;
    if(!currentUser) throw AppError("Invalid user token")
 
    if(!marcentName || !callbackURL || !websiteURL) throw AppError("All fields are required (marcentName, callbackURL, websiteURL)")

    if(!validateUserData({item:marcentName,type:"name"})) throw AppError("Invalid marcent name convention",400)
    if(!validateUserData({item:callbackURL,type:"url"})) throw AppError("Invalid callback url",400)
    if(!validateUserData({item:websiteURL,type:"url"})) throw AppError  ("Invalid website url",400)
    if(marcentName.length<3 || marcentName.length>50) throw AppError("Marcent name should be between 3 to 50 characters")
    if(callbackURL.length<5 || callbackURL.length>100) throw AppError("Callback url should be between 5 to 100 characters")
    if(websiteURL.length<5 || websiteURL.length>100) throw AppError("Website url should be between 5 to 100 characters")

    const responce=await accountService.getnarateApiKeyService({currentUser,marcentName,callbackURL,websiteURL})
    if(responce?.status==200){
      res.status(200).json(responce)
    }
  } catch (error) {
    next(error)
  }
}


module.exports={
  createUser,
  accessUser,
  changePin,
  updateUser,
  infoUser,
  resetPin,
  getnarateApiKey
}