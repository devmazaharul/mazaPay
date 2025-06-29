const { sendTransactionEmail } = require('../../lib/mail');
const { AppError } = require('../../utils/error');
const { responceObj, responceArr } = require('../../utils/responce');
const { signToken } = require('../../utils/token');
const { AccountModel } = require('../models/account');
const { ApiKeyModel } = require('../models/apikey');
const { PaymentModel } = require('../models/payment');
const { TransactionModel } = require('../models/transaction');

const sendService = async ({ currentUsr, reciverEmail, reciveAmount }) => {
  try {
    const { _id } = currentUsr?.item;
    const verifySender = await AccountModel.findById(_id);
    if (verifySender.balance < 1) throw AppError('Insufficient balance');
        if (!verifySender.isActive)
      throw AppError('This account is not avabile for transaction');
    if (verifySender.email === reciverEmail)
      throw AppError('You can not send money to yourself');

    if (verifySender.balance < reciveAmount)
      throw AppError('Insufficient balance for this transaction');

    //check reciver email
    const verifyReciverEmail = await AccountModel.findOne({
      email: reciverEmail,
    });

    if (!verifyReciverEmail) throw AppError('Invalid reciver email');
    if (!verifyReciverEmail.isActive)
      throw AppError('This account is not avabile for transaction');

    //update sender account
    verifySender.balance -= reciveAmount;
      const updateSenderInfo = await verifySender.save();
    //update reciver account
    verifyReciverEmail.balance =  Number(verifyReciverEmail.balance) + Number(reciveAmount);
   

  await verifyReciverEmail.save();


    //create transaction
  const gentrxId=`TRX${Date.now()}${Math.floor(Math.random() * 100)}`

    const transaction = await TransactionModel.create(
      { 
        trxID:gentrxId,
        userID:_id, //sender id
        relatedUserID:verifyReciverEmail._id, //reciver id
        amount:reciveAmount,
        type:"debit"
      },
      {
        trxID:gentrxId,
        userID:verifyReciverEmail._id,  //reciver id
        relatedUserID:_id,  //sender id
        amount:reciveAmount,
        type:"credit"
      }
    );
    if (!transaction)
      throw AppError('Transaction failed, please try again later');
    
    const datetimeFormat=new Intl.DateTimeFormat("en-US",{
       dateStyle: "short",
      timeStyle: "short",
    
    })
    const finalFormat=datetimeFormat.format(transaction.updatedAt)


sendTransactionEmail({
  amount: reciveAmount,
  to: reciverEmail,
  senderName: verifySender.name,
  datetime: finalFormat,
  recivername: verifyReciverEmail.name,
  trxId: gentrxId
}).catch(console.error); 


return responceObj({
  status: 200,
  message: 'Transaction successful',
  item: {
    transactionId: gentrxId,
    amount: reciveAmount,
    reciverEmail:reciverEmail,
    reciverName: verifyReciverEmail.name,
    currentBalance: updateSenderInfo.balance,
  },
});


  } catch (error) {
    throw error;
  }

};

const getTransactionList = async ({currentUsr}) => {
  try {
    const {_id}=currentUsr?.item;
    const findTransaction=await TransactionModel.find({userID:_id}).select("-__v").sort({createdAt:-1}).populate('relatedUserID', 'name email')
    if(!findTransaction) throw AppError("No transaction found")
    return responceArr({
      status: 200,
      message: 'Transactions retrieved successfully',
      items:  findTransaction,
    });

  } catch (error) {
    throw error;
  }
};


const getTransactionDetails=async({currentUsr,trxId})=>{
  try {
    const findTransaction=await TransactionModel.findOne({trxID:trxId,userID:currentUsr.item?._id}).select("-__v").populate('relatedUserID', 'name email')
    if(!findTransaction) throw AppError("No transaction found")

      return responceObj({
        message: 'Transaction details retrieved successfully',
        status: 200,
        item: {
         ...findTransaction._doc
        },
      })

  } catch (error) {
    throw error;
  }
}


const paymentInit=async({amount,currentApiKey})=>{
  try {
    const paymentID = `PAY${Date.now()}${Math.floor(Math.random() * 100)}`;
    const findApiKey = await ApiKeyModel.findOne({key: currentApiKey});

    const createPayment = await PaymentModel.create({
      paymentId: paymentID,
      amount,
      userId:findApiKey.marchenId,
      marchenId: findApiKey._id,
    });

    const createLinkForPayment=signToken({paymentID})

    return responceObj({
      status: 200,
      message: 'Payment initialization successful',
      item: {
        paymentId: createPayment.paymentId,
        amount: createPayment.amount,
        userId: createPayment.userId,
        url: `http://localhost:7070/api/init/${createLinkForPayment}`,
  
      }
    });


  } catch (error) {
    throw error;
  }
}


const getPayInfowithID=async({paymentID})=>{
  try {
    const findPaymentInfo=await PaymentModel.findOne({paymentId:paymentID}).select("-__v").populate('marchenId', 'marcentName key marchenId').populate('userId', 'name email');
    if(!findPaymentInfo) throw AppError("No payment information found");
    
    return responceObj({
      status: 200,
      message: 'Payment information retrieved successfully',
      item: {
        paymentId: findPaymentInfo.paymentId,
        amount: findPaymentInfo.amount,
        userId: findPaymentInfo.userId,
        marchenName: findPaymentInfo.marchenId.marcentName.split(" ").join("-"),
        marchenId: findPaymentInfo.marchenId._id,
        key: findPaymentInfo.marchenId.key
      }
    });



  } catch (error) {
    throw error;
    
  }
}


const confirmPayment=async({paymentId, marchentName, amount, email, pin, currentApiKey})=>{
  try {
    if (!paymentId || !marchentName || !amount || !email || !pin) {
      throw AppError('All fields are required');
    }

    console.log(currentApiKey);

    const findApiKey = await ApiKeyModel.findOne({key: currentApiKey});
    if (!findApiKey) throw AppError('API key is required');

    const findPayment = await PaymentModel.findOne({paymentId, marchenId: findApiKey._id});
    if (!findPayment) throw AppError('Invalid payment ID or merchant ID');

  //  if (findPayment.amount !== amount) throw AppError('Amount mismatch');

    // Here you can add logic to process the payment, e.g., update the user's balance

    return responceObj({
      status: 200,
      message: 'Payment confirmed successfully',
      item: {
        paymentId: findPayment.paymentId,
        amount: findPayment.amount,
        userId: findPayment.userId,
        marchenName: marchentName
      }
    });

  } catch (error) {
    throw error;
  }     
}

module.exports = {
  sendService,
  getTransactionList,
  getTransactionDetails,
  paymentInit,
  getPayInfowithID,
  confirmPayment
};