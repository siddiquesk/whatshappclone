
const {Schema, model} = require("mongoose");
const chatSchema=new Schema({
  from:{
   type:String,
   required:true,
  },
  to:{
    type:String,
    required:true,
  },
  msg:{
    type:String,
    maxLength:100,
    required:true,
  },
  date:{
    type:Date,
  },
  image:{
    type:String,
    default:"https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWFufGVufDB8fDB8fHww",
  }
});

const chat=new model("chat",chatSchema);
module.exports=chat;