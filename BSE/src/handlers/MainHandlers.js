
//Player data
// let playerNames = ["",""];
// let playerIDs = [];
import {Match} from "moons-ta-client";

export let playerMisses = [0, 0];
export let playerFC = [true,true];
//Current song data

export let playerNames = [];
export let playerIDs = [];

export function setPlayerInfo(playerIds, playerNames) {
    playerIDs = playerIds;
    playerNames = playerNames;
}

// const ws = new WebSocket(relayIp);
// ws.onopen = function () {
// 	console.log("Msg sent, connected");
// };
// ws.onmessage = async function (event) {
// 	jsonObj = JSON.parse(event.data);
// 	if (jsonObj.Type == 3) // LevelChanged
// 	{
// 		if (jsonObj.command == "updateMap") {
//
// 			getMap(jsonObj.LevelId, jsonObj.Diff, jsonObj.Modifiers, jsonObj.Player);
// 			scoreUpdate(0, 0, 0, 0, 0, 1);
// 			p1Replay(true);
// 			p2Replay(true);
// 		}
// 	}
// 	if (jsonObj.Type == 4) // Score Update
// 	{
// 		const data = jsonObj.message;
// 		scoreUpdate(data.user_id, data.score, data.combo, data.accuracy * 100, data.totalMisses);
// 	}
// 	if (jsonObj.Type == 5) {
// 		if (jsonObj.command == "createUsers" && jsonObj.matchStyle == "1v1") {
// 			playerIDs = [jsonObj.PlayerIds[0], jsonObj.PlayerIds[1]];
// 			playerNames = [jsonObj.PlayerNames[0], jsonObj.PlayerNames[1]];
// 			setOverlay(playerIDs, playerNames, jsonObj.Round);
// 		}
// 		if (jsonObj.command == "updateScore") {
// 			changeScoreline(jsonObj.Score);
// 		}
// 		if (jsonObj.command === "mapReplay") {
// 			mapReplay(jsonObj.Actor);
// 		}
// 		if (jsonObj.command == "resetOverlay") {
// 			document.getElementById("SongCard").style.opacity = 0;
// 			document.getElementById("PlayerContainers").style.opacity = 0;
// 			document.getElementById("PlayerBounds").style.opacity = 0;
// 			document.getElementById("TugOfWar").style.opacity = 0;
// 			document.getElementById("TextBox").style.opacity = 0;
//
// 			setTimeout(function () {
// 				scoreUpdate(0, 0, 0, 0, 0, 1);
// 				resetReplays();
// 				changeScoreline([0,0]);
// 				songData["",0];
// 			}, 1000);
// 		}
// 	}
// };