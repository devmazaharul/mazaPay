const { AppError } = require("../utils/error");

const Authorization = (roles = []) => {
  return (req, res, next) => {
    try {
      if (!req.currentUserInfo || !req.currentUserInfo.role) {
         throw AppError('Unauthorized: No user info');
     
      }
      if (!roles.includes(req.currentUserInfo.role.toLowerCase())) {
            throw AppError('Forbidden: Access denied');

      }

      next();
    } catch (error) {
      next(error);
    }
  };
};


module.exports={
  Authorization
}