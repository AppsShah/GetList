const koarouter = require("koa-router");
const koa = require("koa");
const { getlistcontroller } = require("../controller/getlistcontroller");
const {
  gendervalidator,
  agerangevalidator,
} = require("../validator/allvalidator");
const router = new koarouter();
const app = new koa();

app.use(router.routes()).use(router.allowedMethods());
router.get("/getlist", gendervalidator, agerangevalidator, getlistcontroller);
module.exports = app;
