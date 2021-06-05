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