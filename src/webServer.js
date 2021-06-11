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
const colors_1 = __importDefault(require("colors"));
colors_1.default.enable();
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_handlebars_1 = __importDefault(require("express-handlebars"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
function default_1(pool) {
    const app = express_1.default();
    app.engine('handlebars', express_handlebars_1.default({ defaultLayout: 'main' }));
    app.set('view engine', 'handlebars');
    app.set("views", path_1.default.join(__dirname, "views"));
    app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
    app.get('/', function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield pool.getConnection();
            let results = yield db.query("SELECT * FROM SensorData ORDER BY Date DESC LIMIT 390");
            db.release();
            let Temperature = [];
            let Humidity = [];
            let Minute = [];
            for (const result of results) {
                Temperature.push(result.Temperature);
                Humidity.push(result.Humidity);
                Minute.push(`"${result.Date.getHours()}:${result.Date.getMinutes()}"`);
            }
            Temperature.reverse();
            Humidity.reverse();
            Minute.reverse();
            res.render("index", { layout: false, Temperature, Humidity, Minute });
            //res.json(results);
        });
    });
    const port = process.env.PORT;
    app.listen({ port }, () => console.log(` > Web server ready at port ${port} - ${app.get("env")}`.magenta));
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViU2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsid2ViU2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQTRCO0FBQzVCLGdCQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFaEIsc0RBQThCO0FBQzlCLG9EQUF5QjtBQUN6Qiw0RUFBNEM7QUFDNUMsZ0RBQXdCO0FBR3hCLGdCQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFYixtQkFBeUIsSUFBVTtJQUUvQixNQUFNLEdBQUcsR0FBRyxpQkFBTyxFQUFFLENBQUE7SUFDckIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsNEJBQVUsQ0FBQyxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDckMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUVoRCxHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsTUFBTSxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV4RCxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxVQUFnQixHQUFHLEVBQUUsR0FBRzs7WUFDakMsSUFBSSxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDcEMsSUFBSSxPQUFPLEdBQUcsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLHVEQUF1RCxDQUFDLENBQUM7WUFDdEYsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRWIsSUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDO1lBQ3JCLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUNsQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDaEIsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7Z0JBQzFCLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNyQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDL0IsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUE7YUFDekU7WUFFRCxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDdEIsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUVqQixHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQ3RFLG9CQUFvQjtRQUN4QixDQUFDO0tBQUEsQ0FBQyxDQUFDO0lBRUgsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFDOUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUMvRyxDQUFDO0FBakNELDRCQWlDQyJ9