import dotenv from "dotenv";
import "reflect-metadata";
import express from 'express';
import bodyParser from 'body-parser';
import Routes from "./routes/routes"

// initialize configuration
dotenv.config();
const port = process.env.PORT || 8000;

class App{
   public app: express.Application = express();
   private allRoutes: Routes = new Routes();
   private config(): void{
      this.app.use(bodyParser.json())
      this.app.use(bodyParser.urlencoded({extended:false}))
   }
   public constructor(){
      this.app;
      this.config();
      this.allRoutes.routes(this.app);
   }
}
new App().app.listen(port, () => {
      // tslint:disable-next-line:no-console
      console.log(`Server is running on PORT ${port}`);
   });
export default new App().app
