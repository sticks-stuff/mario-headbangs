(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var ytInput = document.getElementById("urlInput");
var urlData = ytInput.value
ytInput.addEventListener('change', setAudioSource)
var youtubeAudioUrl
var ytBuffer

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

function setName () {
	urlData = ytInput.value
	youtubeAudioUrl = getAudioURLFromYT(urlData)
	ytBuffer = getBufferFromUrl(context, youtubeAudioUrl)
	calcTempo(ytBuffer)
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
};

var getAudio = function getAudio(req, res) {
  var requestUrl = 'http://youtube.com/watch?v=' + req.params.videoId;

  try {
    youtubeStream(requestUrl).pipe(res);
  } catch (exception) {
    res.status(500).send(exception);
  }
}; // YouTube video ID


function getAudioURLFromYT(videoID) {
	fetch('https://cors-anywhere.herokuapp.com/' + "https://www.youtube.com/get_video_info?video_id=" + videoID).then(function (response) {
	  if (response.ok) {
		response.text().then(function (ytData) {
		  // parse response to find audio info
		  var ytData = parse_str(ytData);
		  var getAdaptiveFormats = JSON.parse(ytData.player_response).streamingData.adaptiveFormats;
		  var findAudioInfo = getAdaptiveFormats.findIndex(function (obj) {
			return obj.audioQuality;
		  }); // get the URL for the audio file

		  var audioURL = getAdaptiveFormats[findAudioInfo].url; // update the <audio> element src

		  var youtubeAudio = document.getElementById('youtube');
		  youtubeAudio.src = audioURL;
		  console.log(audioURL);
		  return audioURL;
		});
	  }
	})
}

function parse_str(str) {
  return str.split('&').reduce(function (params, param) {
    var paramSplit = param.split('=').map(function (value) {
      return decodeURIComponent(value.replace('+', ' '));
    });
    params[paramSplit[0]] = paramSplit[1];
    return params;
  }, {});
}

function getBufferFromUrl(context, url)
{
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  /* Asynchronous callback */
  request.onload = function()
  {
	 /* Create the sound source */
	 soundSource = context.createBufferSource();
		
	 /* Import callback function that provides PCM audio data decoded as an audio buffer */
	 context.decodeAudioData(request.response, function(buffer)
	 {
		bufferData = buffer;
		soundSource.buffer = bufferData;
	 }, this.onDecodeError);
  };
  request.send();
  return buffer;
}
},{}]},{},[1]);
