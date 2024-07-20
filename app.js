const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jsonwebtoken = require("jsonwebtoken")
const userModel = require("./models/users")

let app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://alfiyakn:alfiyakn@cluster0.l8relji.mongodb.net/blogappdb?retryWrites=true&w=majority&appName=Cluster0")

app.post("/signup", async (req, res) => {
    let input = req.body
    let hashedPassword = bcrypt.hashSync(req.body.password, 10)
    console.log(hashedPassword)
    req.body.password = hashedPassword
    userModel.find({ email: req.body.email }).then(
        (item)=>{
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