//실제 출력되는 비디오의 left 값을 얻어온다.
function getVideoOriginLeft(videoObjID) {
	
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
};
//실제 출력되는 비디오의 top 값을 얻어온다.
function getVideoOriginTop(videoObjID) {
	
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
};

//실제 출력되는 비디오의 width 값을 얻어온다.
function getVideoOriginWidth(videoObjID) {
	
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
};

//실제 출력되는 비디오의 height 값을 얻어온다.
function getVideoOriginHeight(videoObjID) {
	
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
};
