## 数据库基本操作


- show databases;
- use xxxx;
- show tables;

#### 插入
- insert into tableName(xxxx,yyyy,zzzz) values('aaaa', 'bbbb', 'cccc');
#### 查询
- select * from tableName;
- select xxx,yyy from tableName;
- select * from tableName where xxxx='aaaa' and yyyy='bbbb'      || or
- select * from tableName where xxxx like '%aaaa%'
- select * from tableName order by id desc;
#### 更新
- update tableName set xxxx='dddd' where realname='ffff'
##### 更新若是失败
- SET SQL_SAFE_UPDATES = 0;
#### 删除
- delete from tableName where xxxx='aaaa'


#### nodejs 不能连接 mysql
- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
- 'password' = your mysql password

#### create MySQL table with Workbench
```JS
PK - Belongs to primary key
作为主键

NN - Not Null
非空

UQ - Unique index
不能重复

BIN - Is binary column
存放二进制数据的列

UN - Unsigned data type
无符号数据类型（例如-500 to 500替换成0 - 1000,需要整数形数据）

ZF - Fill up values for that column with 0’s if it is numeric
填充0位（例如指定3位小数，整数18就会变成18.000）

AI - Auto Incremental
自增长

G - Generated column
基于其他列的公式生成值的列
```