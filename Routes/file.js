const bodyparser = require('body-parser');
const  router=require('express').Router()
const multer=require('multer')
// path is an in-built module of Node.Js which allows us to work with directory and file path
const path=require('path')
const  File=require('../models/file1')
const { v4: uuidV4 } = require('uuid')
const { json } = require('body-parser')
let storage=multer.diskStorage({
    // cb is callback fn cb(err,path at which we have to store the file)
    destination:(req,file,cb) =>cb(null,'Uploads/'),
    filename:(req,file,cb)=>{
        // the files received may have the same name(user is uploading the file,so two diff user can have the same file name)
        // so to create a unique name,we can do
        const uniqueName=`${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        // extname gives the extension of the file
        cb(null,uniqueName)
    }
})

// The express. Router() function is used to create a new router object.
//  This function is used when you want to create a new router object in your program to handle requests. 
// Multiple requests can be easily differentiated with the help of the Router() function in Express.

let upload=multer({
    storage,
    // fileSize should in bytes and we have set the size as 100MB
    limits:{fileSize: 1000000*500}
    // single() as we are receiving a single file and name in it should be same as name in INSOMNIA to receive the file from INSOMNIA
}).single('myFile')


router.post('/',(req,res)=>{

    // Store file

    upload(req,res,async (err)=>{

        // Validate Request
    // to handle a file,we need a library called 'multer'
        if(!req.file){
            return(json({error:'All fields are required'}))
        }

        if(err){
            return res.statusCode(500).send({error:err.message})
        }

        // Store into database
        const file=new File({
            filename:req.file.filename,
            uuid:uuidV4(),
            // req.file.path gives the path that was stored in the destination and filename joins in it to give the exact path
            path:req.file.path,
            size:req.file.size,
        })
            const response=await file.save();

            return res.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`})
            // So the link,which is sent by above json file will be of the type
            // http://localhost:8000/files/232622fvdfvfv-45565sdcefv



    })


    


    // Response -> download link
})

router.post('/send',async (req,res)=>{

    const {uuid, emailTo, emailFrom}=req.body;

    // Validate request
    if(!uuid || !emailTo || !emailFrom){

        return res.status(422).send('download',{error:'All fields are required'})
    }
    
    // Get Data From Database

    const file=await File.findOne({uuid:uuid})
    // Checking if file is already sent and if sent,we'll not send again
    if(file.sender){
        return res.status(422).send('download',{error:'Email is already sent'})
    }

    // If not already sent
    file.sender=emailFrom
    file.receiver=emailTo

    const response=await file.save();

    // Send Email

    const sendMail=require('../Services/emailService')
    sendMail({
        from:emailFrom,
        to:emailTo,
        subject:'ShareTo file sharing',
        // text will be ignored if we are passing a html file
        text:`${emailFrom} shared you a file`,
        html:require('../Services/emailTemplate')({
            emailFrom:emailFrom,
            downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size:parseInt(file.size/1000) +  'KB',
            expires:'24 hours'
        })

    })
    return res.send({success:true})


})


module.exports=router