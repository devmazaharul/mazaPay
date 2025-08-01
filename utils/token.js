const jwt=require("jsonwebtoken")

const signToken=(payload={})=>{
  return jwt.sign(payload,process.env.SECRET_KEY)
}


const verifyToken=(token="")=>{
  return jwt.verify(token,process.env.SECRET_KEY)
}
const decodeToken=(token="")=>{
  return jwt.verify(token)
}



module.exports={
  signToken,
  verifyToken,
  decodeToken
}