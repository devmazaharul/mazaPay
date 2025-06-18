const responceObj=({message="success",status=200,item={}})=>{
  return {
    message,
    status,
    item
  }
}
const responceArr=({message="success",status=200,items=[]})=>{
  return {
    message,
    status,
    items
  }
}

module.exports={
  responceObj,
  responceArr
}