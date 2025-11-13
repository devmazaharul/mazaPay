const { AppError } = require('../../utils/error');
const { responceObj } = require('../../utils/responce');
const { ApiKeyModel } = require('../models/apikey');

const validateApiKey = async (apiKey) => {
  //check if the API key exists in the database
  const findApiKey = await ApiKeyModel.findOne({ key: apiKey });

  if (!findApiKey) {
    return false;
  }
  //check if the API key is active
  if (!findApiKey.isActive) {
    return false;
  }
  //check if the API key has expired
  const currentDate = new Date();
  if (findApiKey.expiresAt < currentDate) {
    return false;
  }
  return true;
};



const meapikeyinfoService=async(userinfo)=>{
  const userid=userinfo.item._id;
  try {
    const findAllApiList=await ApiKeyModel.find({marchenId:userid})
      if(!findAllApiList) throw new AppError("No api keys details found")
        return responceObj({
      message:"Successfully get all api details",
      status:200,
      item:findAllApiList
      })
  } catch (error) {
    throw error
  }

}

const deleteApikeyService=async(userinfo,apikey)=>{
    const findApiwithkey=await ApiKeyModel.findByIdAndDelete(apikey)
    if(!findApiwithkey) throw  AppError("invalid api key")
    if(findApiwithkey.marchenId.toString()!==userinfo.item._id.toString()) throw  AppError("invalid api key plese provide a valid key")
      return responceObj({
          message:"Successfully deleted",
          status:200,
          item:{}
      })
}

module.exports = {
  validateApiKey,
  meapikeyinfoService,
  deleteApikeyService
};
