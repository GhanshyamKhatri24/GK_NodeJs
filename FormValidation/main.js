var express = require('express')
var app = express()
var bodyParser = require('body-parser')
const {check,validationResult} = require('express-validator/check')
const {matchedData} = require('express-validator/filter')

app.use('/abc',express.static('public'))
app.set('view engine', 'twig')
app.set('views','./public/views'); 
//app.use(bodyParser.urlencoded({extended: false}))

//var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({extended: false})

app.get('/', (req,res)=>{
    res.render('index',{title:"Login Form", message:'Enter Username and Password'})
})

app.post('/login',urlencodedParser, function(req, res){
    res.send('Welcome, '+req.body.username)
    console.log(req.body)
})

app.post('/',urlencodedParser,[
    check('username','Invalid Username, Pls enter correct EmailId').trim().isEmail(),
    check('password', 'Password length must be atleast 5 chars').trim().isLength({min:5}),
    check('cpassword').custom((value, {req}) => {
        if(value != req.body.password){
            throw new Error('Confirm password does not match with password')
        }
        return true;
    })
   

], function(req, res){
    const errors = validationResult(req)
    console.log(errors.mapped())
    console.log()
    console.log(req.body)
    if(!errors.isEmpty()){
        const user = matchedData(req)
        res.render('index',{title:"Users Details",
        error: errors.mapped(),
        user:user}) 
    }
    else{
        const user = matchedData(req)
        console.log(user)
        res.render('login',{title:"User Details",user:user})
    }       
})

app.listen(3000,()=>console.log("server running on port 3000"))