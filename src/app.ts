import dotenv from "dotenv"
import express from 'express';
import bodyParser from 'body-parser';


// initialize configuration
dotenv.config();

class App{
   public app: express.Application = express();
   constructor(){
      this.app;
   }
   private config(): void{
      this.app.use(bodyParser.json())
      this.app.use(bodyParser.urlencoded({extended:false}))
   }

}
export default new App().app



// const app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// const port = process.env.PORT || 8000;

// app.get('*', (req, res) => res.status(200).send({
//    message: 'Welcome to ticket-manager API.'
// }));
// app.listen(port, () => {
//    // tslint:disable-next-line:no-console
//    console.log(`Server is running on PORT ${port}`);
// });
// export default app;

