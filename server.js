const express=require('express');
const app=express();
const http=require('http').createServer(app);
const PORT=process.env.PORT || 8000

const connectDB=require('./config/db.js')
connectDB();

// Now we have to create our own api through user will post the file and will be received in the server
// We can create api by i
app.set('view engine','ejs')

// for accepting json data as by default,express doesn't accepth json data
app.use(express.json())
app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.sendFile('./index.html',{root:__dirname})
})

app.use('/api/files',require('./Routes/file.js'))
// So whenever /api/files route will be called,it would be integrated with the route in file.js file


app.use('/files',require('./Routes/show'))

app.use('/files/download',require('./Routes/download1.js'))



http.listen(PORT,()=>{
    console.log(`Listening on Port ${PORT}`)
})