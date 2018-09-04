var fs = require("fs");
let count = 0;
module.exports = function compair(xlsx, xml) {
    let idChanged = [];
    let nameChanged = [];
    let deleted = [];
    let added = [];
    let warning = [];

    xlsx.some(curItem => {
        var nameFlag = false;
        var idFlag = false;
        for (var i = 0; i < xml.length; i++) {
            var j = i;
            //判断方向
            if (curItem.direction == xml[j].direction) {
                //判断id、name是否全等，若全等跳出循环，对比下一站
                while (j < xml.length) {
                    if (curItem.id == xml[j].id && curItem.name == xml[j].name) {
                        curItem.flag = true;
                        xml[j].flag = true;
                        return false;
                    }
                    else {
                        j++;
                    }
                }
                //判断id，name 其中一项相等
                if (curItem.id == xml[i].id || curItem.name == xml[i].name) {
                    curItem.flag = true;
                    xml[i].flag = true;
                    //id== , name!=
                    if (curItem.id == xml[i].id && curItem.name != xml[i].name) {
                        nameChanged.push({
                            "excel": curItem,
                            "XML": xml[i]
                        });
                        nameFlag = true;
                    }
                    //name== , id!=
                    if (curItem.id != xml[i].id && curItem.name == xml[i].name) {
                        idChanged.push({
                            "excel": curItem,
                            "XML": xml[i]
                        });
                        idFlag = true;
                    }
                    //
                    if (idFlag && nameFlag && curItem.flag) {
                        warning.push({
                            "excel": curItem,
                            "XML": xml[i]
                        });
                    }
                }
                //end

            }

        }


    })
    //过滤出xml中未对比过的数据，即新增加
    added = xml.filter((item) => {
        return !item.flag;
    })
    //过滤出Excel中未对比过的数据，即已删除
    deleted = xlsx.filter((item) => {
        return !item.flag;
    })

    var idStr = "";
    var nameStr = "";
    var addStr = "";
    var delStr = "";
    var warStr = "";


    //id变化数据
    if (idChanged.length == 0) {
        idStr = "√√√ ID无误 \n";
    }
    else {
        idStr += "\n[" + xlsx[0].lineName + "] [" + xlsx[0].lineId + "]\n***ID变化**********************************\n";
        for (var i = 0; i < idChanged.length; i++) {
            idStr += "+【ID】+: " + idChanged[i].excel.id + " ---> " + idChanged[i].XML.id + "\n\n"
                + "*名称*: [" + idChanged[i].excel.name + "] == [" + idChanged[i].XML.name + "]\n"
                + "*站序*: " + idChanged[i].excel.index + " == " + idChanged[i].XML.index + "\n"
                + "*方向*: " + idChanged[i].excel.direction + " == " + idChanged[i].XML.direction + "\n"
                + "---------------------\n";
        }
    }
    //名称变化数据
    if (nameChanged.length == 0) {
        nameStr = "√√√ Name无误 \n";
    }
    else {
        nameStr += "\n[" + xlsx[0].lineName + "] [" + xlsx[0].lineId + "]\n***name变化*********************************\n";
        for (var i = 0; i < nameChanged.length; i++) {
            nameStr += "+【名称】+: [" + nameChanged[i].excel.name + "] ---> [" + nameChanged[i].XML.name + "]\n\n"
                + "*ID*: " + nameChanged[i].excel.id + " == " + nameChanged[i].XML.id + "\n"
                + "*站序*: " + nameChanged[i].excel.index + " == " + nameChanged[i].XML.index + "\n"
                + "*方向*: " + nameChanged[i].excel.direction + " == " + nameChanged[i].XML.direction + "\n"
                + "---------------------\n";
        }
    }
    //增加数据
    if (added.length == 0) {
        addStr = "√√√ 无增加 \n";
    }
    else {
        addStr += "\n[" + xlsx[0].lineName + "] [" + xlsx[0].lineId + "]\n+++增加++++++++++++++++++++++++++++++++++++++++++\n";
        for (var i = 0; i < added.length; i++) {
            for (var j = 0; j < xml.length; j++) {
                if (xml[j].index == added[i].index && xml[j].direction == added[i].direction) {
                    if (j == 0) {
                        addStr += "【起始站】增加：\n"
                    }
                    else {
                        addStr += "[" + xml[j - 1].index + "] 【" + xml[j - 1].name + "】 下一站增加：\n";
                    }

                }
            }
            addStr += "++ID++: " + added[i].id + "\n"
                + "++名称++: " + added[i].name + "\n"
                + "++站序++: " + added[i].index + "\n"
                + "++方向++: " + added[i].direction + "\n"
                + "---------------------\n";
        }
    }
    //删除数据
    if (deleted.length == 0) {
        delStr = "√√√ 无删除 \n";
    }
    else {
        delStr += "\n[" + xlsx[0].lineName + "] [" + xlsx[0].lineId + "]\n===删除=============================================\n";
        for (var i = 0; i < deleted.length; i++) {
            delStr += "--ID--: " + deleted[i].id + "\n"
                + "--名称--: " + deleted[i].name + "\n"
                + "--站序--: " + deleted[i].index + "\n"
                + "--方向--: " + deleted[i].direction + "\n"
                + "---------------------\n";
        }
    }

    //警告，id和name分别与不同数据对比出错，需手工核对
    if (warning.length == 0) {
        warStr = "√√√ 无警告 \n";
    }
    else {
        warStr += "\n[" + xlsx[0].lineName + "] [" + xlsx[0].lineId + "]\n▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲ 请手工核对 ▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲\n";
        for (var i = 0; i < warning.length; i++) {
            warStr += "*名称*: [" + warning[i].excel.name + "] ---> [" + warning[i].XML.name + "]\n"
                + "*ID*: " + warning[i].excel.id + " ---> " + warning[i].XML.id + "\n"
                + "*站序*: " + warning[i].excel.index + " == " + warning[i].XML.index + "\n"
                + "*方向*: " + warning[i].excel.direction + " == " + warning[i].XML.direction + "\n"
                + "---------------------\n";
        }
    }
    //拼接输出字符串
    let str = "\n###\n###\n###线路名称：--" + xlsx[0].lineName + "--\n###线路 ID ：--" + xlsx[0].lineId + "--\n" + idStr + nameStr + addStr + delStr + warStr + "▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇\n";
    outputRes(str);
}


function outputRes(str) {
    fs.appendFile("./txt/test2.txt", str, function (err) {
        if (err) {
            console.log(err);
        } else {
            // console.log("[ string ---> .txt ] ***FINISHED***")
            console.log("已对比" + (++count) + "条")
        }
    });
}