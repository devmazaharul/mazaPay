const {Schema,model,models} =require("mongoose")

const accountSchema=new Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  address:{
    type:String,
    required:true
  },
  status:{
    type:String,
    enum:["PENDING","VERIFIED","DISABLED"],
    default:"PENDING"
  },
  pin:{
    type:Numer,
    required:true,
    min:[4,"Pin Min 4 digit"],
    max:[5,"Pin max 5 digit"],
    default:12345
  },
},{timestamps:true})


const accountModel=models.account || model("account",accountSchema)
module.exports={
  accountModel
}