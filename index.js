const Koa = require('koa');
const Router = require('koa-router');
const utils = require('sm-utils');
const koaStatic = require('koa-static');
const koaBodyParser = require('koa-bodyparser');
const SendOtp = require('sendotp');
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.HOST || 'localhost',
        user: process.env.MYSQL_USER || 'admin',
        port: process.env.MYSQL_PORT || 3306,
        password: process.env.MYSQL_PASSWORD || 'smartprix',
        database: process.env.MYSQL_DATABASE || 'whitepanda',
        // host: 'localhost',
        // user: 'admin',
        // password: 'smartprix',
        // database: 'whitepanda',
    }
});

const app = new Koa();
const router = new Router()
const port = process.env.PORT || 3000;

app.use(koaStatic(__dirname + '/dist'));
app.use(koaBodyParser())

const msg91auth = 'xxxxxxxxxxxxxxxxxx';

router.get('/(.*)', async (ctx) => {
    const html = await utils.file('./dist/index.html').read();
    ctx.type = 'text/html';
    ctx.body = html;
});

router.post('/signup', async (ctx) => {
    const name = ctx.request.body.name;
    const email = ctx.request.body.email;
    const phone = ctx.request.body.phone;
    const password = ctx.request.body.password;
    const exists = await knex.select().table('user').where('email', email).orWhere('phone', phone);
    ctx.status = 200;
    if (exists && exists.length) {
        ctx.body = 'exists';
        return;
    }
    ctx.body = 'verify';
    // const sendOtp = new SendOtp(msg91auth);
    // sendOtp.send('919013682464', 'QWERTY', (err, data) => {
    //     console.log(err, data);
    // });
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(port);
