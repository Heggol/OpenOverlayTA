import Hls from "hls.js";
import useLifecycle from "../hooks/useLifecycle";

export function createHlsPlayer(videoElement: HTMLVideoElement, streamUrl: string): () => void {
    let hls: Hls | null = null;
    
    const destroyHls = () => {
        if (hls) {
            hls.destroy();
            hls = null;
        }
    };
    
    if (Hls.isSupported()) {
        hls = new Hls({
            debug: false,
            enableWorker: true,
        });
        
        hls.attachMedia(videoElement);
        
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            hls!.loadSource(streamUrl);
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS error:', data);
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.error('Network error, trying to recover...');
                        hls!.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.error('Media error, trying to recover...');
                        hls!.recoverMediaError();
                        break;
                    default:
                        console.error('Fatal error, destroying HLS instance');
                        destroyHls();
                        break;
                }
            }
        });
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        console.error('Video play type not supported');
        videoElement.src = streamUrl;
    } else {
        console.error('HLS is not supported in this browser');
    }
    
    return destroyHls;
}

// export function useHlsPlayer(videoElement: HTMLVideoElement, streamUrl: string) {
//     useLifecycle(
//         () => createHlsPlayer(videoElement, streamUrl),
//         () => {
//             // Cleanup logic
//             videoElement.pause();
//         }
//     );
// }