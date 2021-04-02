
### NOTEPAD
```js
1. fuzzy 模糊查询的逻辑， 抽离成 公共方法。 在role, user 等controller中复用
2. getList, create, update, remove 等几个主要方法， 抽离成公共方法。
3. controller user.js authorization 接口 生成新的token
4. controller user.js assignment 接口完善
5. controller user.js 中 authorization, assignment 改到home.js 中去

6. throw new Exception 不能 捕获message
```