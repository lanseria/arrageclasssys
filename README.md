# arrageclassSys
排课表系统

## 前提：安装篇

`cnpm install`

推荐用 `cnpm` 中国镜像安装，不懂可以百度

如果闲麻烦那就速度慢些

`npm install`

## 网络版

`npm app.js`
运行网站

## 单机版

也可以用做单机版使用

`npm run.js`

默认 6 列， 5 行， 最多一节排100个人， 可按`run.js`文件配置更改

## 提醒
生成的排课表`result.xlsx`文件在`/public/result_xlsx`文件夹下
请把所有的课表放在`/public/upload`下，以便脚本进行读取
可以反复删除`/public/upload`中的课表，自定义排课
