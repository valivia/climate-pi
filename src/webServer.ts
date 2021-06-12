import colors from "colors";
colors.enable();

import express from "express";
import env from "dotenv";
import handlebars from "express-handlebars";
import path from "path";
import sockets from "./sockets"
import { Server } from "socket.io";
import http from "http";

import { Pool } from "mariadb";
env.config();

function convertTZ(date: Date, tzString: string) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }));
}

export default function (pool: Pool) {

    const app = express()
    const server = http.createServer(app);
    const io = new Server(server);

    app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
    app.set('view engine', 'handlebars');
    app.set("views", path.join(__dirname, "views"));

    app.use(express.static(path.join(__dirname, "public")));

    app.get('/', async function (req, res) {
        let db = await pool.getConnection();
        let results = await db.query("SELECT * FROM SensorData ORDER BY Date DESC LIMIT 400");
        db.release();

        res.render("index", { layout: false, results });
        //res.json(results);
    });

    sockets(io, pool);

    const port = process.env.PORT;
    server.listen({ port }, () => console.log(` > Web server ready at port ${port} - ${app.get("env")}`.magenta));
}