
const {validationResult,body,param} = require("express-validator")
const asyncHandler = require("express-async-handler")
const loginValidation = require("../util/loginValidation.js")
const signupHandler = require("../util/signupHandler.js")
const generateToken = require("../util/generateToken.js")



exports.login = [
    body("username","Invalid Username")
        .trim()
        .isLength({min:2})
        .withMessage("Username must be minimum 2 characters")
        .matches(/^[a-zA-Z0-9_.]*$/)
        .withMessage("Username characters must be alphanumeric or underscore or period"),

    body("password")
        .trim()
        .isLength({min:2})
        .withMessage("Password minimally 2 characters"),

    asyncHandler(async(req,res,next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).send({errors:errors.array()});
            return;
        }

        const {username,password} = req.body; //extract credentaisl 
        const user = await loginValidation(username,password); //will handle errors if unsuccessful
        const token = generateToken(user.id);
        res.status(200).json({
            token,
            username:user.username
        })


    })
];

exports.signup = [
    body("username","Invalid Username")
    .trim()
    .isLength({min:2})
    .withMessage("Username must be minimum 2 characters")
    .matches(/^[a-zA-Z0-9_.]*$/)
    .withMessage("Username characters must be alphanumeric or underscore or period"),

    body("password")
        .trim()
        .isLength({min:2})
        .withMessage("Password minimally 2 characters"),

    body("confirm_password")
        .trim()
        .custom((value,{req})=> value===req.body.password)
        .withMessage("Passwords do not match"),

    asyncHandler(async(req,res,next)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).send({errors:errors.array()});
            return;
        }

        const {username,password} = req.body;
        const user = await signupHandler(username,password);
        const token = generateToken(user.id);

        res.status(200).json({
            token,
            username:user.username
        })

    })
];