const express = require('express')
const bodyParser=require('body-parser')
const app = express()
const db=require('./config/mongoose')
var cors = require('cors');
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var Cookies = require('cookies')
var cookieParser = require('cookie-parser')
const auth=require('./middleware/auth')
app.use(cookieParser())
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(express.json())
app.listen(8000)
app.get('/',(req,res)=>{
    res.send("HII Parush")
})
app.use('/NGO/signup',require('./routes/NGO_signup'))
app.use('/NGO/login',require('./routes/NGO_login'))
app.use('/hotel/signup',require('./routes/hotel_signup'))
app.use('/hotel/login',require('./routes/hotel_login'))
app.use('/hotel/raise',auth,require('./routes/hotel_raise'))
app.use('/hotel/distance',auth,require('./routes/hotel_distance'))
app.use('/delivery/signup',require('./routes/delivery_signup'))
app.use('/delivery/login',require('./routes/delivery_login'))
app.get('/home',auth,(req,res)=>{
  res.render('home');
});