const Koa = require('koa');
const Router = require('koa-router');
const utils = require('sm-utils');
const koaStatic = require('koa-static');
const koaBodyParser = require('koa-bodyparser');
const SendOtp = require('sendotp');
var knex = require('knex')({
    client: 'mysql',
    connection: {
        // host: process.env.HOST || 'localhost',
        // user: process.env.MYSQL_USER || 'admin',
        // port: process.env.MYSQL_PORT || 3306,
        // password: process.env.MYSQL_PASSWORD || 'smartprix',
        // database: process.env.MYSQL_DATABASE || 'whitepanda',
        host: 'localhost',
        user: 'admin',
        password: 'smartprix',
        database: 'whitepanda',
    }
});

const app = new Koa();
const router = new Router()
const port = process.env.PORT || 8080;

app.use(koaStatic(__dirname + '/dist'));
app.use(koaBodyParser())

const msg91auth = 'xxxxxxxxxxxxxxxxx';
const otpService = new SendOtp(msg91auth);

router.get('/(.*)', async (ctx) => {
    const html = await utils.file('./dist/index.html').read();
    ctx.type = 'text/html';
    ctx.body = html;
});

function verifyOtp(phone, otp) {
    return new Promise((resolve, reject) => {
        otpService.verify(phone, otp, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    })
}

function sendOtp(phone) {
    return new Promise((resolve, reject) => {
        otpService.send(phone, 'WPANDA', (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        })
    });
}

router.post('/signup', async (ctx) => {
    const name = ctx.request.body.name.trim();
    const email = ctx.request.body.email.trim();
    const phone = ctx.request.body.phone.trim();
    const password = ctx.request.body.password;
    const otp = ctx.request.body.otp.trim();
    const exists = await knex.select().table('user').where('email', email).orWhere('phone', phone).first();
    ctx.status = 200;
    if (exists) {
        ctx.body = {
            type: 'exists',
            user: null,
        };
        return;
    }
    if (otp) {
        try {
            const data = await verifyOtp(`91${phone}`, otp);
            if (data.type === 'success' && !exists) {
                const user = await knex('user').insert({
                    name,
                    email,
                    phone,
                    password,
                });
                ctx.body = {
                    type: 'redirect',
                    user,
                };
            }
            if (data.type === 'error') {
                ctx.body = {
                    type: 'wrong',
                    user: null,
                };
            }
        }
        catch (err) {
            ctx.status = 404;
            console.log(err);
        }
        return;
    }
    try {
        const sent = await sendOtp(`91${phone}`);
        if (sent && sent.type === 'success') {
            ctx.body = {
                type: 'verify',
                user: null,
            };
            return;
        }
    }
    catch (err) {
        console.log(err);
    }
    ctx.body = {
        type: 'retry',
        user: null,
    };
    return
});

router.post('/login', async (ctx) => {
    const email = ctx.request.body.email.trim();
    const password = ctx.request.body.password.trim();
    const phone = ctx.request.body.phone.trim();
    const otp = ctx.request.body.otp.trim();
    if (email && password) {
        const user = await knex.select().from('user').where('email', email).andWhere('password', password).first();
        ctx.status = 200;
        ctx.body = {
            type: user ? 'redirect' : 'invalid',
            user,
        };
        return;
    }
    else if (phone && otp) {
        const user = await knex.select().from('user').where('phone', phone).first();
        if (user) {
            const data = await verifyOtp(`91${phone}`, otp);
            ctx.body = {
                type: data && data.type === 'success' ? 'redirect' : 'wrong',
                user,
            }
            return;
        }
        ctx.body = {
            type: 'invalid',
            user: null,
        };
    }
});

router.post('/getotp', async (ctx) => {
    const phone = ctx.request.body.phone.trim();
    if (phone) {
        const user = await knex.select().from('user').where('phone', phone).first();
        if (user) {
            const data = await sendOtp(`91${phone}`);
            if (data.type === 'success') {
                ctx.body = 'sent';
                return;
            }
            ctx.body = 'retry';
            return;
        }
        ctx.body = 'invalid';
        return;
    }
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(port);
