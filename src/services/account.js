const { generateApiKey } = require('../../utils/apiKeygen');
const { AppError } = require('../../utils/error');
const { responceObj } = require('../../utils/responce');
const { signToken } = require('../../utils/token');
const { AccountModel } = require('../models/account');
const { ApiKeyModel } = require('../models/apikey');

const accountCreateService = async ({ name, email, address, pin }) => {
  try {
    const findUser = await AccountModel.findOne({ email });
    if (findUser) throw AppError('User already exist');

    const newAccount = new AccountModel({
      name,
      email,
      address,
      pin,
      balance: 500,
    });
    await newAccount.save();

    return responceObj({
      message: 'Successfully account created',
      status: 200,
      item: {
        ...newAccount._doc,
        pin: '',
      },
    });
  } catch (error) {
    throw error;
  }
};

const accessAccountService = async ({ email, pin }) => {
  try {
    const findUser = await AccountModel.findOne({ email });
    if (!findUser) throw AppError('Invalid user please try again');
    if (!findUser?.isActive) throw AppError('Account not active');
    if (findUser.pin !== pin) throw AppError('Invalid Pin');
    const genaratePalylaodForToken = {
      id: findUser._id,
      email: findUser.email,
      role: findUser.role,
    };

    const tokenGen = signToken(genaratePalylaodForToken);
    return responceObj({
      message: 'Successfully access',
      status: 200,
      item: {
        ...findUser._doc,
        pin: '',
        token: tokenGen,
      },
    });
  } catch (error) {
    throw error;
  }
};

const getsingleUserInfoService = async ({ userid }) => {
  try {
    const findUser = await AccountModel.findById(userid);
    if (!findUser) throw AppError('Invalid user id');
    //if match user id and token id is same then access----
  } catch (error) {
    throw error;
  }
};

const checkUserExist = async (token) => {
  try {
    const tokenVerify = await AccountModel.findById(token?.id);
    if (!tokenVerify) throw AppError('Invalid token');
    if (tokenVerify?.email !== token?.email) throw AppError('Invalid token');
    return responceObj({
      message: 'successfully validated token',
      status: 200,
      item: {
        ...tokenVerify._doc,
        pin: '',
      },
    });
  } catch (error) {
    throw error;
  }
};

const updateUserInfo = async ({ currentUsr, newName, newAddress }) => {
  try {
    const findUser = await AccountModel.findById(currentUsr?.item?._id);
    findUser.name = newName || findUser.name;
    findUser.address = newAddress || findUser.address;

    await findUser.save();
    return responceObj({
      message: 'successfully updated',
      status: 200,
      item: {
        ...findUser._doc,
        pin: '',
      },
    });
  } catch (error) {
    throw error;
  }
};

const getnarateApiKeyService = async ({
  currentUser,
  marcentName,
  callbackURL,
  websiteURL,
}) => {
  try {
    const { _id } = currentUser?.item;
    const findApiLen = await AccountModel.findById(_id);
    if (!findApiLen.isActive) throw AppError('Account not active');
    if (findApiLen.apiKeyLimit == 0)
      throw AppError('You can not generate more than 3 API keys');
    const findApiKey = await ApiKeyModel.findOne({
      marchenId: _id,
      marcentName,
    });
    if (findApiKey)
      throw AppError('You already generated API key for this marcent');

    const newApiKey = new ApiKeyModel({
      marchenId: _id,
      marcentName,
      key: generateApiKey(),
      callbackURL,
      websiteURL,
    });
    findApiLen.apiKeyLimit = Math.max(findApiLen.apiKeyLimit - 1, 0);
    await newApiKey.save();
    await findApiLen.save();

    return responceObj({
      message: 'Success fully generated API key',
      status: 200,
      item: {
        ...newApiKey._doc,
        expiresAt: new Date(newApiKey.expiresAt).toISOString(),
      },
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  accountCreateService,
  accessAccountService,
  getsingleUserInfoService,
  checkUserExist,
  updateUserInfo,
  getnarateApiKeyService,
};
