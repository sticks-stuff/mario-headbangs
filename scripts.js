var ytInput1 = document.getElementById("urlInput1");
var ytInput2 = document.getElementById("urlInput2");

function testAudio () {
	console.log("button pushed idiot");
	var myAudio = document.createElement('audio');
	myAudio.setAttribute('src','http://ytdown.deniscerri.repl.co/download?URL=https://www.youtube.com/watch?v=aCdvYPGBvy0&File=mp3');
	myAudio.playbackRate = 4;
	myAudio.play();
}

var urlData1 = ytInput1.value
var urlData2 = ytInput2.value
//ytInput1.addEventListener('change', setAudioSource1)
//ytInput2.addEventListener('change', setAudioSource2)
var ytReady1
var ytReady2
var ytBPM1
var ytBPM2

var youtubeAudioUrl
var ytBuffer
var buffer
var soundSource

// var youtubeStream = require('youtube-audio-stream')
var context = new AudioContext({
  sampleRate: 44100
});
var fileInput = document.getElementById("fileInput");

fileInput.onchange = function () {
  var files = fileInput.files;
  if (files.length == 0) return;
  var reader = new FileReader();

  reader.onload = function (fileEvent) {
    context.decodeAudioData(fileEvent.target.result, calcTempo);
  };

  reader.readAsArrayBuffer(files[0]);
};

function start() {
	setAudioSource1();
	setAudioSource2();
} 
function setAudioSource1 () {
	console.log("FUCK YOU")
	urlData1 = ytInput1.value
	  var request = new XMLHttpRequest();
	  request.open("GET", "http://ytdown.deniscerri.repl.co/download?URL=https://www.youtube.com/watch?v=" + urlData1 + "&File=mp3", true);
	  request.responseType = "arraybuffer";

	  /* Asynchronous callback */
	  request.onload = function()
	  {
		 /* Create the sound source */
		 soundSource = context.createBufferSource();
			
		 /* Import callback function that provides PCM audio data decoded as an audio buffer */
		 context.decodeAudioData(request.response, calcTempo1);
		 //console.log("ytBPM1 is " + ytBPM1);
		 //ytReady1 = true;
		 //play();
	  };
	  request.send();
}

function setAudioSource2 () {
	console.log("FUCK YOU")
	urlData2 = ytInput2.value
	  var request = new XMLHttpRequest();
	  request.open("GET", "http://ytdown.deniscerri.repl.co/download?URL=https://www.youtube.com/watch?v=" + urlData2 + "&File=mp3", true);
	  request.responseType = "arraybuffer";

	  /* Asynchronous callback */
	  request.onload = function()
	  {
		 /* Create the sound source */
		 soundSource = context.createBufferSource();
			
		 /* Import callback function that provides PCM audio data decoded as an audio buffer */
		 context.decodeAudioData(request.response, calcTempo2);
		 //console.log("ytBPM2 is " + ytBPM2);
		 //ytReady2 = true;
		 //play();
	  };
	  request.send();
}

function play () {
	if(ytReady1 === true && ytReady2 === true)
	{
		urlData1 = ytInput1.value
		urlData2 = ytInput2.value
		
		var audio1 = document.createElement('audio');
		audio1.setAttribute('src',"http://ytdown.deniscerri.repl.co/download?URL=https://www.youtube.com/watch?v=" + urlData1 + "&File=mp3");

		var audio2 = document.createElement('audio');
		audio2.setAttribute('src',"http://ytdown.deniscerri.repl.co/download?URL=https://www.youtube.com/watch?v=" + urlData2 + "&File=mp3");
		audio2.playbackRate = (ytBPM1 / ytBPM2);
		console.log("playback rate is " + (ytBPM1 / ytBPM2));
		
		audio1.play(); audio2.play(); // Now both will play at the same time
	}
}

var calcTempo1 = function calcTempo(buffer) {
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
  ytBPM1 = parseFloat(mt.tempo);
  console.log("ytBPM1 is " + ytBPM1);
  ytReady1 = true;
  play();
};

var calcTempo2 = function calcTempo(buffer) {
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
  ytBPM2 = parseFloat(mt.tempo);
  console.log("ytBPM2 is " + ytBPM2);
  ytReady2 = true;
  play();
};
