(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var ytInput1 = document.getElementById("urlInput1");
var ytInput2 = document.getElementById("urlInput2");
var urlData1 = ytInput1.value
var urlData2 = ytInput2.value
ytInput1.addEventListener('change', setAudioSource1)
ytInput2.addEventListener('change', setAudioSource2)
var ytReady1
var ytReady2
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

function setAudioSource1 () {
	console.log("FUCK YOU")
	urlData1 = ytInput1.value
	  var request = new XMLHttpRequest();
	  request.open("GET", 'https://cors-anywhere.herokuapp.com/' + "http://ytdown.deniscerri.repl.co/download?URL=https://www.youtube.com/watch?v=" + urlData1 + "&File=mp3", true);
	  request.responseType = "arraybuffer";

	  /* Asynchronous callback */
	  request.onload = function()
	  {
		 /* Create the sound source */
		 soundSource = context.createBufferSource();
			
		 /* Import callback function that provides PCM audio data decoded as an audio buffer */
		 var ytBPM1 = context.decodeAudioData(request.response, calcTempo);
		 play();
	  };
	  request.send();
}

function setAudioSource1 () {
	console.log("FUCK YOU")
	urlData2 = ytInput2.value
	  var request = new XMLHttpRequest();
	  request.open("GET", 'https://cors-anywhere.herokuapp.com/' + "http://ytdown.deniscerri.repl.co/download?URL=https://www.youtube.com/watch?v=" + urlData2 + "&File=mp3", true);
	  request.responseType = "arraybuffer";

	  /* Asynchronous callback */
	  request.onload = function()
	  {
		 /* Create the sound source */
		 soundSource = context.createBufferSource();
			
		 /* Import callback function that provides PCM audio data decoded as an audio buffer */
		 var ytBPM2 = context.decodeAudioData(request.response, calcTempo);
		 play();
	  };
	  request.send();
}

function play () {
	urlData1 = ytInput1.value
	urlData2 = ytInput2.value
	var snd1  = new Audio();
	var src1  = document.createElement("source");
	src1.type = "audio/mpeg";
	src1.src  = 'https://cors-anywhere.herokuapp.com/' + "http://ytdown.deniscerri.repl.co/download?URL=https://www.youtube.com/watch?v=" + urlData1 + "&File=mp3";
	snd1.appendChild(src1);

	var snd2  = new Audio();
	var src2  = document.createElement("source");
	src2.type = "audio/mpeg";
	src2.SetRate(ytBPM1 / ytBPM2);
	src2.src  = 'https://cors-anywhere.herokuapp.com/' + "http://ytdown.deniscerri.repl.co/download?URL=https://www.youtube.com/watch?v=" + urlData2 + "&File=mp3";
	snd2.appendChild(src2);

	snd1.play(); snd2.play(); // Now both will play at the same time
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
  console.log(mt.tempo);
  console.log(mt.beats);
  return(mt.tempo);
};

},{}]},{},[1]);
