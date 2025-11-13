const { apiKeyRegex } = require('../../authentication/apiAuth');
const { AppError } = require('../../utils/error');
const { validateUserData, isValidObjectId } = require('../../utils/validation');
const { accountService, apiService } = require('../services');

const createUser = async (req, res, next) => {
    try {
        const name = req.body?.name;
        const email = req.body?.email;
        const address = req.body?.address;
        const pin = req.body?.pin;
        if (!name || !email || !address || !pin)
            throw AppError('All fields are required (name, email, address,pin)', 400);
        if (!validateUserData({ item: name, type: 'name' }))
            throw AppError('Invalid name convention', 400);
        if (!validateUserData({ item: email, type: 'email' }))
            throw AppError('Invalid email convention', 400);
        if (!validateUserData({ item: address, type: 'address' }))
            throw AppError('Invalid address convention', 400);
        if (pin.length !== 5) throw AppError('Pin must be at 5 digit');

        const responce = await accountService.accountCreateService({
            name,
            email,
            address,
            pin,
        });
        if (responce?.status == 200) {
            res.status(200).json(responce);
        }
    } catch (error) {
        next(error);
    }
};

const accessUser = async (req, res, next) => {
    try {
        const email = req.body?.email;
        const pin = req.body?.pin;
        if (!email || !pin) throw AppError('Invalid email or pin');
        if (pin.length > 5 || pin.length < 4) throw AppError('Pin incorrect');
        if (!validateUserData({ item: email, type: 'email' }))
            throw AppError('Invalid email address');
        if (pin.length !== 5) throw AppError('Invalid creadentials');

        const responce = await accountService.accessAccountService({ email, pin });
        if (responce?.status == 200) {
            res.status(200).json(responce);
        }
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

const infoUser = async (req, res, next) => {
    try {
        const currentUsr = req.currentUserInfo;
        if (!userID) throw AppError('Invali user id');
        if (!isValidObjectId(userID)) throw AppError('Invalid user id');
        if ((currentUsr?.item?._id).toString() !== userID) throw AppError('Invalid user id');
        res.status(200).json(currentUsr);
    } catch (error) {
        next(error);
    }
};
const updateUser = async (req, res, next) => {
    try {
        const userID = req.params?.id;
        const currentUsr = req?.currentUserInfo;
        const newName = req.body?.name;
        const newAddress = req.body?.address;
        if (!newName && !newAddress) throw AppError('Invalid update oparation');
        if (!userID) throw AppError('Invali user id');
        if (!isValidObjectId(userID)) throw AppError('Invalid user id');
        if ((currentUsr?.item?._id).toString() !== userID) throw AppError('Invalid user id');
        const responce = await accountService.updateUserInfo({
            currentUsr,
            newName,
            newAddress,
        });
        if (responce?.status == 200) {
            res.status(200).json(responce);
        }
    } catch (error) {
        next(error);
    }
};
const changePin = async (req, res, next) => {
    try {
        const userID = req.params?.id;
        const currentUsr = req.currentUserInfo;

        if (!userID) throw AppError('Invali user id');
        if (!isValidObjectId(userID)) throw AppError('Invalid user id');
        if ((currentUsr?.item?._id).toString() !== userID) throw AppError('Invalid user id');
        //const responce=await ;
    } catch (error) {
        next(error);
    }
};
const resetPin = async (req, res, next) => {
    try {
    } catch (error) {
        next(error);
    }
};

const getnarateApiKey = async (req, res, next) => {
    try {
        const currentUser = req?.currentUserInfo;
        const marcentName = req.body?.marcentname;
        const webhookURL = req.body?.webhookurl;
        const successURL = req.body?.successurl;
        const faildURL = req.body?.faildurl;
        if (!currentUser) throw AppError('Invalid user token');

        if (!marcentName || !webhookURL || !successURL || !faildURL)
            throw AppError('All fields are required (marcentname, webhook, successurl,faildurl)');

        if (!validateUserData({ item: marcentName, type: 'name' }))
            throw AppError('Invalid marcent name convention', 400);
        if (!validateUserData({ item: webhookURL, type: 'url' }))
            throw AppError('Invalid webhook url', 400);
        if (!validateUserData({ item: successURL, type: 'url' }))
            throw AppError('Invalid success url', 400);
        if (!validateUserData({ item: faildURL, type: 'url' }))
            throw AppError('Invalid faild url', 400);
        if (marcentName.length < 3 || marcentName.length > 50)
            throw AppError('Marcent name should be between 3 to 50 characters');
        if (webhookURL.length < 5 || webhookURL.length > 100)
            throw AppError('webhook url should be between 5 to 100 characters');
        if (successURL.length < 5 || successURL.length > 100)
            throw AppError('success url should be between 5 to 100 characters');
        if (faildURL.length < 5 || faildURL.length > 100)
            throw AppError('faild url should be between 5 to 100 characters');

        const responce = await accountService.getnarateApiKeyService({
            currentUser,
            marcentName,
            webhookURL,
            successURL,
            faildURL
        });
        if (responce?.status == 200) {
            res.status(200).json(responce);
        }
    } catch (error) {
        next(error);
    }
};

const meController = async (req, res, next) => {
    try {
        const currentUser = req.currentUserInfo;
        res.status(200).json(currentUser);
    } catch (error) {
        next(error);
    }
};

const meapikeyinfocontroller = async (req, res, next) => {
    try {
        const userInfo = req.currentUserInfo;
        const response = await apiService.meapikeyinfoService(userInfo);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

const deleteApikey = async (req, res, next) => {
    try {
        const currentUser = req.currentUserInfo;
        const keyId = req.params.apikeyid;
        if (!keyId) throw AppError('Invalid api key');

        const response = await apiService.deleteApikeyService(currentUser, keyId);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createUser,
    accessUser,
    changePin,
    updateUser,
    infoUser,
    resetPin,
    getnarateApiKey,
    meController,
    logout,
    meapikeyinfocontroller,
    deleteApikey,
};
