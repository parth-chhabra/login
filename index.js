const fs = require('fs');
const Koa = require('koa');
const Router = require('koa-router');
const mysql = require('mysql');
const utils = require('sm-utils');
const koaStatic = require('koa-static');

const app = new Koa();
const router = new Router()
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'smartprix',
    database: 'whitepanda',
});

app.use(koaStatic(__dirname + '/dist'));

router.get('/(.*)', async (ctx) => {
    const html = await utils.file('./dist/index.html').read();
    ctx.type = 'text/html';
    ctx.body = html;
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(4000);
