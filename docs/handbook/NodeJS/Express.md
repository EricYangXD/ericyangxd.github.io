---
title: Express.js
author: EricYangXD
date: "2024-01-27"
---

## express 框架

### 简单用法及 API

1. 安装`express`及`nodemon`，使用 CommonJS `.mjs` 后缀。
2. 使用`express-validator`进行参数等的校验，链式 api 调用，可以校验一个参数，也可以用数组的形式同时校验多个
3. 使用 schame 统一配置校验 fields
4. 使用中间件即类似`(req, req, next)=>{...; next();}`这种，可以处理数据等。抽离业务逻辑。最后要记得`next()`，否则会 block 住。可以同时接收多个中间件，会依次执行。
5. 使用 use 注册中间件、路由等。
6. 使用路由统一管理相似业务逻辑
7. 前一个中间件修改 req 和 res 之后，后面的中间件可以接收到修改后的 req 和 res
8. 使用一个 index 集中注册路由，然后在入口文件中只需注册一次。
9. 使用`cookie-parser`解析 cookie
10. 使用`express-session`解析 session
11. 使用`passport`实现登录验证
12. 使用`multer`处理上传文件
13. 使用`cors`解决跨域问题
14. 使用`morgan`日志记录
15. 使用`dotenv`读取环境变量
16. 使用`body-parser`解析请求体
17. 使用`mongoose`操作数据库
18. 使用`mongodb`操作数据库
19. 使用`bcrypt`加密密码
20. 使用`jsonwebtoken`生成 token
21. 使用`express-rate-limit`限制请求频率
22. 使用`helmet`设置安全相关的 HTTP 头
23. 使用`compression`压缩响应体
24. 使用`connect-mongo`将 session 存储到 mongodb 中
25. 接入OAUTH2.0，使用`passport-oauth2`，`passport-google-oauth20`，`passport-facebook`等
26. 使用`jest`进行单元测试
29. 简单 demo：

```js
import express from "express";
import {query, body, validationResult, matchedData, checkSchema } from "express-validator";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import usersRouter from "./router/user.mjs";
import {userValidationSchemas} from "./validation/validationSchemas.mjs";
import {mockUsers} from "./mock/users.mjs";
import "./passport-local.mjs";
import {User} from "./mongoose/schemas/user.mjs";
import {hashPassword} from "./utils/helper.mjs";

// 注册passport策略
// passport.use(require("./local-strategy.mjs"));

const app = express();

// 27017
mongoose.connect("mongodb://localhost/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.log("Error connecting to MongoDB", err);
});


// 注册路由
app.use(express.static("public"));

// 注册中间件
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser("xxx"));

app.use(passport.initialize());
app.use(passport.session());

app.post("/api/auth", passport.authenticate("local"), (req, res) => {
  res.status(200).send(req.user);
});

app.use(session({
  secret: "xxx",
  saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
  resave: false,
  cookie: {
    maxAge: 60*60*1000
  },
  // MongoStore: MongoStore.create({
  //   mongoUrl: "mongodb://localhost/test",
  //   collectionName: "sessions"
  // })
  // 使用connect-mongo把session存储到mongodb中，这样就可以重启服务后不会丢失session
  store: MongoStore.create({
    client: mongoose.connection.getClient(),
  })
}));
// 使用use注册路由
app.use(usersRouter);
const PORT = process.env.PORT || 3000;

// 用中间件接收json格式数据，使用了中间件之后仍然可以继续处理
app.use(express.json(), (req, res, next)=>{
  // ...
  next();
}, (req, res, next)=>{
  // ...
  next();
}, ...);

app.get("/", (req, res, next) => {
  // visited = true，使用同一个sessionId
  req.session.visited = true;
  // 设置cookie，signed：加签名的
  res.cookie("Test", "test content", {maxAge: 6000, signed: false});
  res.status(200).send({ msg: "Hello world" });
});

app.post("/api/auth", (req,res)=>{
  const {
    body:{username, password}
  }=req;
  const findUser = mockerUsers.find(user=>user.username===username);
  if(!findUser||findUser.password!==password){
    return res.status(401).send({msg:"need auth"});
  }
  req.session.user = findUser;
  return res.status(200).send(findUser);
});

// 通过这个接口可以获取当前用户的session信息，即登录状态
app.get("/api/auth/status", (req, res, next) => {
  req.sessionStore.get(req.sessionID, (err, session)=>{
    console.log(session);
  });
  return req.session.user? res.status(200).send(req.session.user) : res.status(401).send({msg:"need auth"});
});

app.post("/api/cart", (req, res)=>{
  if(!req.session.user){return res.sendStatus(401);}
  const {body: item} = req;
  const {cart} = req.session;
  if(cart){
    cart.push(item);
  }else{
    req.session.cart = [item];
  }
  return res.status(201).send(item);
});

app.get("/api/cart", (req, res)=>{
  if(!req.session.user){return res.sendStatus(401);}
  const {cart} = req.session;
  if(!cart){
    return res.status(200).send([]);
  }
  return res.status(200).send(cart);
});

app.get("/api/users",
  query("name").isString().notEmpty().isLength({min: 3, max: 32}).withMessage("这里填检验失败的报错信息"),
  (req, res, next) => {
    // 打印原始cookie
    console.log(req.headers.cookie);
    // 打印session
    console.log(req.session);
    // 假设有个sessionID
    req.sessionStore.get(req.session.id, (err, sessionData) => {
      if(err){
        console.log(err);
        throw err;
      }
      console.log(sessionData);
    });
    // 打印利用中间件处理过的parsed cookie
    console.log(req.cookies);
    console.log(req.signedCookies);
    res.status(200).send({ msg: "Hello world" });
  }
);

app.get("/api/users/:id", (req, res, next) => {
  console.log(req.params); // 接收路径参数
  console.log(req.query); // 接收查询参数
  // 如果参数有误，可以直接
  // return res.sendStatus(400);
  res.status(200).send({ msg: "Hello world" });
});

// post mockdata
app.post("api/users",
  // 校验方法1
  // body("username").notEmpty().withMessage("username not empty").isLength({min: 3, max: 32}).withMessage("length should be xx")
  // .isString().withMessage("should be string"),
  // body("age").isNumber().withMessage("xxx"),// 类似field校验，可以分开也可以一起写到一个[]中
  // 校验方法2
  checkSchema(userValidationSchemas),
  (req, res) => {
    // 接收上面的校验结果
    const result = validationResult(req);
    if(!result.isEmpty()){
      return res.status(400).send({errors:result.array()});
    }
    const body = req.body;
    const data = matchedData(req);

    return res.status(200).send(data);
  }
);

// post database mongoose
app.post(
  "/api/users",
  checkSchema(userValidationSchemas),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ errors: result.array() });
    }
    const data = matchedData(req);
    // const {body} = req;
    // 加密密码
    data.password = await hashPassword(data.password);
    const user = new User(data);
    try {
      const savedData = await user.save();
      return res.status(201).send(savedData);
    } catch (err) {
      return res.status(400).send({ msg: "save failed" });
    }
  }
);

app.post("/api/auth/logout", (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  req.logout(err => {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "logout failed" });
    }
    res.status(200).send({ msg: "logout success" });
  });
});

// patch: 只更新某部分数据
// put: 更新全部数据
// delete

app.listen(PORT, () => {
  console.log(`App is running on Port ${PORT}`);
});


// validationSchemas.mjs
export const userValidationSchemas = {
  username:{
    isLength:{
      options:{
        min:5,
        max:32
      },
      errorMessage:"should be xxx"
    },
    notEmpty:true,
    isString:{
      errorMessage:"should be string"
    }
  },
  age:{},
  // ...
}

// user.mjs
import {Router} from 'express';
const router = Router();// mini app，用法和express App几乎一样

router.get("/api/user", ()=>{});
router.get("/api/user/:id", ()=>{});
router.post("/api/user", ()=>{});
router.put("/api/user/:id", ()=>{});
router.patch("/api/user/:id", ()=>{});
router.delete("/api/user/:id", ()=>{});

export default router;

// local-strategy.mjs
import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "./mock/users.mjs";
import { User } from "./mongoose/schemas/user.mjs";
import { comparePassword } from "./utils/helper.mjs";
passport.serializeUser((user, done) => {
  done(null, user.id);
});


passport.deserializeUser(async(id, done) => {
  console.log(`Inside Deserializer`);
  console.log(`Deserialize User ID: ${id}`);
  try {
    const user = await User.findById(id);
    // const user = mockUsers.find(user => user.id === id);
    if (!user) {
      throw new Error("user not found");
    }
    done(null, user);
  }catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(
  //  {
  //    usernameField: "username",
  //    passwordField: "password"
  //  },
    async (username, password, done) => {
      console.log(`username: ${username}, password: ${password}`);
      try {
        const findUser = await User.findOne({username});
        if(!findUser){
          throw new Error("user not found");
        }
        // if(findUser.password!==password){
        if(comparePassword(password, findUser.password)){
          throw new Error("password not match");
        }
        done(null, findUser);
      } catch (err) {
        done(err, null);
      }
    //  const user = mockUsers.find(user => user.username === username && user.password === password);
    //  if (!user) {
    //    return done(null, false, { message: "Incorrect username or password." });
    //  }
    //  return done(null, user);
    }
  )
);


// ./mongoose/schames/user.mjs
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username:{
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
    trim: true,
    minlength: 5,
    maxlength: 32
  },
  password: {
    type:mongoose.Schema.Types.String,
    required: true,
    trim: true,
    minlength: 8,
    maxlength: 128
  },
  age: mongoose.Schema.Types.Number,
  email: mongoose.Schema.Types.String,
  phone: mongoose.Schema.Types.String,
  address: mongoose.Schema.Types.String,
  createAt: {
    type: Date,
    default: Date.now
  }
});

export const User = mongoose.model("User", userSchema);

// ./utils/helper.mjs
import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = async password => {
  const salt = await bcrypt.genSaltSync(saltRounds);
  const hash = await bcrypt.hashSync(password, salt);
  return hash;
};

export const comparePassword = async (password, hash) => {
  const result = await bcrypt.compareSync(password, hash);
  return result;
};
```
