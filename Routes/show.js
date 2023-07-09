const router=require('express').Router()
const File=require('../models/file1')



// /: colon denotes that the url is dynamic
router.get('/:uuid',async (req,res)=>{
    try{
        // req.params gives all the parameter that in get()
        // so below we are checking that whether uuid in mongoDb is matching with the uuid in params or not
        const file=await File.findOne({uuid:req.params.uuid})
        if(!file){
           return  res.render('download',{error:'Link has been expired'});
        }
        return res.render('download',{
            uuid:file.uuid,
            fileName:file.filename,
            fileSize:file.size,
            download:`${process.env.APP_BASE_URL}/files/download/${file.uuid}`

        })
    } catch(err){
        return  res.render('download',{error:'Something went wrong'});
    }
})


module.exports=router