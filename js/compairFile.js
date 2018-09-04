let http = require("http");
let convert = require('xml-js');
let fs = require("fs");
const xlsxFull = require("../json/xlsx_Format_Output.json");
let compair = require("../js/compair_module.js");
let result = {};
function getXML(lineid) {
    return new Promise((resolve, reject) => {
        http.get("http://180.166.5.82:8004/apiKw/getLine?lineid=" + lineid, function (resp) {
            let xml = "";
            resp.on("data", function (d) {
                //接收XML数据
                xml += d;
            });
            resp.on("end", function () {
                //xml --> json
                //XML数据转json格式
                let result = convert.xml2json(xml, { compact: true, spaces: 4 });
                result = JSON.parse(result);
                //取出上行、下行数据
                let dir0 = result.lineInfoDetails.lineResults0 ? result.lineInfoDetails.lineResults0.stop : [];
                let dir1 = result.lineInfoDetails.lineResults1 ? result.lineInfoDetails.lineResults1.stop : [];
                //format json
                let objdir = {};
                let fdir0 = dir0.map((item, index) => {
                    objdir = {};
                    objdir.id = item.id._text;
                    objdir.name = item.zdmc._text;
                    objdir.index = index + 1;
                    objdir.direction = 0;
                    return objdir;
                });
                let fdir1 = dir1.map((item, index) => {
                    objdir = {};
                    objdir.id = item.id._text;
                    objdir.name = item.zdmc._text;
                    objdir.index = index + 1;
                    objdir.direction = 1;
                    return objdir;
                });
                const xlsx = xlsxFull[lineid];
                compair(xlsx, [...fdir0, ...fdir1]);
            });
        }).on('error', (e) => {
            resolve(lineid)
        });
    })
}

for (let key in xlsxFull) {
    getXML(key).then(res => {
        console.log("▇▇▇▇ 核对失败 ▇▇▇▇ ===> 线路lineId：" + res);
    })
}

