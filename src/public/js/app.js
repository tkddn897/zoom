const socket = io();

const myFace = document.getElementById("myFace");

let myStream;

async function getMedia(){
    try{
        myStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        })
        console.log(mystream)
    }catch(e){
        console.log(e)
    }
}
getMedia();