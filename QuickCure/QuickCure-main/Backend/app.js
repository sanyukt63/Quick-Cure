const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config();
const cookieParser = require('cookie-parser')
const connectToDb = require('./db/db')
const authRoutes = require('./routes/authRouter')
const doctorRoutes = require('./routes/doctorRouter');
const hospitalRoutes = require('./routes/hospitalRouter');
const appointmentRoutes = require('./routes/appointmentRouter');
const patientRouter = require("./routes/patientRouter");
const app = express()

app.use(cors({
  origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
  credentials: true
}));


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

connectToDb();

app.get('/',(req,res)=>{
    res.send('Hello World')
})

//app.use(userRoutes);

app.use(authRoutes);
app.use('/doctors',doctorRoutes);
app.use('/hospitals',hospitalRoutes);
app.use('/appointments',appointmentRoutes);
app.use('/patients', patientRouter);
//app.use( reviewRoutes);

module.exports = app;