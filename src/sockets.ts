import { Server } from "socket.io";
import { Pool } from "mariadb";

let io: Server;
let pool: Pool;
export default function (ioServer: Server, db: Pool) {
    io = ioServer
    pool = db;
    io.on('connection', async (socket) => {
        console.log('a user connected');

        const conn = await pool.getConnection()
        const data = await conn.query("SELECT `Date`, `Temperature`, `Humidity` FROM SensorData ORDER BY Date DESC LIMIT 1440");
        conn.release();
        data.reverse();

        io.to(socket.id).emit("init", data);
        io.to(socket.id).emit("average", await average());

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}

export function broadcast(name: string, input: object) {
    io.emit(name, input);
}

export async function average() {
    const query = 'select DAY(`Date`) as "day", TRUNCATE(avg(Temperature), 2) as "temp" from SensorData group by DAY(`Date`) limit 3;'
    const conn = await pool.getConnection()
    const data = await conn.query(query);
    conn.release();

    return data;
}