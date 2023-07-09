const mongoose=require('mongoose')
require('dotenv').config()
function connectDB(){
    // Database Connection
    mongoose.connect(process.env.MongoDB_Connection_Url,{useNewUrlParser:true, useUnifiedTopology:true})
    const connection=mongoose.connection

    // mongoose.connect returns a promise
    connection.once('open',()=>{
        console.log('Database Connected')
    }).on('err',(err) => {
        console.log(err);
      });
}
module.exports=connectDB;