var xlsxj = require("xlsx-to-json-depfix");
var fs = require("fs");

//xlsx --> .json file
//xlsx文件转json文件
xlsxj({
    input: "./xlsx/sample.xlsx",
    output: "./json/xlsx_full_Output.json"
}, function (err, result) {
    if (err) {
        console.error(err);
    } else {
        fs.readFile("./json/xlsx_full_Output.json", 'utf8', (err, data) => {
            if (err) throw err;
            var xlsxFullRaw = JSON.parse(data);
            var xlsxFull = {};
            for (var i = 0; i < xlsxFullRaw.length; i++) {
                if (xlsxFull[xlsxFullRaw[i].lineId]) {
                    xlsxFull[xlsxFullRaw[i].lineId].push(xlsxFullRaw[i]);
                } else {
                    xlsxFull[xlsxFullRaw[i].lineId] = [];
                    xlsxFull[xlsxFullRaw[i].lineId].push(xlsxFullRaw[i]);
                }
            }
            fs.writeFile("./json/xlsx_Format_Output.json",JSON.stringify(xlsxFull),(err, data)=>{
                if (err) throw err;
            });
        })
    }
});
