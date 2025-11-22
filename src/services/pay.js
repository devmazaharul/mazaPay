const { AppError } = require('../../utils/error');
const { responceObj, responceArr } = require('../../utils/responce');
const { signToken } = require('../../utils/token');
const { AccountModel } = require('../models/account');
const { ApiKeyModel } = require('../models/apikey');
const { PaymentModel } = require('../models/payment');
const { TransactionModel } = require('../models/transaction');
const { sendTransactionEmail } = require("../../lib/mail");
const sendService = async ({ currentUsr, reciverEmail, reciveAmount }) => {
    try {
        const { _id } = currentUsr?.item;
        const verifySender = await AccountModel.findById(_id);
        if (verifySender.balance < 1) throw AppError('Insufficient balance');
        if (!verifySender.isActive) throw AppError('This account is not avabile for transaction');
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
        verifyReciverEmail.balance += Number(reciveAmount);

        await verifyReciverEmail.save();
        return await transactionCreate(verifySender, verifyReciverEmail, reciveAmount, {
            typeTitle: 'send money',
        });
    } catch (error) {
        throw error;
    }
};

const getTransactionList = async ({ currentUsr }) => {
    try {
        const { _id } = currentUsr?.item;
        const findTransaction = await TransactionModel.find({ userID: _id })
            .select('-__v')
            .sort({ createdAt: -1 })
            .populate('relatedUserID', 'name email');
        if (!findTransaction) throw AppError('No transaction found');
        return responceArr({
            status: 200,
            message: 'Transactions retrieved successfully',
            items: findTransaction,
        });
    } catch (error) {
        throw error;
    }
};

const getTransactionDetails = async ({ currentUsr, trxId }) => {
    try {
        const findTransaction = await TransactionModel.findOne({
            trxID: trxId,
            userID: currentUsr.item?._id,
        })
            .select('-__v')
            .populate('relatedUserID', 'name email');
        if (!findTransaction) throw AppError('No transaction found');

        return responceObj({
            message: 'Transaction details retrieved successfully',
            status: 200,
            item: {
                ...findTransaction._doc,
            },
        });
    } catch (error) {
        throw error;
    }
};

const paymentInit = async ({ amount, currentApiKey }) => {
    try {
        const paymentID = `PAY${Date.now()}${Math.floor(Math.random() * 100)}`;
        const findApiKey = await ApiKeyModel.findOne({ key: currentApiKey });

        const createPayment = await PaymentModel.create({
            paymentId: paymentID,
            amount,
            userId: findApiKey.marchenId,
            marchenId: findApiKey._id,
        });

        const createLinkForPayment = signToken({ paymentID });

        return responceObj({
            status: 200,
            message: 'Payment initialization successful',
            item: {
                paymentId: createPayment.paymentId,
                amount: createPayment.amount,
                userId: createPayment.userId,
                url: `${process.env.SERVER_URL}/api/payment/${createLinkForPayment}`,
            },
        });
    } catch (error) {
        throw error;
    }
};

const getPayInfowithID = async ({ paymentID }) => {
    try {
        const findPaymentInfo = await PaymentModel.findOne({ paymentId: paymentID })
            .select('-__v')
            .populate('marchenId', 'marcentName key marchenId webhookURL successURL faildURL')
            .populate('userId', 'name email');
        if (!findPaymentInfo) throw AppError('No payment information found');

        if (findPaymentInfo.isSuccess) {
            return responceObj({
                status: 301,
                message: 'Your payment id is expire',
                item: {
                    paymentId: findPaymentInfo.paymentId,
                    amount: findPaymentInfo.amount,
                    userId: findPaymentInfo.userId,
                    marchenName: findPaymentInfo.marchenId.marcentName.split(' ').join('-'),
                    marchenId: findPaymentInfo.marchenId._id,
                    key: findPaymentInfo.marchenId.key,
                    faildURL:findPaymentInfo.marchenId.faildURL
                },
            });
        }

        return responceObj({
            status: 200,
            message: 'Payment information retrieved successfully',
            item: {
                paymentId: findPaymentInfo.paymentId,
                amount: findPaymentInfo.amount,
                userId: findPaymentInfo.userId,
                marchenName: findPaymentInfo.marchenId.marcentName.split(' ').join('-'),
                marchenId: findPaymentInfo.marchenId._id,
                key: findPaymentInfo.marchenId.key,
                webhookURL:findPaymentInfo.marchenId.webhookURL,
                successURL:findPaymentInfo.marchenId.successURL,
                faildURL:findPaymentInfo.marchenId.faildURL
            },
        });
    } catch (error) {
        throw error;
    }
};

const confirmPayment = async ({ paymentId, marchentName, amount, email, pin }) => {
    try {
        if (!paymentId || !marchentName || !amount || !email || !pin) {
            throw AppError('All fields are required');
        }

        const findPayer = await AccountModel.findOne({ email });
        if (!findPayer) throw AppError('Invalid Account');

        if (!findPayer.status) throw AppError('Account not verified');
        const verifyPaymentID = await PaymentModel.findOne({ paymentId: paymentId })
            .populate('marchenId')
            .populate('userId');

        if (!verifyPaymentID) throw AppError('Invalid payment id');
        if (verifyPaymentID.marchenId.marcentName !== marchentName)
            throw AppError('Invalid marchent name');
        if (findPayer._id.toString() == verifyPaymentID.userId._id.toString())
            throw AppError('You can not pay your own payment id');
        if (findPayer.pin !== pin) throw AppError('Invalid pin');
        amount = verifyPaymentID.amount;
        if (findPayer.balance < amount) throw AppError('Insufficient balance for this transaction');
        if (verifyPaymentID.isSuccess) throw AppError('Payment id expire');
        if (verifyPaymentID.marchenId.marcentName !== marchentName)
            throw AppError('Invalid marcent name');
        if (verifyPaymentID.marchenId.marchenId.toString() != verifyPaymentID.userId._id.toString())
            throw AppError('Invalid marcent ID');

        //traandaction test
        const reciver = verifyPaymentID;
        const payer = findPayer;
        const transactionReciver = reciver.userId;
        payer.balance -= amount;
        transactionReciver.balance += amount;
        reciver.isSuccess = true;
   
        // create transaction
        const trxRes = await transactionCreate(paymentId,payer, transactionReciver, amount,marchentName, {
            typeTitle: `payment ${marchentName}`,
        });
        if (trxRes?.status !== 200) throw AppError('Transaction failed, please try again later');
     await Promise.all([payer.save(), reciver.save(),transactionReciver.save()]);

        const successurl = verifyPaymentID.marchenId?.successURL;
        const webhookUrl = verifyPaymentID.marchenId?.webhookURL;
        //webhook call
        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                paymentId: verifyPaymentID.paymentId,
                amount,
                marchentName,
                status: 'success',
                userName: payer.name,
            }),
        }).catch((err) => {
            console.log(err);
        });
        

        return responceObj({
            status: 200,
            message: 'Payment confirmed successfully',
            item: {
                transactionId: trxRes?.item?.transactionId,
                amount: trxRes?.item?.amount,
                payerName: payer.name,
                redirectURL: successurl,
            },
        });
    } catch (error) {
        throw error;
    }
};

// Transaction creation utility
const transactionCreate = async (paymentId,payer, receiver, amount, marchentName, { typeTitle = 'send money' } = {}) => {

  // Unique TRX ID
  const trxId = paymentId

  // DB transaction data
  const transactionsData = [
    {
      trxID: trxId,
      userID: payer._id,
      relatedUserID: receiver._id,
      amount,
      type: "debit",
      typeTitle,
    },
    {
      trxID: trxId,
      userID: receiver._id,
      relatedUserID: payer._id,
      amount,
      type: "credit",
      typeTitle,
    },
  ];

  // Save Both Transactions
  const transactions = await TransactionModel.create(transactionsData);

  if (!transactions || transactions.length < 2) {
    throw new AppError("Transaction failed.");
  }

  // formatted datetime
const formattedDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Asia/Dhaka",
}).format(new Date());
  // ===============================
  // 📩 EMAIL #1 - Receiver
  // ===============================




  try {
const senderMail = sendTransactionEmail({
  to: payer.email,
  amount,
  trxId,
  datetime: formattedDate,
  senderName: receiver.name,
  receiverName: payer.name,
  reason: typeTitle,
  isReceiver: false,
});

const reciverMail = sendTransactionEmail({
  to: receiver.email,
  amount,
  trxId,
  datetime: formattedDate,
  senderName: payer.name,
  receiverName: receiver.name,
  reason: `Receive Money from ${marchentName}`,
  isReceiver: true,
});

const results = await Promise.allSettled([senderMail, reciverMail]);

results.forEach((res, i) => {
  if (res.status === "fulfilled") {
    console.log(`Email ${i + 1} sent ✔️`);
  } else {
    console.log(`Email ${i + 1} failed ❌`, res.reason);
  }
});

    
  } catch (error) {
   console.log("Mail send error reciver") 
  }

  // Success Response
  return responceObj({
    status: 200,
    message: "Transaction successful",
    item: {
      transactionId: trxId,
      amount,
      payerName: payer.name,
      receiverName: receiver.name,
    },
  });
};




const getTransactiosServices = async () => {
    try {
        return responceArr({
            message: 'All transactions',
            status: 200,
            items: [
                {
                    name: 'maza',
                },
            ],
        });
    } catch (error) {
        throw error;
    }
};

const collectSystemLog = async () => {
    try {
        const logs = [];
    } catch (error) {
        throw error;
    }
};

module.exports = {
    sendService,
    getTransactionList,
    getTransactionDetails,
    paymentInit,
    getPayInfowithID,
    confirmPayment,
    getTransactiosServices,
};
