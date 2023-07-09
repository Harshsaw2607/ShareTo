const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const fileSchema=new Schema({
    filename: {type:String, required:true },
    path:{type:String, required:true},
    size:{type:Number, required:true},
    uuid:{type:String, required:true},
    // senders email,it is not necessary so we made the required as false
    sender:{type:String,required:false},
    // receivers email,it is not necessary so we made the required as false
    receiver:{type:String,required:false}
},{timestamps:true})

module.exports=mongoose.model('File',fileSchema);