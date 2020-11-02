var ytInput = document.getElementById("urlInput");

var urlData
var ytBPM

var youtubeAudioUrl
var ytBuffer
var buffer
var soundSource

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// var youtubeStream = require('youtube-audio-stream')
var context = new AudioContext({
  sampleRate: 44100
});

function start() {
	var input = document.getElementById("input"); 
	var loaderContainer = document.getElementById("loaderContainer"); 
	input.style.display = "none";
	loaderContainer.style.display = "flex";
	setAudioSource();
} 
function setAudioSource () {
	console.log("Starting!")
	urlData = ytInput.value.substr(-11);
	  var request = new XMLHttpRequest();
	  request.open("GET", "https://cors-anywhere.herokuapp.com/" + "https://denisytdl.herokuapp.com/download/yt/?URL=https://www.youtube.com/watch?v=" + urlData, true);
	  request.responseType = "arraybuffer";

	  /* Asynchronous callback */
	  request.onload = function()
	  {
		 /* Create the sound source */
		 soundSource = context.createBufferSource();
			
		 /* Import callback function that provides PCM audio data decoded as an audio buffer */
		 context.decodeAudioData(request.response, calcTempo);
		 //console.log("ytBPM1 is " + ytBPM1);
		 //ytReady1 = true;
		 //play();
	  };
	  request.send();
}

function play () {
	var player;
  
	player = new YT.Player('player', {
		videoId: urlData,
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
  
	var mario = document.getElementById("mario"); 
	if(ytBPM >= 130) {
		mario.playbackRate = ytBPM / 460;
	} else {
		mario.playbackRate = ytBPM / 230;
	}
	
	function onPlayerReady(event) {
		loaderContainer.style.display = "none";
        event.target.playVideo(); 
		mario.style.display = "flex";
    }
	function onPlayerStateChange(event) {
		if (event.data == YT.PlayerState.PLAYING) {
			mario.play();
		}
		else {
			mario.pause();
		}
	}
}

var calcTempo = function calcTempo(buffer) {
  var audioData = []; // Take the average of the two channels

  if (buffer.numberOfChannels == 2) {
    var channel1Data = buffer.getChannelData(0);
    var channel2Data = buffer.getChannelData(1);
    var length = channel1Data.length;

    for (var i = 0; i < length; i++) {
      audioData[i] = (channel1Data[i] + channel2Data[i]) / 2;
    }
  } else {
    audioData = buffer.getChannelData(0);
  }

  var mt = new MusicTempo(audioData);
  ytBPM = parseFloat(mt.tempo);
  console.log("ytBPM is " + ytBPM);
  play();
};

