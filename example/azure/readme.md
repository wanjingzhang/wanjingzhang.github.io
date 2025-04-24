pip install -r requirements.txt # 安装
uvicorn main:app --reload

uvicorn main:app --reload --log-level debug ## 运行带debug

# 占用端口 8000

PS C:\Users\CelineZ> netstat -ano | findstr :8000
  TCP    0.0.0.0:8000           0.0.0.0:0              LISTENING       23452
PS C:\Users\CelineZ> taskkill /PID 23452 /F
SUCCESS: The process with PID 23452 has been terminated.

# 压力测试

Windows 没有原生的 ab，可以：
在 WSL 中安装 Ubuntu 然后 apt install apache2-utils  

手动安装 WSL（适合不升级系统的情况）
启用 WSL 和虚拟机功能
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

完美 ✅！你已经成功启用了：

Microsoft-Windows-Subsystem-Linux
VirtualMachinePlatform

安装 WSL 2 内核更新包
<https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi>

下载 Ubuntu 离线安装包，要很久
<https://apps.microsoft.com/detail/9mttcl66cpxj?rtc=1&utm_source=chatgpt.com&hl=en-US&gl=CN>

安装 Ubuntu 20.04.6 LTS Installer.exe 之后，在开始菜单中输入
Ubuntu 20.04
在 PowerShell 中运行：
PS C:\Users\CelineZ> wsl -l -v
Installing, this may take a few minutes...
Please create a default UNIX user account. The username does not need to match your Windows username.
For more information visit: <https://aka.ms/wslusers>
Enter new UNIX username: celinez
New password:
Retype new password:
passwd: password updated successfully
Installation successful!
To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

Welcome to Ubuntu 20.04.6 LTS (GNU/Linux 4.4.0-18362-Microsoft x86_64)

* Documentation:  <https://help.ubuntu.com>
* Management:     <https://landscape.canonical.com>
* Support:        <https://ubuntu.com/advantage>

  System information as of Fri Apr 11 17:34:48 CST 2025

  System load:    0.52      Processes:              7
  Usage of /home: unknown   Users logged in:        0
  Memory usage:   74%       IPv4 address for eth2:  172.17.254.193
  Swap usage:     3%        IPv4 address for wifi0: 128.3.10.192

Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See <https://ubuntu.com/esm> or run: sudo pro status

The list of available updates is more than a week old.
To check for new updates run: sudo apt update

This message is shown once a day. To disable it please create the
/home/celinez/.hushlogin file.
celinez@SHA-WTG-U31-121:~$  

安装 压测工具
celinez@SHA-WTG-U31-121:~$ sudo apt update
celinez@SHA-WTG-U31-121:~$ sudo apt install apache2-utils -y

安装数据库软件
 pip install pyodbc
├── db/
│   ├── config.py         # 读取数据库配置（从 .env）
│   ├── connection.py     # 建立并返回连接对象
│   └── crud.py           # 封装数据库的增删改查逻辑

# 激活venv

PS C:\Users\CelineZ\OneDrive - M. Moser Associates Limited\Desktop\Work\KC\_CODE\KC\OpenAIWebapp> .\venv\Scripts\Activate.ps1
(venv) PS C:\Users\CelineZ\OneDrive - M. Moser Associates Limited\Desktop\Work\KC\_CODE\KC\OpenAIWebapp>

# 重置本地运行环境
>
>Python: Select Interpreter

# 安装

pip install -r requirements.txt

你是一个python 后端，你专门为vue3的前端制作api. 现在有一个需求，要求用户上传多个pdf或者image的发表。你把它用openai 的ocr的工具读取出来，识别类型和金额，然后返回给前端，前端通过读写excel的功能把你的数据计算汇总，然后得出一个最终的excel给前端，前端把这个文件保存，读取excel显示在页面里面，让用户确认。以但确认会计人员将可以对这部分数据进行审核。你现在要设计这些api出来，以及sql server的数据表格和字段，用户可以通过rowguid来唯一，每个用户每个月可以上传一次数据，上传的数据放在azure的storage中，数据库也是azure的数据库。

-- 1. 创建上传批次表
CREATE TABLE InvoiceBatch (
    rowguid UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id NVARCHAR(100) NOT NULL,
    year_month CHAR(7) NOT NULL, -- 格式: YYYY-MM
    upload_time DATETIME NOT NULL DEFAULT GETDATE(),
    excel_url NVARCHAR(MAX), -- 汇总Excel地址
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 状态
    confirmed BIT NOT NULL DEFAULT 0, -- 用户确认
    approved BIT NOT NULL DEFAULT 0, -- 会计审核
    note NVARCHAR(1000)
);

-- 添加约束：每个用户每月只允许一条记录
CREATE UNIQUE INDEX UX_InvoiceBatch_User_Month ON InvoiceBatch(user_id, year_month);

-- 2. 创建发票明细表
CREATE TABLE InvoiceItem (
    id INT IDENTITY(1,1) PRIMARY KEY,
    rowguid UNIQUEIDENTIFIER NOT NULL, -- 对应 InvoiceBatch
    filename NVARCHAR(255) NOT NULL,
    type NVARCHAR(50), -- 发票类型
    amount FLOAT NOT NULL,

    CONSTRAINT FK_InvoiceItem_Batch FOREIGN KEY (rowguid)
        REFERENCES InvoiceBatch(rowguid)
        ON DELETE CASCADE
);

# 运行

uvicorn main:app --host 0.0.0.0 --port 8000

有一个表Invoice表
invoiceID：主键
rowguid: 用户id
files:["唯一的filename",...]
date:年份和月份，同一个rowguid只有一条相同年份+月份的记录
excel：动态计算生成的excel文件，里面有详细金额和总金额
totalAmount：总金额
status：状态，0：未审核，1：自己已审核，2：财务已审核，3：已完成
checked: 确认人-用户自己
approved: 审核人-财务人员
remark：备注
uploadTime:上传时间

-- 1. 删除旧表（如果存在）
DROP TABLE IF EXISTS InvoiceFile;
DROP TABLE IF EXISTS Invoice;

CREATE TABLE dbo.Invoice (
    invoiceID INT IDENTITY(1,1) PRIMARY KEY,
    rowguid UNIQUEIDENTIFIER NOT NULL,
    username NVARCHAR(50) NOT NULL,
    files NVARCHAR(MAX) NOT NULL,
    date CHAR(7) NOT NULL,
    excel NVARCHAR(255) DEFAULT '',
    amount DECIMAL(18,2) DEFAULT 0.00,
    status TINYINT DEFAULT 0,
    checked NVARCHAR(50) NULL,
    approved NVARCHAR(50) NULL,
    remark NVARCHAR(255) DEFAULT '',
    uploadTime DATETIME DEFAULT GETDATE(),

    CONSTRAINT UQ_Invoice_rowguid_date UNIQUE (rowguid, date)
);

CREATE TABLE dbo.Xiaopiao (
    xiaopiaoID INT IDENTITY(1,1) PRIMARY KEY,
    rowguid UNIQUEIDENTIFIER NOT NULL,
    username NVARCHAR(50) NOT NULL,
    email NVARCHAR(100) NULL,
    files NVARCHAR(MAX) NOT NULL,
    date CHAR(7) NOT NULL,
    excel NVARCHAR(255) DEFAULT '',
    amount DECIMAL(18,2) DEFAULT 0.00,
    status TINYINT DEFAULT 0,
    checked NVARCHAR(50) NULL,
    approved NVARCHAR(50) NULL,
    remark NVARCHAR(255) DEFAULT '',
    isdelete BIT DEFAULT 0,
    uploadTime DATETIME DEFAULT GETDATE(),

    CONSTRAINT UQ_Xiaopiao_rowguid_date UNIQUE (rowguid, date)
);
