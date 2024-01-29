# 幻兽帕鲁服务器定时重启和自动重启——NodeJs版本
## 使用方法
1. 服务器安装NodeJs
   
2. 下拉代码到服务器，在终端找到代码文件地址输入 ` npm i ` 等待依赖包下载
3. 更改 **config.json** 的信息  
      **PalServerName：服务器的名称(一般不用动,保持小写)**  
      **PalServerPath：服务器的终端名称(win系统忽略此项配置)**  
      **PalServerPath：服务器的安装地址(每个path间使用两根斜线)**  

     
   `{
      "PalServerName": "palserver",
      "PalServerCMDName": "palserver-win64-test-cmd.",
      "PalServerPath": "C:\\Users\\Administrator\\Downloads\\steamcmd\\steamapps\\common\\PalServer"
    }`  
 6. 在终端输入 ` node index.js ` 启动进程
