const { accountService } = require('../src/services');
const { AppError } = require('../utils/error');
const { verifyToken } = require('../utils/token');

const Authentication = async (req, _res, next) => {
    try {
     

        let authHeader = req.headers?.authorization;
        if (!authHeader) throw AppError('Invalid token');
        if (!authHeader.startsWith('Bearer')) throw AppError('Invalid token format');
        authHeader = authHeader.split(' ')[1];

        const isValidtoken = verifyToken(authHeader);
        if (!isValidtoken) throw AppError('Invalid token please provide a valid token');
        if (isValidtoken?.role !== 'USER') throw AppError('Incorrect token');
        //check user exist this token
        const chekTokenfromDb = await accountService.checkUserExist(isValidtoken);
        req.currentUserInfo = chekTokenfromDb;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    Authentication,
};
