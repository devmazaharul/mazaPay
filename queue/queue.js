const {Queue}=require("bullmq")

const emailQueue=new Queue("emailSend",{
  connection:{
    host:"localhost",
    port:6379
  }
})

module.exports={
  emailQueue
}