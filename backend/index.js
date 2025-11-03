import express from 'express'
import path from 'path';
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";


import authRoutes from './routes/authRoute.js'
import categoryRoutes from './routes/categoryRoutes.js';
import connectDB from './config/db.js'
import serviceRoutes from './routes/serviceRoutes.js';
import aiRoutes from "./routes/ai.js";




// middlewares
dotenv.config()
const app = express()


const __dirname = path.resolve();

app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(cors(
    {
        origin: [
            "http://localhost:8080",
            "http://localhost:8081",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
             "https://discover-adama-city.vercel.app" 
        ],
        credentials:true
    }
))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// connect to database

connectDB()


//routes
app.use('/api/auth',authRoutes) 
app.use('/api/categories',categoryRoutes)
app.use('/api/services', serviceRoutes); 
app.use("/api/ai", aiRoutes);

const PORT=process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log("server is running on port" + ' ' + PORT);
    
})