import dotenv from 'dotenv'
dotenv.config();
import { connectDB } from './config/db.js';
import express from 'express'
import morgan from 'morgan'
import colors from 'colors';
import cors from 'cors'
import userRoute from './routes/Users.js'
import expenseRoute from './routes/Expenses.js'
import { csrfProtection } from './middleware/auth.js';
// import { errorHandler } from './middleware/error.js'; 


const app = express();

const origin =
  process.NODE_ENV === "development"
    ? "exp://127.0.0.1:19000"
    : "https://inex-tracker.herokuapp.com";

const corsOptions = {
  origin: '*',
  credentials: true,
};

//public middlewares
app.use(cors())
app.use(express.json({limit:'20mb'}))
app.use(morgan('dev'))

//routes
app.use('/api/v1/users', userRoute)
app.use('/api/v1/expenses', expenseRoute)

// app.use(errorHandler)

app.get('/', (req,res)=>{
    res.send('welcome to our backend')
})

app.get("/getcsrf", csrfProtection, function (req, res) {
    // pass the csrfToken to the view
    // res.render('send', { csrfToken: req.csrfToken() })
    res.json({ csrfToken: req.csrfToken() });
  });

const PORT = process.env.PORT || 5000

const start = async(port) => {
    try{
        const conn = await connectDB();
        app.listen(PORT, (err)=> {
            if(err){
                console.log(`${err.message}`.bgMagenta) 
                return
            }
        
            console.log(`Server running on ${PORT}`.bgYellow)
        })

        console.log(`Database connected - ${conn.connection.host}`.bgGreen)
    }catch(err){
        console.log(`${err.message}`.bgMagenta)
    }
}

start(PORT)
