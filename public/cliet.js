// const { request } = require("http");

// const { response } = require("express");

const dropZone=document.querySelector('.drop-zone')

const fileInput=document.querySelector('#fileInput');
const browseBtn=document.querySelector('.browseBtn')
const fileURLInput=document.querySelector('#fileURL')
const bgProgress=document.querySelector('.bg-progress')
const progressBar=document.querySelector('.progress-bar')
const progressContainer=document.querySelector('.progress-container')
const percentVal=document.querySelector('#percent')
const sharingContainer=document.querySelector('.sharing-container')
const emailForm=document.querySelector('#email-form')
const copyBtn=document.querySelector('#copyBtn')
const toast=document.querySelector('.toast')
const body=document.querySelector('#body')

const Browse=document.getElementsByClassName('.browseBtn')

const maxAllowedSize=100*1024*1024

const host="http://localhost:8000/"
const uploadUrl=`${host}api/files`
const emailURL=`${host}api/files/send`

function resetSize(){
    fileInput.value=""
}

dropZone.addEventListener('dragover',(event)=>{
    // dragover event has some default values i.e whenver something is dropped over it will be downloaded
    // so to avoid this we have to do preventDefault
    event.preventDefault()
    // event.dataTransfer.effectAllowed = "all"; event.dataTransfer.dropEffect = "move"
    dropZone.classList.add('dragged');
})

dropZone.addEventListener('dragleave',()=>{
    dropZone.classList.remove('dragged')
})

dropZone.addEventListener('drop',(event)=>{
    // drop event has some default values i.e whenver something is dropped over it will be downloaded
    // so to avoid this we have to do preventDefault
    event.preventDefault()
    // event.dataTransfer.effectAllowed = "all"; event.dataTransfer.dropEffect = "move"
    // we can check different options of the drop event by console.log(event) 
    dropZone.classList.remove('dragged')
    console.log(event)
    const files=event.dataTransfer.files
    console.log(files);
    console.log(event.dataTransfer.files.length)
    if(files.length){
        // fileInput.files implies files object of input file tag which is in html
        fileInput.files=files
        uploadFile();
    }

})

fileInput.addEventListener('change',()=>{
    uploadFile();
});

browseBtn.addEventListener('click',()=>{
    fileInput.click();
})

copyBtn.addEventListener('click',()=>{
    fileURLInput.select()
    document.execCommand("copy")
    showToast("Copied To Clipboard")
})

function handleWindowResize(){
    if (window.matchMedia("(max-width: 900px)").matches) {
        body.style.overflow="auto"
        
    } 

    else{
        body.style.overflow="hidden"
    }
}

const uploadFile = () => {

    


    if (window.matchMedia("(max-width: 900px)").matches) {
        body.style.overflow="auto"
        
    } 
    window.addEventListener('resize',()=>{
        handleWindowResize();
    })
    
    // else{
    //     body.display.overflow="hidden"
    // }
    if(fileInput.files.length>2){
        resetSize()
        showToast('Only 2 files can be uploaded')
        return
    }

    const file=fileInput.files[0];
    if(file.size>maxAllowedSize){
        showToast('You can only upload upto 100MB')
        resetSize()
        return
    }

    progressContainer.style.display="block"
    console.log(`Take my file${file}`)
    const formData=new FormData();
    formData.append("myFile",file)
    const request=new XMLHttpRequest()
    request.onreadystatechange= ()=>{
        if(request.readyState===XMLHttpRequest.DONE){
            console.log(request.response)
            showLink(JSON.parse(request.response))
        }
    }

    // progress,i.e how much a file is uploaded
    request.upload.onprogress=updateProgress

    request.upload.onerror=()=>{
        resetSize()
        showToast(`Erroe in Upload ${request.statusText}`)
    }

    request.open('POST',uploadUrl);
    request.send(formData);

    Browse.setAttribute("disabled","true")

} 

updateProgress=(e)=>{
    const percent=Math.round((e.loaded/e.total)*100)
    console.log(percent)
    bgProgress.style.width=`${percent}%`
    percentVal.innerText=percent
    progressBar.style.transform=`scaleX(${percent/100})`
    
}

// if we will receive the parameter as showlink=(res)=>{} we'll get the while json object and then we have to extract the link as
// res.file,but we can directly extract the file by destructuring i.e receiving as showlink=({file})=>{} 
const showLink=({file})=>{
    resetSize()
    emailForm[0].value=""
    emailForm[1].value=""
    console.log(file)
    progressContainer.style.display="none"
    sharingContainer.style.display="block"
    fileURLInput.value=file

}

emailForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    const url=fileURLInput.value;
    const formData={

        // split("/") will split the string into array ('/') is a delimiter,.splice(-1,1),-1 implies we are accessing the last element
        //  immplies we only need that element so -1 selects last element and 1 defines that we only need that element
        // this will give the array of one element so to access that element we did [0]
        uuid:url.split("/").splice(-1,1)[0],
        emailTo:emailForm.elements['to-email'].value,
        emailFrom:emailForm.elements['from-email'].value
    }
    console.table(formData)

    fetch(emailURL, {
        method:"POST",
        headers:{
            "Content-type":"application/json",
        },

        body:JSON.stringify(formData)
    })
    .then((res)=> res.json())
    .then(data => {
        if(data.success){
            sharingContainer.style.display="none"
            showToast("Email sent")
        }
    })
})

let toastTimer;
const showToast=(msg)=>{
    toast.innerText=msg
    toast.style.transform="translate(-50%,0px)"
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>{
        toast.style.transform="translate(-50%,105px)"
    },2000)
}
