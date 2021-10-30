import colors from "colors";
colors.enable();

import express from "express";
import env from "dotenv";
import logger from "morgan";
//import sass from "node-sass-middleware";
import path from "path";
import sockets from "./sockets"
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import http from "http";

import { Pool } from "mariadb";
env.config();

export default function (pool: Pool) {

    const app = express()
    const server = http.createServer(app);
    const io = new Server(server);

    app.use(logger("dev"));
    app.engine("handlebars", handlebars({ layout: false, defaultLayout: undefined }));
    app.set("view engine", "handlebars");
    app.set("views", path.join(__dirname, "views"));
    /*app.use(sass({
        debug: false,
        dest: path.join(__dirname, "/public"),
        force: true,
        indentedSyntax: false,
        outputStyle: "compressed",
        src: __dirname
    }));*/


    app.use(express.static(path.join(__dirname, "public")));

    app.get('/', async function (_req, res) {
        res.render("index", { layout: false });
    });

    sockets(io, pool);

    const port = process.env.PORT;
    server.listen({ port }, () => console.log(` > Web server ready at port ${port} - ${app.get("env")}`.magenta));
}