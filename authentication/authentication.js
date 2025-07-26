const { accountService } = require('../src/services');
const { AppError } = require('../utils/error');
const { verifyToken } = require('../utils/token');

const Authentication =async (req, _res, next) => {
  try {
        const authHeader = req.cookies?.token;
    if (!authHeader) throw AppError('Invalid token');
    const isValidtoken=verifyToken(authHeader)
    if (!isValidtoken)
      throw AppError('Invalid token please provide a valid token');
    if (isValidtoken?.role !== 'USER') throw AppError('Incorrect token');
    //check user exist this token
    const chekTokenfromDb=await accountService.checkUserExist(isValidtoken)
    req.currentUserInfo=chekTokenfromDb;
    next()
  } catch (error) {
    next(error);
  }
};

module.exports = {
  Authentication,
};
