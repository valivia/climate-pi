"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mariadb_1 = __importDefault(require("mariadb"));
const dotenv_1 = __importDefault(require("dotenv"));
const webServer_1 = __importDefault(require("./src/webServer"));
dotenv_1.default.config();
const x = process.env;
const pool = mariadb_1.default.createPool({ host: x.DB_HOST, user: x.DB_USER, password: x.DB_PASSWORD, database: x.DB_DATABASE, port: 3306 });
//sensors(pool);
webServer_1.default(pool);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLG9EQUF5QjtBQUV6QixnRUFBd0M7QUFDeEMsZ0JBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUViLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFFdEIsTUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUVuSSxnQkFBZ0I7QUFDaEIsbUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyJ9