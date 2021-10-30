import mariadb from "mariadb";
import env from "dotenv";
import sensors from "./src/Sensors";
import webServer from "./src/webServer";
env.config();

const x = process.env;

const pool = mariadb.createPool({ host: x.DB_HOST, user: x.DB_USER, password: x.DB_PASSWORD, database: x.DB_DATABASE, port: 3306 })

sensors(pool);
webServer(pool);

