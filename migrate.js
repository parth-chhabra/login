const knex = require('knex')({
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
    process.exit();
}

createTable();