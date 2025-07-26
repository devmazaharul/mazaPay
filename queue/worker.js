const {Worker}=require("bullmq");
const { sendTransactionEmail } = require("../lib/mail");

const worker=new Worker("emailSend",async(job)=>{
  const {amount,to,senderName,datetime,recivername,trxId,reson}=job.data;
await sendTransactionEmail({amount,to,senderName,datetime,recivername,trxId,reson})

},{
  connection:{
    host:"localhost",
    port:6379
  }
})



worker.on("completed",(job)=>{
  console.log(`Job complete job id is ${job.id}`);
})

worker.on("error",(err)=>{
  console.log("error", err);
})