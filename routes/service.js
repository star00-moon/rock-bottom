const router = require('koa-router')();
const request = require('request');
const cheerio = require('cheerio');
const Q = require('q');
const pdf = require('html-pdf');
let OSS = require('ali-oss');
const crypto = require('crypto');

const md5 = (data) => {
    data += new Date().getTime();
    let hash = crypto.createHash('md5');
    return hash.update(data).digest('base64');
};

let ossClient = new OSS({
    region: 'oss-cn-shanghai',
    accessKeyId: 'LTAI0coThycISSwK',
    accessKeySecret: 'bP4RNVylz76510STEfSzANTLzOabn1',
    bucket: 'rock-bottom',
});

const pdfOptions = { format: 'A4' };

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
    Deferred.resolve(Doc(selection).eq(eq).html());
    return Deferred.promise;
};

const _toPDF = (html, option) => {
    const Deferred = Q.defer();

    pdf.create(html, option).toBuffer( (err, buffer) => {
        if (err) {
            Deferred.reject(err);
        } else {
            Deferred.resolve(buffer);
        }
    });

    return Deferred.promise;
};

router.prefix('/service/detail');

const getDetail = async (header, testIDs) => {
    let htmlFile = '';
    const title = `<h1 style="text-align: center;font-size: 50px;">${header}</h1>`;
    htmlFile += title;

    let ta_htmlFile = '';
    const ta_title = `<h1 style="text-align: center;font-size: 50px;">${header + '解析与考点'}</h1>`;
    ta_htmlFile += ta_title;

    let am_htmlFile = '';
    const am_title = `<h1 style="text-align: center;font-size: 50px;">${header + '参考答案'}</h1>`;
    am_htmlFile += am_title;

    for (let i = 0; i < testIDs.length; i++) {
        const body = await _request(`https://tiku.yixuela.com/detail/${testIDs[i]}.html`);
        const detail = await _getFromHtml(body, '.question', 0);
        const answer = await _getFromHtml(body, '.question', 1);
        const info = await _getFromHtml(body, '.question', 2);
        const other = await _getFromHtml(body, '.question', 3);
        htmlFile += `<h1>${i + 1}<p style="color:#cac3c3e8;"> | ${testIDs[i]}</p></h1>` + detail;
        const rowCount = answer.split('<br>');
        if (rowCount.length > 1) {
            htmlFile += rowCount.map(_ => "<br />").join('');
        } else {
            htmlFile += '<br />';
        }
        ta_htmlFile += `<h1>${i + 1}解析<p style="color:#cac3c3e8;"> | ${testIDs[i]}</p></h1>` + info;
        ta_htmlFile += `<h1>${i + 1}考点</h1>` + other + `<hr />`;
        am_htmlFile += `<h1>${i + 1}<p style="color:#cac3c3e8;"> | ${testIDs[i]}</p></h1>` + answer;
        if (i !== testIDs.length - 1) {
            htmlFile += '<hr />';
        } else {
            // 把密码起名方法改回来
            // let fileNameDo = md5(parseInt(Math.random() * 3173) + "wyj").replace('/', '@');
            // let fileNameTa = md5(parseInt(Math.random() * 2220) + "wyj").replace('/', '@');
            // let fileNameAm = md5(parseInt(Math.random() * 1250) + "wyj").replace('/', '@');
            let fileNameDo = Math.random() * 3173 + "wyj";
            let fileNameTa = Math.random() * 2220 + "wyj";
            let fileNameAm = Math.random() * 1250 + "wyj";
            console.log("###################");
            console.log(fileNameDo + '.do');
            console.log(fileNameTa + '.ta');
            console.log(fileNameAm + '.am');
            console.log("###################");
            // let pdfBufferDo = await _toPDF(htmlFile, pdfOptions);
            // let pdfBufferTa = await _toPDF(ta_htmlFile, pdfOptions);
            // let pdfBufferAm = await _toPDF(am_htmlFile, pdfOptions);
            await ossClient.put(`${fileNameDo}.do.html`, Buffer.from(htmlFile));
            await ossClient.put(`${fileNameTa}.ta.html`, Buffer.from(ta_htmlFile));
            await ossClient.put(`${fileNameAm}.am.html`, Buffer.from(am_htmlFile));
            return {do: fileNameDo + '.do', ta: fileNameTa + '.ta', an: fileNameAm + '.am'};
        }
    }
};

router.get('/get', async (ctx, next) => {
    const testIDs = ctx.request.query["id"].split(',');
    const header = ctx.request.query["title"];
    const content = await getDetail(header, testIDs);
    ctx.body = content;
});

router.get('/pdf', async (ctx, next) => {
    const baseUrl = "https://rock-bottom.oss-cn-shanghai.aliyuncs.com/"
    const objectName = ctx.request.query["name"];
    let body = await _request(baseUrl + ossClient.getObjectUrl(objectName).split('.com/')[1]);
    console.log(baseUrl + ossClient.getObjectUrl(objectName).split('.com/')[1])
    ctx.body = body; // TODO: 用流式优化
});

module.exports = router;
