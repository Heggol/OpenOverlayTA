import Hls from 'hls.js';

export function createHlsPlayer(videoElement: HTMLVideoElement, streamUrl: string): void {
    if (Hls.isSupported()) {
        console.log("Creating HLS player for URL:", streamUrl);
        
        const hls = new Hls({
            debug: false,
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
        });
        
        hls.attachMedia(videoElement);
        
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            console.log("HLS media attached");
            hls.loadSource(streamUrl);
            
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                console.log("HLS manifest parsed");
                // Wait for user interaction to play
                const playHandler = () => {
                    videoElement.play().catch(error => {
                        console.error("Error attempting to play:", error);
                    });
                    document.removeEventListener('click', playHandler);
                };
                document.addEventListener('click', playHandler);
            });
        });
        
        hls.on(Hls.Events.ERROR, function (event, data) {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.error("Fatal network error", data);
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.error("Fatal media error", data);
                        hls.recoverMediaError();
                        break;
                    default:
                        console.error("Fatal HLS error, cannot recover:", data);
                        hls.destroy();
                        break;
                }
            } else {
                console.warn("Non-fatal HLS error:", data);
            }
        });
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        console.log("Using native HLS support");
        videoElement.src = streamUrl;
        videoElement.addEventListener('loadedmetadata', function () {
            const playHandler = () => {
                videoElement.play().catch(error => {
                    console.error("Error attempting to play:", error);
                });
                document.removeEventListener('click', playHandler);
            };
            document.addEventListener('click', playHandler);
        });
    } else {
        console.error("HLS is not supported on this browser");
    }
}