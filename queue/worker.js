const {Worker}=require("bullmq");
const { sendTransactionEmail } = require("../lib/mail");

const worker=new Worker("emailSend",async(job)=>{
  const {amount,to,senderName,datetime,recivername,trxId,reson}=job.data;
await sendTransactionEmail({amount,to,senderName,datetime,recivername,trxId,reson})

},{
  connection:{
   host: process.env.REDIS_HOST || "redis",
    port: process.env.REDIS_PORT || 6379,
  }
})



worker.on("completed",(job)=>{
  console.log(`Job complete job id is ${job.id}`);
})

worker.on("failed",(err)=>{
  console.log(err);
})

worker.on("error",(err)=>{
  console.log("error", err);
})