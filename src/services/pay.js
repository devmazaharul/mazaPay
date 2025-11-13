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
        const trxRes = await transactionCreate(payer, transactionReciver, amount, {
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

//transaction create
const transactionCreate = async (payer, reciver, amount, { typeTitle = 'send mooney' }) => {
    //create transaction
    const gentrxId = `TRX${Date.now()}${Math.floor(Math.random() * 100)}`;

    const transaction = await TransactionModel.create(
        {
            trxID: gentrxId,
            userID: payer._id, //sender id
            relatedUserID: reciver._id, //reciver id
            amount: amount,
            type: 'debit',
            typeTitle: typeTitle,
        },
        {
            trxID: gentrxId,
            userID: reciver._id, //reciver id
            relatedUserID: payer._id, //sender id
            amount: amount,
            type: 'credit',
            typeTitle: typeTitle,
        },
    );
    if (!transaction) throw AppError('Transaction failed, please try again later');

    const datetimeFormat = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'short',
        timeStyle: 'short',
    });
    const timestamps = transaction.updatedAt;
    const finalFormat = datetimeFormat.format(timestamps);


    // reciver mail
    sendTransactionEmail({
        amount: amount,
        to: reciver.email,
        senderName: payer.name,
        datetime: finalFormat,
        recivername: reciver.name,
        trxId: gentrxId,
        reson: typeTitle,
    }).catch((err) => {
        console.log('mail send error');
    });

    // mail to sender 
    sendTransactionEmail({
        amount: amount,
        to: payer.email,
        senderName: reciver.name,
        datetime: finalFormat,
        recivername: payer.name,
        trxId: gentrxId,
        reson: typeTitle,
    }).catch(() => {
        console.log('mail send error');
    });

    return responceObj({
        status: 200,
        message: 'Transaction successful',
        item: {
            transactionId: gentrxId,
            amount: amount,
            payerName: payer.name,
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
