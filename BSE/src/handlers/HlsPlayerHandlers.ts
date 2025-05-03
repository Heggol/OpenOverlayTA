import Hls from 'hls.js';

export function createHlsPlayer(videoElement: HTMLVideoElement, streamUrl: string): void {
    console.log("Starting to create HLS player for:", streamUrl);
    
    // Check for valid video element and URL
    if (!videoElement) {
        console.error("Invalid video element provided to createHlsPlayer");
        return;
    }
    
    if (!streamUrl || !streamUrl.includes(".m3u8")) {
        console.error("Invalid stream URL provided:", streamUrl);
        return;
    }
    
    // Check if HLS.js is supported
    if (Hls.isSupported()) {
        console.log("HLS.js is supported, creating player for:", streamUrl);
        
        const hls = new Hls({
            debug: true, // Enable for debugging
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
        });
        
        // Clean up any existing instances
        if ((videoElement as any).hls) {
            ((videoElement as any).hls as Hls).destroy();
        }
        
        // Store the HLS instance on the video element for future reference
        (videoElement as any).hls = hls;
        
        hls.attachMedia(videoElement);
        
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            console.log("HLS media attached for:", streamUrl);
            hls.loadSource(streamUrl);
            
            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                console.log("HLS manifest parsed for:", streamUrl, data);
                
                // Try to start playback automatically
                videoElement.muted = true; // Mute to allow autoplay
                videoElement.play()
                    .then(() => {
                        console.log("Autoplay started for:", streamUrl);
                    })
                    .catch(error => {
                        console.warn("Autoplay not allowed, waiting for user interaction:", error);
                        // Wait for user interaction to play
                        const playHandler = () => {
                            videoElement.muted = false; // Unmute when user interacts
                            videoElement.play().catch(playError => {
                                console.error("Error attempting to play after user interaction:", playError);
                            });
                            document.removeEventListener('click', playHandler);
                        };
                        document.addEventListener('click', playHandler);
                    });
            });
            
            hls.on(Hls.Events.LEVEL_LOADED, function (event, data) {
                console.log("HLS level loaded for:", streamUrl, data);
            });
        });
        
        hls.on(Hls.Events.ERROR, function (event, data) {
            console.warn(`HLS error for ${streamUrl}:`, data);
            
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.error("Fatal network error for:", streamUrl, data);
                        // Try to recover
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.error("Fatal media error for:", streamUrl, data);
                        hls.recoverMediaError();
                        break;
                    default:
                        console.error("Fatal HLS error, cannot recover for:", streamUrl, data);
                        hls.destroy();
                        
                        // Attempt to recreate after a delay
                        setTimeout(() => {
                            console.log("Attempting to recreate HLS player after error");
                            createHlsPlayer(videoElement, streamUrl);
                        }, 5000);
                        break;
                }
            }
        });
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari and iOS which have native HLS support
        console.log("Using native HLS support for:", streamUrl);
        videoElement.src = streamUrl;
        
        videoElement.addEventListener('loadedmetadata', function () {
            console.log("Video metadata loaded for native player:", streamUrl);
            videoElement.muted = true;
            videoElement.play()
                .then(() => {
                    console.log("Native autoplay started for:", streamUrl);
                })
                .catch(error => {
                    console.warn("Native autoplay not allowed, waiting for user interaction:", error);
                    const playHandler = () => {
                        videoElement.muted = false;
                        videoElement.play().catch(playError => {
                            console.error("Error attempting to play native after user interaction:", playError);
                        });
                        document.removeEventListener('click', playHandler);
                    };
                    document.addEventListener('click', playHandler);
                });
        });
        
        videoElement.addEventListener('error', function (e) {
            console.error("Native HLS player error for:", streamUrl, e);
        });
    } else {
        console.error("HLS is not supported on this browser for:", streamUrl);
    }
}