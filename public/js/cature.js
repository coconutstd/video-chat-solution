function capture() {

    const video = document.getElementById('video-16');

    console.log(video)

    if (video) {

      console.log(getVideoOriginLeft('video-16'))
      console.log(getVideoOriginTop('video-16'))
      console.log(getVideoOriginWidth('video-16'))
      console.log(getVideoOriginHeight('video-16'))

    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
      faceapi.nets.faceExpressionNet.loadFromUri('./models')
    ]).then(startVideo)

    function startVideo() {
      navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
      )
    }

    video.addEventListener('play', () => {
      const canvas = faceapi.createCanvasFromMedia(video)
    //console.log(canvas)
      //document.body.append(canvas)
      $("#tile-16").append(canvas)

      const displaySize = { width: getVideoOriginWidth('video-16'), height: getVideoOriginHeight('video-16') }
      faceapi.matchDimensions(canvas, displaySize)

      // tiny_face_detector options
      let inputSize = 224
      let scoreThreshold = 0.5

      setInterval(async () => {
        // const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        // const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })).withFaceExpressions()

        const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })).withFaceExpressions()

        // console.log(detections)

        // const resizedDetections = faceapi.resizeResults(detections, displaySize)
        // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        // faceapi.draw.drawDetections(canvas, resizedDetections)
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

        if (detections) {
          const displaySize = { width: getVideoOriginWidth('video-16'), height: getVideoOriginHeight('video-16') }
          const dims = faceapi.matchDimensions(canvas, displaySize, true)
          const resizedResult = faceapi.resizeResults(detections, dims)
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
          const minConfidence = 0.05
          faceapi.draw.drawDetections(canvas, resizedResult)
          faceapi.draw.drawFaceExpressions(canvas, resizedResult, minConfidence)
          console.log(detections)
          // console.log(canvas)
        }

      }, 100)
    })
    }

    };
