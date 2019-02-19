const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');

const MongoDB = require('mongodb').MongoClient;
const MongoURL = "mongodb://localhost:27017";

const index = require('./routes/index');
const user = require("./routes/userApi");
const service = require("./routes/service");

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'pug'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// mongodb
app.use(async (ctx, next) => {
  const db = await MongoDB.connect(MongoURL, {useNewUrlParser: true});
  const DB = db.db("rock_bottom");
  ctx.mongo = DB.collection("yi_xue_la");
  console.log("mongodb connect successful");
  ctx.userDB = await DB.createCollection("user");
  console.log("user collection crate successfully");
  await next();
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(user.routes(), user.allowedMethods());
app.use(service.routes(), service.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
