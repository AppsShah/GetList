const koarouter=require("koa-router");
const koa=require("koa");
const { getlistofdata } = require("../controller/getlist");
const router=new koarouter();
const app=new koa();

app.use(router.routes()).use(router.allowedMethods());
router.get("/getlist",getlistofdata)
module.exports=app;