var video = document.getElementById('video');
var canvasElement = document.getElementById('canvas');
var canvas = canvasElement.getContext('2d');
var form = document.getElementById('form');

// Use facingMode: environment to attempt to get the front camera on phones
navigator.mediaDevices
    .getUserMedia({ video: { facingMode: 'environment' } })
    .then(function(stream) {
        video.srcObject = stream;
        video.setAttribute('playsinline', true); // required to tell iOS safari we don't want fullscreen
        video.play();
        requestAnimationFrame(tick);
    });

function tick() {
    // check if the video have enough data to start playing
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.hidden = true;

        // set canvas height and width equal to the video height and width para perfect
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;

        // this will draw every frames from the video to canvas
        // params {video/img, x, y, width, height}
        canvas.drawImage(
            video,
            0,
            0,
            canvasElement.width,
            canvasElement.height
        );

        // get image data from the canvas for processing
        var imageData = canvas.getImageData(
            0,
            0,
            canvasElement.width,
            canvasElement.height
        );

        // call jsQR method for decoding the QR code image
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
        });

        // if qr code is detected
        if (code) {
            input.value = code.data;
            form.submit();
            return;
            // console.log(code.data);
        }
    }
    requestAnimationFrame(tick);
}
