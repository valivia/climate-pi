import colors from "colors";
colors.enable();

import express from "express";
import env from "dotenv";
import handlebars from "express-handlebars";
import path from "path";

import { Pool } from "mariadb";
env.config();

export default function (pool: Pool) {

    const app = express()
    app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
    app.set('view engine', 'handlebars');
    app.set("views", path.join(__dirname, "views"));

    app.use(express.static(path.join(__dirname, "public")));

    app.get('/', async function (req, res) {
        let db = await pool.getConnection();
        let results = await db.query("SELECT * FROM SensorData ORDER BY Date DESC LIMIT 400");
        db.release();

        let Temperature = [];
        let Humidity = [];
        let Minute = [];
        for (const result of results) {
            Temperature.push(result.Temperature);
            Humidity.push(result.Humidity);
            Minute.push(`"${result.Date.getHours()}:${result.Date.getMinutes()}"`)
        }

        Temperature.reverse();
        Humidity.reverse();
        Minute.reverse();

        res.render("index", { layout: false, Temperature, Humidity, Minute });
        //res.json(results);
    });

    const port = process.env.PORT;
    app.listen({ port }, () => console.log(` > Web server ready at port ${port} - ${app.get("env")}`.magenta));
}