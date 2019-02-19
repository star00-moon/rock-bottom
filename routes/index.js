const router = require('koa-router')();

router.prefix('/api/get');

router.get('/subject', async (ctx, next) => {
  let data = await ctx.mongo.find({}, {projection:{"subject":1, "_id":0}}).toArray();
  ctx.body = data[0];
});

router.get('/classification', async (ctx, next) => {
  const subjectName = ctx.request.query["subject"];
  console.log(subjectName);
  let data = await ctx.mongo.find({subjectname: subjectName}, {projection:{"classification":1, "_id":0}}).toArray();
  console.log(data);
  ctx.body = data[0]
});

module.exports = router;
