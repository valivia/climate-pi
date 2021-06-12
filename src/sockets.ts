import { Server } from "socket.io";
import { Pool } from "mariadb";

let io: Server;
export default function (ioServer: Server, pool: Pool) {
    io = ioServer
    io.on('connection', async (socket) => {
        console.log('a user connected');

        const conn = await pool.getConnection()
        const data = await conn.query("SELECT `Date`, `Temperature`, `Humidity` FROM SensorData ORDER BY Date DESC LIMIT 60");
        conn.release();
        data.reverse();

        io.to(socket.id).emit("init", data);

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}

export function broadcast(input: object[]) {
    io.emit('New Data', input);
}