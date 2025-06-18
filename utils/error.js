

const AppError=(message="Error",status=400)=>{
  return {
    message,
    status,
    hint:`Please check information properly and try again support ID ${Math.floor(Math.random()*999999)}`
  }
}

module.exports ={
  AppError
}
