// Setting up import variables
const electron = require('electron');
const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require('path');
const {ipcRenderer} = electron;
// Setting up DOM objects
var downloadBtn = document.querySelector('#downloadbtn');
var savetag = document.querySelector('.save-tag');
var fnameinput = document.querySelector('#nameinput');
var thumbnailImg = document.querySelector("#thumbnail");
// Setting up global variables
var setting = "lowest";
var videoformat = "mp4";
var filename = "video";
var filePath = path.resolve(__dirname)
setPathDisplay(filePath);

function setPathDisplay(filePath){
    if (filePath.length<=55){
        savetag.innerHTML = filePath;
    }else{
        savetag.innerHTML = filePath.slice(0,55)+"...";
    }
}

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

document.querySelector('#linkinput').addEventListener('change', () => {
    var link = document.querySelector('#linkinput').value;
    if (validLink(link)){
        var results = link.match('[\\?&]v=([^&#]*)');
        var video = (results === null) ? link : results[1];
        var image =  'http://img.youtube.com/vi/' + video + '/0.jpg';

        console.log(image);
        thumbnailImg.src = image;
    }else{
        thumbnailImg.src = 'images/BlankThumbnail.jpg';
    }
});

downloadBtn.addEventListener('click', () => {
    downloadBtn.disabled = true;
    var link = document.querySelector('#linkinput').value;
    sendUrl(link);
})

document.querySelector('#savebtn').addEventListener('click', () => {
    ipcRenderer.send('file-dialog')
})

ipcRenderer.on('filepath', (event, result) =>{
    filePath = result;
    setPathDisplay(filePath);
    console.log(filePath);
})

function validLink(link){
    return ytdl.validateURL(link);
}

function setThumbnail(url){
    var youtube_video_id = iframe_src.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop();
    var video_thumbnail = $('<img src="//img.youtube.com/vi/'+youtube_video_id+'/0.jpg">');
}

// Takes youtube url and fetches the youtube download
const sendUrl = (link) =>{
    const progressbar = document.querySelector('#progressbar');
    progressbar.style.width = 0+"%"

    if (fnameinput.value != ''){
        filename = fnameinput.value
    }
    console.log(filename)

    if (validLink(link)) {
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
                    thumbnailImg.src = 'images/BlankThumbnail.jpg';
                    progressbar.style.width = 0+"%"
                }, 500)
            }
        })
        video.on('error', err =>{
            alert(err)
            downloadBtn.disabled = false;
            thumbnailImg.src = 'images/BlankThumbnail.jpg';
        })
    }else{
        alert('INVALID LINK');
        downloadBtn.disabled = false;
    }
    
}




