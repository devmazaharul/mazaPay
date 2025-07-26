const AppConfigaration = require('../../constant/AppConfigaration');
const { AppError } = require('../../utils/error');
const { payService } = require('../services');
const { getTransactiosServices } = require('../services/pay');

const senMoney = async (req, res, next) => {
  try {
    const reciverEmail = req.body?.email;
    const reciveAmount = req.body?.amount;

    if (!reciverEmail || !reciveAmount)
      throw AppError('Invalid reciver email or amount');
    if (
      !reciveAmount ||
      reciveAmount < AppConfigaration.MINIMUM_TRANSACTION_AMOUNT
    )
      throw AppError(
        'Invalid amount min ' + AppConfigaration.MINIMUM_TRANSACTION_AMOUNT
      );
    const currentUsr = req?.currentUserInfo;

    const responce = await payService.sendService({
      currentUsr,
      reciverEmail,
      reciveAmount,
    });
    if (responce?.status) {
      res.status(200).json(responce);
    }
  } catch (error) {
    next(error);
  }
};
const paymentMoney = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
const detailsTransaction = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
const cashoutMoney = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const transaction = async (req, res, next) => {
  try {
    const currentUsr = req?.currentUserInfo;
    if (!currentUsr) throw AppError('Invalid user');
    const responce = await payService.getTransactionList({ currentUsr });

    if (responce?.status == 200) {
      res.status(200).json(responce);
    }
  } catch (error) {
    next(error);
  }
};

const singletransaction = async (req, res, next) => {
  try {
    const currentUsr = req?.currentUserInfo;
    const trxId = req.params?.trxId;
    console.log(trxId);
    if (!trxId) throw AppError('Invalid transaction id');
    if (!currentUsr) throw AppError('Invalid user token');
    const responce = await payService.getTransactionDetails({
      currentUsr,
      trxId,
    });
    if (responce?.status == 200) {
      res.status(200).json(responce);
    }
  } catch (error) {
    next(error);
  }
};



const getTransactions=async(req,res,next)=>{
  try {
    
    const responce=await getTransactiosServices()
    if(responce.status==200){
      res.status(200).json(responce)
    }
    
  } catch (error) {
     next(error);
  }
}

module.exports = {
  senMoney,
  cashoutMoney,
  paymentMoney,
  detailsTransaction,
  transaction,
  singletransaction,
  getTransactions
};
