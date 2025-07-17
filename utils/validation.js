
const regexObject={
  name: /^[a-zA-Z\s]{2,50}$/,
  email:  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  address:  /^[a-zA-Z0-9\s,.-]{5,100}$/,
  url: /^(https?:\/\/)?((localhost(:\d+)?|[\w-]+(\.[\w-]+)+))([\/\w\- .?%&=]*)?$/
}

function validateUserData({ type,item }) {
return regexObject[type].test(item)
}


function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}


module.exports = {
  validateUserData,
  isValidObjectId
};