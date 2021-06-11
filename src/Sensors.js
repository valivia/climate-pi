"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const node_dht_sensor_1 = __importDefault(require("node-dht-sensor"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const env = process.env;
let conn;
let pool;
function init(dbPool) {
    return __awaiter(this, void 0, void 0, function* () {
        pool = dbPool;
        if (!(yield initDB())) {
            process.exit();
        }
        node_cron_1.default.schedule(env.INTERVAL, () => { main(conn); });
    });
}
exports.default = init;
function main(db) {
    return __awaiter(this, void 0, void 0, function* () {
        const sensors = yield getSensors();
        if (!sensors)
            return;
        console.log(`temp: ${sensors.temperature.toFixed(1)}°C, ` +
            `humidity: ${sensors.humidity.toFixed(1)}%`);
        db.query("INSERT INTO SensorData (Humidity, Temperature) VALUES(?,?)", [sensors.humidity, sensors.temperature])
            .catch((err) => __awaiter(this, void 0, void 0, function* () {
            console.log(err);
            yield initDB();
        }));
    });
}
function getSensors() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield node_dht_sensor_1.default.read(env.SENSORTYPE, env.PIN);
            return res;
        }
        catch (err) {
            console.error("Failed to read sensor data:", err);
            return false;
        }
    });
}
function initDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield pool.getConnection();
            conn = res;
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2Vuc29ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlNlbnNvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFDQSwwREFBNEI7QUFDNUIsc0VBQXFDO0FBQ3JDLG9EQUE0QjtBQUM1QixnQkFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRWhCLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFDeEIsSUFBSSxJQUFvQixDQUFDO0FBQ3pCLElBQUksSUFBVSxDQUFDO0FBRWYsU0FBOEIsSUFBSSxDQUFDLE1BQVk7O1FBQzNDLElBQUksR0FBRyxNQUFNLENBQUM7UUFDZCxJQUFJLENBQUMsQ0FBQSxNQUFNLE1BQU0sRUFBRSxDQUFBLEVBQUU7WUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUE7U0FBRTtRQUN2QyxtQkFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBa0IsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRSxDQUFDO0NBQUE7QUFKRCx1QkFJQztBQUVELFNBQWUsSUFBSSxDQUFDLEVBQWM7O1FBQzlCLE1BQU0sT0FBTyxHQUFHLE1BQU0sVUFBVSxFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDLE9BQU87WUFBRSxPQUFPO1FBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQ1AsU0FBUyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTTtZQUM3QyxhQUFhLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQzlDLENBQUM7UUFDRixFQUFFLENBQUMsS0FBSyxDQUFDLDREQUE0RCxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDMUcsS0FBSyxDQUFDLENBQU0sR0FBRyxFQUFDLEVBQUU7WUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sTUFBTSxFQUFFLENBQUM7UUFDbkIsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUNWLENBQUM7Q0FBQTtBQUVELFNBQWUsVUFBVTs7UUFDckIsSUFBSTtZQUNBLE1BQU0sR0FBRyxHQUFHLE1BQU0seUJBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkQsT0FBTyxHQUFHLENBQUM7U0FDZDtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNsRCxPQUFPLEtBQUssQ0FBQztTQUNoQjtJQUNMLENBQUM7Q0FBQTtBQUVELFNBQWUsTUFBTTs7UUFDakIsSUFBSTtZQUNBLE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3ZDLElBQUksR0FBRyxHQUFHLENBQUE7WUFDVixPQUFPLElBQUksQ0FBQztTQUNmO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDUixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2YsT0FBTyxLQUFLLENBQUM7U0FDaEI7SUFDTCxDQUFDO0NBQUEifQ==