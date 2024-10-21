const error500 = (res,error)=>{
    console.error(`error: ${error}`)
    res.setHeader('Content-type','application-json')
    return res.status(500).json({status:"error",error:"error to delete product"})
}

module.exports = error500