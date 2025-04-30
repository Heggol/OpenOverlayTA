//Used to format map-length to a readable format.
import './UserScoringHandlers.js';
import {playerAcc} from "./UserScoringHandlers";

export let scoreLine = [0, 0];
export let replayLeft = [1, 1];
export let replaying = [0, 0];
export function fancyTimeFormat(duration) {
	var hrs = ~~(duration / 3600);
	var mins = ~~((duration % 3600) / 60);
	var secs = ~~duration % 60;

	var ret = "";

	if (hrs > 0) {
		ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
	}

	ret += "" + mins + ":" + (secs < 10 ? "0" : "");
	ret += "" + secs;
	return ret;
}

//Used to format acc to a readable format.
function toFixed(num, fixed) {
	let re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || +2) + '})?');
	return num.toString().match(re)[0];
}

//Used to format scores to a readable format.
function scoreFormatting(x) {
	return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
}

function FormatText(string) {
    let inputString = string;
    const firstSpaceIndex = inputString.indexOf(" ");
    const firstWord = inputString.substring(0, firstSpaceIndex);
    const remainingText = inputString.substring(firstSpaceIndex);
    const outputString = `${firstWord} <span style="font-weight:600;">${remainingText}</span>`;
    return outputString;
}

/* Replay Handlers */
function mapReplay(Actor) {
    if (Actor == 1) {
        p1Replay(false);
    }
    if (Actor == 2) {
        p2Replay(false);
    }
}
function resetReplays() {
    replayLeft = [1, 1];

    p1Replay(true);
    p2Replay(true);
    
    replaying = [0, 0];

    setTimeout(function () {
        document.getElementById("Player1ReplayBase").style.opacity = "1";
        document.getElementById("Player2ReplayBase").style.opacity = "1";
    }, 5000);
}

function p1Replay(mapChange) {
    if (replayLeft[0] === 1 && !mapChange) {
        if (replaying[0] === 0) {

            replaying[0] = 1;
            document.getElementById("Player1ReplayBase").style.opacity = "0";
            document.getElementById("Player1Goal").style.opacity = "0";
            document.getElementById("Player1ReplayBase").style.transform = "translateX(-150px)";

            setTimeout(function () {
                document.getElementById("Player1Score").style.borderRadius = "0";
                document.getElementById("Player1ReplayText").style.borderBottomLeftRadius = "8px";
                document.getElementById("Player1ReplayText").style.backgroundColor = "#161724";
                document.getElementById("Player1ReplayText").style.fontSize = "16px";
                document.getElementById("Player1ReplayText").innerText = "REPLAY CALLED";
                document.getElementById("Player1Goal").innerText = `TO BEAT: ${playerAcc[1]}%`;
                document.getElementById("Player1ReplayText").style.opacity = "1";
                document.getElementById("Player1Goal").style.opacity = "1";
                document.getElementById("Player1Goal").style.transform = "translateX(30px)";
                document.getElementById("Player1ReplayText").style.translate = "0px";
                document.getElementById("Player1ReplayText").style.transform = "translateX(30px)";
            }, 1000);
        } else {
            replaying[0] = 0;
            document.getElementById("Player1ReplayText").style.transform = "translateX(0px)";
            document.getElementById("Player1ReplayText").style.opacity = "0";
            document.getElementById("Player1Goal").style.transform = "translateX(0px)";
            document.getElementById("Player1Goal").style.opacity = "0";

            setTimeout(function () {
                document.getElementById("Player1ReplayBase").style.transform = "translateX(0px)";
                document.getElementById("Player1ReplayBase").style.opacity = "0.4";
                document.getElementById("Player1Score").style.borderRadius = "8px 0 0 8px";
            }, 1000);
        }
    } else if (replaying[0] == 1 && mapChange) {
        replaying[0] = 0;
        document.getElementById("Player1ReplayText").style.transform = "translateX(0px)";
        document.getElementById("Player1ReplayText").style.opacity = "0";
        document.getElementById("Player1Goal").style.transform = "translateX(0px)";
        document.getElementById("Player1Goal").style.opacity = "0";

        setTimeout(function () {
            document.getElementById("Player1ReplayBase").style.transform = "translateX(0px)";
            document.getElementById("Player1ReplayBase").style.opacity = "0.4";
            document.getElementById("Player1Score").style.borderRadius = "8px 0 0 8px";
        }, 1000);
    }
}

function p2Replay(mapChange) {
    if (replayLeft[1] === 1 && !mapChange) {
        if (replaying[1] === 0) {
            
            replaying[1] = 1;
            document.getElementById("Player2ReplayBase").style.opacity = "0";
            document.getElementById("Player2Goal").style.opacity = "0";
            document.getElementById("Player2ReplayBase").style.transform = "translateX(150px)";

            setTimeout(function () {
                document.getElementById("Player2Score").style.borderRadius = "0";
                document.getElementById("Player2ReplayText").style.borderBottomRightRadius = "8px";
                document.getElementById("Player2ReplayText").style.backgroundColor = "#161724";
                document.getElementById("Player2ReplayText").style.fontSize = "16px";
                document.getElementById("Player2ReplayText").innerText = "REPLAY CALLED";
                document.getElementById("Player2Goal").innerText = `TO BEAT: ${playerAcc[0]}%`;
                document.getElementById("Player2ReplayText").style.opacity = "1";
                document.getElementById("Player2Goal").style.opacity = "1";
                document.getElementById("Player2Goal").style.transform = "translateX(-30px)";
                document.getElementById("Player2ReplayText").style.translate = "0px";
                document.getElementById("Player2ReplayText").style.transform = "translateX(-30px)";
            }, 1000);
        } else {
            replaying[1] = 0;
            document.getElementById("Player2ReplayText").style.transform = "translateX(0px)";
            document.getElementById("Player2ReplayText").style.opacity = "0";
            document.getElementById("Player2Goal").style.transform = "translateX(0px)";
            document.getElementById("Player2Goal").style.opacity = "0";

            setTimeout(function () {
                document.getElementById("Player2ReplayBase").style.transform = "translateX(0px)";
                document.getElementById("Player2ReplayBase").style.opacity = "0.4";
                document.getElementById("Player2Score").style.borderRadius = "0 8px 8px 0";
            }, 1000);
        }
    } else if (replaying[1] == 1 && mapChange) {
        replaying[1] = 0;
        document.getElementById("Player2ReplayText").style.transform = "translateX(0px)";
        document.getElementById("Player2ReplayText").style.opacity = "0";
        document.getElementById("Player2Goal").style.transform = "translateX(0px)";
        document.getElementById("Player2Goal").style.opacity = "0";

        setTimeout(function () {
            document.getElementById("Player2ReplayBase").style.transform = "translateX(0px)";
            document.getElementById("Player2ReplayBase").style.opacity = "0.4";
            document.getElementById("Player2Score").style.borderRadius = "0 8px 8px 0";
        }, 1000);
    }
}

/* Scoreline handler */
function changeScoreline(Score) {
    scoreLine = [Score[0], Score[1]];
        document.getElementById("Player1Score").innerText = Score[0];
        document.getElementById("Player2Score").innerText = Score[1];
}