const Koa = require('koa');
const Router = require('koa-router');
const utils = require('sm-utils');
const koaStatic = require('koa-static');
const koaBodyParser = require('koa-bodyparser');
const SendOtp = require('sendotp');
let connection;
try {
    connection = require('./private/connection');
}
catch {
    connection = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'admin',
        port: process.env.DB_PORT || 3306,
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB || 'whitepanda',
    };
}
let msg91auth ;
try {
    msg91auth = require('./private/msg91auth');
}
catch {
    msg91auth = process.env.MSG91_KEY || 'xxxxxxxxx';
}

const knex = require('knex')({
    client: 'mysql',
    connection,
});

async function createTable() {
    await knex.schema.raw(`
        CREATE TABLE IF NOT EXISTS user (
            id varchar(16) NOT NULL,
            name varchar(255) NOT NULL,
            email varchar(80) NOT NULL,
            phone varchar(10) NOT NULL,
            password varchar(20) NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY phone (phone),
            UNIQUE KEY email (email)
        );`
    );
}

const app = new Koa();
const router = new Router()
const port = process.env.PORT || 8080;

app.use(koaStatic(__dirname + '/dist'));
app.use(koaBodyParser())

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

async function isLoggedIn(ctx, next) {
    const userToken = ctx.request.headers.usertoken;
    if (!userToken) {
        await next();
        return;
    }
    const user = await knex.select().table('user').where('id', userToken).first();
    if (!user) {
        await next();
        return;
    }
    ctx.status = 200;
    ctx.body = {
        type: 'redirect',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
        },
    };
    return;
}

router.post('/signup', isLoggedIn, async (ctx) => {
    const name = ctx.request.body.name.trim();
    const email = ctx.request.body.email.trim();
    const phone = ctx.request.body.phone.trim();
    const password = ctx.request.body.password;
    const otp = ctx.request.body.otp && ctx.request.body.otp.trim();
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
                const user = {
                    id: Math.random().toString(32).slice(2),
                    name,
                    email,
                    phone,
                    password: Buffer.from(password).toString('base64').slice(0, 20),
                };
                await knex('user').insert(user);
                ctx.body = {
                    type: 'redirect',
                    user: {
                        id: user.id,
                        name: user.name,
                        phone: user.phone,
                        email: user.email,
                    },
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
            ctx.body = {
                type: 'retry',
                user: null,
            };
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

router.post('/login', isLoggedIn, async (ctx) => {
    const email = ctx.request.body.email && ctx.request.body.email.trim();
    const password = ctx.request.body.password && ctx.request.body.password.trim();
    const phone = ctx.request.body.phone && ctx.request.body.phone.trim();
    const otp = ctx.request.body.otp && ctx.request.body.otp.trim();
    if (email && password) {
        const pass = Buffer.from(password).toString('base64').slice(0, 20);
        const user = await knex.select().from('user').where('email', email).andWhere('password', pass).first();
        ctx.status = 200;
        ctx.body = {
            type: user ? 'redirect' : 'invalid',
            user: user ? {id: user.id, name: user.name, email: user.email, phone: user.phone} : null,
        };
        return;
    }
    else if (phone && otp) {
        const user = await knex.select().from('user').where('phone', phone).first();
        if (user) {
            const data = await verifyOtp(`91${phone}`, otp);
            ctx.body = {
                type: data && data.type === 'success' ? 'redirect' : 'wrong',
                user: data && data.type === 'success' ? {id: user.id, name: user.name, email: user.email, phone: user.phone} : null,
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
app.listen(port, async () => {
    await createTable();
    console.log('Listening on: ', port);
});
