const error500 = (res,error)=>{
    console.error(`error utils: ${error}`)
    res.setHeader('Content-Type', 'application/json')
    return res.status(500).json({ status: "error", error: `error ${error}` })
}

module.exports = error500