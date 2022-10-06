// const electron = require('electron');
// const {ipcRenderer} = electron;

// Setting up import variables
const electron = require('electron');
const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require('path');
const {ipcRenderer} = electron;
// Setting up global variables
var setting = "lowest";
var videoformat = "mp4";
var filename = "video";
var filePath = path.resolve(__dirname)
// Setting up DOM objects
var downloadBtn = document.querySelector('#downloadbtn');
var savetag = document.querySelector('.save-tag');
savetag.innerHTML = filePath.slice(0,50)+"...";
var fnameinput = document.querySelector('#nameinput')

document.querySelector("#radio1").addEventListener('click', () =>{
    setting = "highest";
    videoformat = 'mp4';
})
document.querySelector("#radio2").addEventListener('click', () =>{
    setting = "lowest";
    videoformat = 'mp4';
})
document.querySelector("#radio3").addEventListener('click', () =>{
    setting = "highestaudio";
    videoformat = 'mp3';
})
document.querySelector("#radio4").addEventListener('click', () =>{
    setting = "lowestaudio";
    videoformat = 'mp3';
})
document.querySelector("#radio5").addEventListener('click', () =>{
    setting = "highestvideo";
    videoformat = 'mp4';
})
document.querySelector("#radio6").addEventListener('click', () =>{
    setting = "lowestvideo";
    videoformat = 'mp4';
})
downloadBtn.addEventListener('click', () => {
    downloadBtn.disabled = true;
    sendUrl();
})
document.querySelector('#savebtn').addEventListener('click', () => {
    ipcRenderer.send('file-dialog')
})
ipcRenderer.on('filepath', (event, result) =>{
    filePath = result;
    savetag.innerHTML = filePath.slice(0,50) + "...";
    console.log(filePath)
})

// https://www.youtube.com/watch?v=3A4ZHuElMvc

const sendUrl = () =>{
    var link = document.querySelector('#linkinput').value;
    const progressbar = document.querySelector('#progressbar');
    progressbar.style.width = 0+"%"

    if (fnameinput.value != ''){
        filename = fnameinput.value
    }
    console.log(filename)

    if (ytdl.validateURL(link)) {
        const video = ytdl(link, {quality: setting})
        const stream = fs.createWriteStream(filePath+`\\${filename}.${videoformat}`)
        console.log(stream)

        video.pipe(stream)

        video.on('progress', (dc, totalDownloaded, totalSize) => {
            let percent = (totalDownloaded/totalSize)*100;
            progressbar.style.width = `${percent}%`
            console.log(percent)
            if (percent === 100){
                downloadBtn.disabled = false;
                setTimeout(() =>{
                    alert('Your download is finished')
                    progressbar.style.width = 0+"%"
                }, 500)
            }
        })
        video.on('error', err =>{
            alert(err)
            downloadBtn.disabled = false;
        })
    }else{
        alert('INVALID LINK');
        downloadBtn.disabled = false;
    }
    
}




