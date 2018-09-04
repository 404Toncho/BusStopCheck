var http = require("http");
var convert = require('xml-js');
var fs = require("fs");
const xlsxFull = require("../json/xlsx_Format_Output.json");
var compair = require("../js/compair.js")


let result = {};

function getXML(lineid) {
    return new Promise((resolve, reject) => {
        http.get("http://180.166.5.82:8004/apiKw/getLine?lineid=" + lineid, function (resp) {
            var xml = "";
            resp.on("data", function (d) {
                //接收XML数据
                xml += d;
            });
            resp.on("end", function () {
                //xml --> json
                //XML数据转json格式
                var result1 = convert.xml2json(xml, { compact: true, spaces: 4 });
                result1 = JSON.parse(result1);

                // console.log(result1.lineInfoDetails.lineResults0);
                //取出上行、下行数据

                var dir0 = result1.lineInfoDetails.lineResults0 ? result1.lineInfoDetails.lineResults0.stop : [];
                var dir1 = result1.lineInfoDetails.lineResults1 ? result1.lineInfoDetails.lineResults1.stop : [];
                //format json
                let objdir = {};
                var fdir0 = dir0.map((item, index) => {
                    objdir = {};
                    objdir.id = item.id._text;
                    objdir.name = item.zdmc._text;
                    objdir.index = index + 1;
                    objdir.direction = 0;

                    return objdir;
                });
                var fdir1 = dir1.map((item, index) => {
                    objdir = {};
                    objdir.id = item.id._text;
                    objdir.name = item.zdmc._text;
                    objdir.index = index + 1;
                    objdir.direction = 1;

                    return objdir;
                });

                const xlsx = xlsxFull[lineid];
                compair(xlsx, [...fdir0, ...fdir1]);
                // resolve([...fdir0, ...fdir1]);
            });
        }).on('error', (e) => {
            resolve(lineid)
        });
    })
}

for (let key in xlsxFull) {
    getXML(key).then(res => {
        console.log(res);
    })
}

