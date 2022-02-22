const { getlistwithmatch,getlistwithoutmatch } = require("../db/query")

const getlistofdata=async(ctx)=>{
    const {page,size,search}=ctx.query
    let pages=parseInt(page)
    let sizes=parseInt(size)
    // if()
    if(!pages || isNaN(pages))
        pages=1
    if(!sizes || isNaN(sizes))
        sizes=10
    const skip=(pages-1)*sizes
    if(!search)
        return ctx.body={message:await getlistwithoutmatch(sizes,skip)}
    return ctx.body={message:await getlistwithmatch(sizes,skip,search)}
    
}
module.exports={getlistofdata}