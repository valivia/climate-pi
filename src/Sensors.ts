import { Connection, Pool, PoolConnection } from "mariadb";
import cron from "node-cron"
import sensor from "node-dht-sensor";
import dotenv from "dotenv";
import { broadcast } from "./sockets";
dotenv.config();

const env = process.env;
let conn: PoolConnection;
let pool: Pool;

interface Ires {
    humidity: number;
    temperature: number;
}

async function getReading(): Promise<Ires> {
    try {
        const reading = await sensor.read(env.SENSORTYPE, env.PIN);
        return reading;
    } catch (err) {
        throw {
            err,
            message: "Failed to read sensor data",
            type: "SENSOR_ERROR"
        };
    }
}

async function saveReading(conn: Connection, reading: Ires): Promise<Ires> {
    try {
        let queryResult = await conn.query("INSERT INTO SensorData (Humidity, Temperature) VALUES(?,?)", [reading.humidity, reading.temperature]);
        let query = await conn.query("SELECT * FROM SensorData WHERE ID = ?", queryResult.insertId);
        return query[0];
    } catch (err) {
        throw {
            err,
            message: `Failed to save reading ${JSON.stringify(reading)} to db`,
            type: "DB_ERROR"
        };
    }
}

async function initConnection(): Promise<boolean> {
    try {
        conn = await pool.getConnection();
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function main(db: Connection) {
    try {
        const reading = await getReading();
        console.log(`temp: ${reading.temperature.toFixed(1)}°C, humidity: ${reading.humidity.toFixed(1)}%`);
        const dbEntry = await saveReading(db, reading);
        broadcast("new data", dbEntry);
    } catch (err) {
        console.error(err.message, err.err);

        if (err.type === "DB_ERROR") {
            await initConnection();
        }
    }
}

export default async function init(dbPool: Pool) {
    pool = dbPool;
    if (!await initConnection()) {
        process.exit()
    }
    cron.schedule(env.INTERVAL as string, () => { main(conn); });
}
