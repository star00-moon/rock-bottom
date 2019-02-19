const request = require('request');
const cheerio = require('cheerio');
const Q = require('q');
const fs = require('fs');

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

let htmlFile = '';
const title = `<h1 style="text-align: center;font-size: 50px;">${'第一次练习' + '参考答案'}</h1>`;
htmlFile += title;

const checkTestID = async (testID) => {
    const body = await _request(`https://tiku.yixuela.com/detail/${testID}`);
    return body.indexOf("参数错误") === -1;
};

checkTestID(2344565646).then(console.log);