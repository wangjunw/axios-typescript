# axios-typescript

学习使用 typescript 实现 axios

#### 编译打包并生成 docs

```
npm run build
```

#### 发布
首先要有自己npm账号，然后在终端登陆后才可以发布
```
npm login
npm publish
```

遇到报错`npm ERR! 403 403 Forbidden - PUT https://registry.npmjs.org/axios-typescript-jun - you must verify your email before publishing a new package: https://www.npmjs.com/email-edit`是因为注册npm账号的时候没有在邮箱中点击验证链接。

#### 打包并发布脚本执行
执行`npm run pub`，会先执行`npm run prepub`