import { Connection, Pool, PoolConnection } from "mariadb";
import cron from "node-cron"
import sensor from "node-dht-sensor";
import dotenv from "dotenv";
dotenv.config();

const env = process.env;
let conn: PoolConnection;
let pool: Pool;

export default async function init(dbPool: Pool) {
    pool = dbPool;
    if (!await initDB()) { process.exit() }
    cron.schedule(env.INTERVAL as string, () => { main(conn); });
}

async function main(db: Connection) {
    const sensors = await getSensors();
    if (!sensors) return;
    console.log(
        `temp: ${sensors.temperature.toFixed(1)}°C, ` +
        `humidity: ${sensors.humidity.toFixed(1)}%`
    );
    db.query("INSERT INTO SensorData (Humidity, Temperature) VALUES(?,?)", [sensors.humidity, sensors.temperature])
        .catch(async err => {
            console.log(err);
            await initDB();
        })
}

async function getSensors(): Promise<Ires | false> {
    try {
        const res = await sensor.read(env.SENSORTYPE, env.PIN);
        return res;
    } catch (err) {
        console.error("Failed to read sensor data:", err);
        return false;
    }
}

async function initDB(): Promise<boolean> {
    try {
        const res = await pool.getConnection();
        conn = res
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

interface Ires {
    humidity: number;
    temperature: number;
}