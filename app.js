const createError = require("http-errors")
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//my imports
const cors = require("cors")
const myError = require("./lib/myError") //globally available


// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const authRouter = require("./routes/authRoutes")
const folderRouter = require("./routes/folderRoutes")
const fileRouter = require('./routes/fileRoutes')

var app = express();

/**
 * ================     DATABASE   =====================
 */


/**
 * =================== MIDDLEWARE ========================
 */


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




/**
 * ================      ROUTES     =====================
 */

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use("/api/auth",authRouter);
app.use("/api/folders",folderRouter)
app.use('/api/files',fileRouter)


//catch 404 to send to error handler
app.use((req,res,next)=>{
    next(createError(404));
})

/**
 * ================ ERROR HANDLING =====================
 */



app.use((err,req,res,next)=>{
    console.log(`$Error: ${err.message} ${err.status||'no stauts'}`);
    console.log(err.stack);
    res.header('Content-Type','application/json');
    const status = err.status || 400; //no status
    res.status(status).json({error:err.message} ||'Something went wrong');
})

module.exports = app;
