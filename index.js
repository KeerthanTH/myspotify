console.log('lets play a song')

// seconds to minutes function
function convertSecondsToMinutes(seconds) {
    // Round down to the nearest whole number
    let totalSeconds = Math.floor(seconds);
    let minutes = Math.floor(totalSeconds / 60);
    let remainingSeconds = totalSeconds % 60;

    // Pad with leading zeros if necessary
    minutes = minutes < 10 ? '0' + minutes : minutes;
    remainingSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return `${minutes}:${remainingSeconds}`;
}

let currentsong = new Audio()
let currentfolder

async function getsongs() {
    let a = await fetch('http://127.0.0.1:3000/songs/')
    let response = await a.text()
    // console.log(response)

    let div = document.createElement('div')
    div.innerHTML = response
    // console.log(div)

    let songs = []
    let song = div.getElementsByTagName('a')
    for (let index = 0; index < song.length; index++) {
        const element = song[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href)
        }
    }
    return songs
}

// playmusic function
const playmusic=(track, pause=false)=>{
    // var audio = new Audio('/songs/'+track)
    currentsong.src ='/songs/'+track
    if(!pause){
        currentsong.play()
    }
    document.querySelector('.play img').src="pause.svg"
    document.querySelector('.songinfo').innerHTML = track.replace(/.mp3/,'')
    
}



async function playsong() {
    let songs = await getsongs()



    let songlist = document.querySelector('.songlist').getElementsByTagName('ul')[0]
    songlist.innerHTML = "";
    for (const song of songs) {
        let songName = song.substring(song.lastIndexOf('/') + 1); // Extract the file name from the URL
        // console.log(songName)
        songName = songName.replace(/\.[^/.]+$/, ""); // Remove the file extension
        if (song.trim() !== "") {
            songlist.innerHTML += `<li>${songName}</li>`.replace(/Copy/g, '').replace(/%20/g, '').replace(/-/g, '')
            // console.log('List item:', songlist);
        }
        

    }
    


    Array.from(document.querySelector('.songlist').getElementsByTagName('li')).forEach(e=>{
        e.addEventListener('click',(event)=>{
            console.log(e.innerHTML+'.mp3')
            playmusic(e.innerHTML.trim()+'.mp3')            
        })
    })
   
    // playmusic(songs[1], true)


    // to pause and play a song
    function toggleplaypause(){
        if(currentsong.paused){
            currentsong.play()
            document.querySelector('.play img').src='pause.svg'
        }
        else{
            currentsong.pause()
            document.querySelector('.play img').src='play.svg'
        }

    }

    document.querySelector('.play').addEventListener('click',()=>{
        toggleplaypause()
    })

    document.addEventListener('keypress',(event)=>{
        if(event.key===' '){

            toggleplaypause()
        }
    })

    // song duration display
    currentsong.addEventListener('timeupdate',(e)=>{
        // console.log(currentsong.currentTime)
        document.querySelector('.songtime').innerHTML=`${convertSecondsToMinutes(currentsong.currentTime)}/${convertSecondsToMinutes(currentsong.duration)}`
        document.querySelector(".seeker").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";

    })

    // seeker function
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".seeker").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })
     
 
}
playsong()