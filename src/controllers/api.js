const { verifyToken } = require('../../utils/token');
const { payService } = require('../services');

const paymentInit = async (req, res, next) => {
  try {
    const amount = req.body?.amount;
    if (!amount || amount <= 0) throw new Error('Invalid amount');
    const currentApiKey = req.currentApiKey;
    if (!currentApiKey) throw new Error('API key is required');
    const responce = await payService.paymentInit({ amount, currentApiKey });
    if (responce?.status == 200) {
      res.status(200).json(responce);
    } else {
      throw new Error('Payment initialization failed');
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

    if (responce?.status == 200) {
      res.render('index', {
        paymentId: responce?.item?.paymentId,
        amount: responce?.item?.amount,
        userId: responce?.item?.userId,
        marchenName: responce?.item?.marchenName,
        marchenId: responce?.item?.marchenId,
        apikey: responce?.item?.key
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
    const marchentName=req.body?.marchentName;
    const amount=req.body?.amount;
    const email=req.body?.email;
    const pin=req.body?.pin;
    if (!paymentId || !marchentName || !amount || !email || !pin) {
      throw new Error('All fields are required');
    }
    const currentApiKey = req.currentApiKey;
    if (!currentApiKey) throw new Error('API key is required');
    const response = await payService.confirmPayment({
      paymentId,
      marchentName,
      amount,
      email,
      pin,
      currentApiKey
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
