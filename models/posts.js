const mongoose = require("mongoose")

const  postSchema=mongoose.Schema(
    {
userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users"
},
message:String,
postedDate:{type:Date,
    default:Date.now
}
}
)

var postModel=mongoose.model("post",postSchema)
module.exports=postModel