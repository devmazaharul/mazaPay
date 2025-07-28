const {Queue}=require("bullmq")

const emailQueue=new Queue("emailSend",{

  host: 'redis-13880.c100.us-east-1-4.ec2.redns.redis-cloud.com',
  port: 13880,
  username: 'default',
  password: '4QkYMVOGc75WYHYFGfLEIj3I2lmUIpy9',
  tls: {}, // ✅ Redis Enterprise Cloud requires TLS for secure connection
})

module.exports={
  emailQueue
}