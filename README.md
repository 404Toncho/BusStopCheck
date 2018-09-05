# BusStopCheck

使用步骤：
1. npm init
2. npm install --save xml-js
3. npm install xlsx-to-json-depfix
4. 放入sample.xlsx（注意格式）
5. node .\js\formatExecl.js
6. node .\js\compairFile.js
7. 对比结果在 .\txt\Result.txt

已知问题：<br>
1. xml文件中部分中文字符出现乱码，会提示“name变化”<br>
2. 有概率获取不到xml，会提示“核对失败”<br>
3. 站点名称和id都变化时，会判断原站点已删除，并提示该站为新增加站点<br>
