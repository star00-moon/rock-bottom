const router = require('koa-router')();
const cheerio = require("cheerio");
const request = require("request");
const Q = require('q');

router.prefix('/api/user/get');

const _request = (url) => {
    const Deferred = Q.defer();
    request.get(url, (err, _, body) => {
        if (err) {
            Deferred.reject(err);
        } else {
            Deferred.resolve(body);
        }
    });
    return Deferred.promise;
};

const _getFromHtml = (html, selection, eq) => {
    const Deferred = Q.defer();
    const Doc = cheerio.load(html);
    Deferred.resolve(Doc(selection).eq(eq).attr("href"));
    return Deferred.promise;
};

const checkTestID = async (testID) => {
    const body = await _request(`https://tiku.yixuela.com/detail/${testID}`);
    return body.indexOf("参数错误") === -1;
};

router.get('/range', async (ctx, next) => {
    const BASE_URL = 'https://tiku.yixuela.com/' + ctx.request.query["fl"] + '/lid/';
    const result = [];
    let did = await ctx.userDB.find({ username: 'jorni' }, { projection: { "did": 1, "_id": 0 } }).toArray();
    if (!did[0]) {
        let insertResult = await ctx.userDB.insertOne({ username: 'jorni', did: [] });
        console.log("insert successfully", insertResult.result.n);
        did = []
    } else {
        did = did[0]['did'];
    }
    let classificationURl = ctx.request.query["id"];
    let count = ctx.request.query["count"];
    if (!count) count = 20;

    let startURL = BASE_URL + classificationURl;
    let nextURL = BASE_URL + (parseInt(classificationURl) + 1);

    let startBody = await _request(startURL);
    let nextBody = await _request(nextURL);

    let start = await _getFromHtml(startBody, ".view-answer > a", 0);
    let end = await _getFromHtml(nextBody, ".view-answer > a", 0);
    if (start && end) {
        start = start.split('/')[2].split('.')[0];
        end = end.split('/')[2].split('.')[0];

        let i = 0;
        let sub = end - start;
        while (i < count) {
            let randomID = Math.floor(Math.random() * parseInt(sub) + parseInt(start));
            if (did.indexOf(randomID) === -1 && await checkTestID(randomID)) {
                result.push(randomID);
                i++;
            }
        }
        let updateResult = await ctx.userDB.updateOne({ username: 'jorni' }, { $set: { did: [...result, ...did] } });
        ctx.body = result;
    } else {
        ctx.body = {ok: false, why: '没有找到该分类下的题目'}
    }
});

module.exports = router;
