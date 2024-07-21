const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jsonwebtoken = require("jsonwebtoken")
const userModel = require("./models/users")
const postModel = require("./models/posts")

let app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://alfiyakn:alfiyakn@cluster0.l8relji.mongodb.net/blogappdb?retryWrites=true&w=majority&appName=Cluster0")
//create a post
app.post("/create",async(req,res)=>{
    let input=req.body
    let token=req.headers.token
    jsonwebtoken.verify(token,"blogApp",async(error,decoded)=>{
        if(decoded && decoded.email){
         let result=new postModel(input)
         await result.save()
         res.json({"status":"success"})
        }else{
            res.json({"status":"invalid authentication"})
        }
    })
})
//view all
app.post("/viewall",(req,res)=>{
    let token=req.headers.token
    jsonwebtoken.verify(token,"blogApp",(error,decoded)=>{
        if(decoded && decoded.email){
            postModel.find().then(
                (item)=>{
                    res.json(item)
                }
            ).catch(
                (error)=>{
                    res.json({"status":"success"})
                }
            )
        }else{
            res.json({"status":"invalid authentication"})
        }
    })
})
//signin
app.post("/signin", async (req, res) => {
    let input = req.body
    let result = userModel.find({ email: req.body.email }).then(
        (item) => {
            if (item.length > 0) {
                const passwordValidator = bcrypt.compareSync(req.body.password, item[0].password)
                if (passwordValidator) {
                    jsonwebtoken.sign({ email: req.body.email }, "blogApp", { expiresIn: "1d" },
                        (error, token) => {
                            if (error) {
                                res.json({ "status": "error", "errormessage": error })
                            } else {
                                res.json({ "status": "success", "token": token, "userid": item[0]._id })
                            }
                        })
                } else {
                    res.json({ "status": "incorrect password" })
                }

            } else {
                res.json({ "status": "invalid email id" })
            }
        }
    )
})
//signup
app.post("/signup", async (req, res) => {
    let input = req.body
    let hashedPassword = bcrypt.hashSync(req.body.password, 10)
    console.log(hashedPassword)
    req.body.password = hashedPassword
    userModel.find({ email: req.body.email }).then(
        (item) => {
            if (item.length > 0) {
                res.json({ "status": "email id already existed" })
            } else {
                let result = new userModel(input)
                result.save()
                res.json({ "status": "success" })
            }
        }
    ).catch()

})

app.listen(8081, () => {
    console.log("server started")
})