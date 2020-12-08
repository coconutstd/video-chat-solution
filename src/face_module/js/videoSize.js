/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
//실제 출력되는 비디오의 left 값을 얻어온다.
import jQuery from "jquery";
import * as faceapi from './face-api.min'
window.$ = window.jQuery = jQuery;

const S3_URL = 'https://amplify-videochatsolution-dev-233212-deployment.s3.ap-northeast-2.amazonaws.com/'

export function getVideoOriginLeft(videoObjID) {

	var obj = document.getElementById(videoObjID);

	var width = Number($('#' + videoObjID).css('width').replace("px",""));
	var height = Number($('#' + videoObjID).css('height').replace("px",""));
	var videoWidth = obj.videoWidth;
	var videoHeight = obj.videoHeight;

	var ratioW = width/videoWidth;
	var ratioH = height/videoHeight;

	if (ratioW < ratioH)
	{
		var renderWidth = videoWidth*ratioW;
		var tmpleft = (width - renderWidth) / 2;

		return tmpleft;
	}
	else
	{
		var renderWidth = videoWidth*ratioH;
		var tmpleft = (width - renderWidth) / 2;

		return tmpleft;
	}
}
//실제 출력되는 비디오의 top 값을 얻어온다.
export function getVideoOriginTop(videoObjID) {

	var obj = document.getElementById(videoObjID);

	var width = Number($('#' + videoObjID).css('width').replace("px",""));
	var height = Number($('#' + videoObjID).css('height').replace("px",""));
	var videoWidth = obj.videoWidth;
	var videoHeight = obj.videoHeight;

	var ratioW = width/videoWidth;
	var ratioH = height/videoHeight;

	if (ratioW < ratioH)
	{
		var renderHeight = videoHeight*ratioW;
		var tmptop = (height - renderHeight) / 2;

		return tmptop;
	}
	else
	{
		var renderHeight = videoHeight*ratioH;
		var tmptop = (height - renderHeight) / 2;

		return tmptop;
	}
}

//실제 출력되는 비디오의 width 값을 얻어온다.
export function getVideoOriginWidth(videoObjID) {

	var obj = document.getElementById(videoObjID);

	var width = Number($('#' + videoObjID).css('width').replace("px",""));
	var height = Number($('#' + videoObjID).css('height').replace("px",""));

	var videoWidth = obj.videoWidth;
	var videoHeight = obj.videoHeight;

	var ratioW = width/videoWidth;
	var ratioH = height/videoHeight;

	if (ratioW < ratioH)
	{
		var renderWidth = videoWidth*ratioW;
		return renderWidth;
	}
	else
	{
		var renderWidth = videoWidth*ratioH;
		return renderWidth;
	}
}

//실제 출력되는 비디오의 height 값을 얻어온다.
export function getVideoOriginHeight(videoObjID) {

	var obj = document.getElementById(videoObjID);

	var width = Number($('#' + videoObjID).css('width').replace("px",""));
	var height = Number($('#' + videoObjID).css('height').replace("px",""));
	var videoWidth = obj.videoWidth;
	var videoHeight = obj.videoHeight;

	var ratioW = width/videoWidth;
	var ratioH = height/videoHeight;

	if (ratioW < ratioH)
	{
		var renderHeight = videoHeight*ratioW;
		return renderHeight;
	}
	else
	{
		var renderHeight = videoHeight*ratioH;
		return renderHeight;
	}
}

export function loadLabeledImages() {
	// const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark']
	const labels = ['Black Widow', '김유철']
	return Promise.all(
	  labels.map(async label => {
		const descriptions = []
		for (let i = 1; i <= 2; i++) {
			// const img = await faceapi.fetchImage(`../labeled_images/${label}/${i}.jpg`)
			console.log(`${S3_URL}labeled_images/${label}/${i}.jpg`)  
			const img = await faceapi.fetchImage(`${S3_URL}labeled_images/${label}/${i}.jpg`)
		  	// const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/${label}/${i}.jpg`)  
		  const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
		  descriptions.push(detections.descriptor)
		}
		return new faceapi.LabeledFaceDescriptors(label, descriptions)
	  })
	)
  }