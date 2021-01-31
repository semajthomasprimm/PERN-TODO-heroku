const Pool = require('pg').Pool;
//require("dotenv").config({path: __dirname + "/.env"});
require("dotenv").config();

const devConfig = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const proConfig = process.env.DATABASE_URL;

if(process.env.NODE_ENV === "production")
    console.log('CONNECTED TO DB :D');

const pool = new Pool({
    connectionString: process.env.NODE_ENV === "production" ? proConfig : devConfig,
    ssl: { rejectUnauthorized: false}
});

//console.log(pool.options.connectionString);

module.exports = pool;