const { AppError } = require('../../utils/error');
const { verifyToken } = require('../../utils/token');
const { payService } = require('../services');

const paymentInit = async (req, res, next) => {
  try {
    const amount = req.body?.amount;
    if (!amount || amount <= 0) throw AppError('Invalid amount');
    const currentApiKey = req.currentApiKey;
    if (!currentApiKey) throw AppError('API key is required');
    const responce = await payService.paymentInit({ amount, currentApiKey });
    if (responce?.status == 200) {
      res.status(200).json(responce);
    } else {
      throw AppError('Payment initialization failed');
    }
  } catch (error) {
    next(error);
  }
};

const getPayInfowithID = async (req, res, next) => {
  try {
    const paymentToken = req.params?.paymentid;
    if (!paymentToken) throw new Error('Payment ID is required');
    const { paymentID } = verifyToken(paymentToken);
    const responce = await payService.getPayInfowithID({ paymentID });

    if(responce?.status==301){
      const resData=responce?.item
     return  res.render('error', {
        paymentId: resData?.paymentId,
        amount: resData?.amount,
        marchenName: resData?.marchenName,
        message:"Your payment is expire brother plese create new payment id"

      });
    }

    if (responce?.status == 200) {
      const resData=responce?.item
      res.render('index', {
        paymentId: resData?.paymentId,
        amount: resData?.amount,
        userId: resData?.userId,
        marchenName: resData?.marchenName,
        marchenId: resData?.marchenId,
        apikey: resData?.key,
        webhookURL: resData?.webhookURL,
        successURL: resData?.successURL,
        faildURL: resData?.faildURL
      });

    } else {
      throw new Error('Payment information retrieval failed');
    }
  } catch (error) {
    next(error);
  }
};


const confirmPayment=async(req,res,next)=>{
  try {

    const paymentId=req.body?.paymentId;
    let marchentName=req.body?.marchentName;
   marchentName= marchentName.split("-").join(" ");
   
    let amount=req.body?.amount;
    amount=Number(amount.split(" ")[0])
    const email=req.body?.email;
    const pin=req.body?.pin;
    if (!paymentId || !marchentName || !amount || !email || !pin) {
      throw new Error('All fields are required');
    }
    const response = await payService.confirmPayment({
      paymentId,
      marchentName,
      amount,
      email,
      pin
    });

    if (response?.status == 200) {
      res.status(200).json(response);
    } else {
      throw new Error('Payment confirmation failed');
    }


  } catch (error) {
    next(error)
  }
}





const paymentAction = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
const successStatus = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
const faieldStatus = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};




module.exports = {
  paymentAction,
  paymentInit,
  successStatus,
  faieldStatus,
  getPayInfowithID,
  confirmPayment
};
