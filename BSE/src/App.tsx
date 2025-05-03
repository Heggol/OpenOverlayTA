import React, { useEffect, useState, useRef } from 'react';
import './App.css';

// import all handles
import { playerIDs, setPlayerInfo } from './handlers/MainHandlers.js';
import './handlers/FormatHandlers.js';
import { getMap } from './handlers/MapHandlers.js';
import { handleReplay, handleSkip, resetAllPlayers, scoreUpdate } from "./handlers/UserScoringHandlers";
import { setOverlay, getGuid } from './handlers/OverlayHandlers.js';
import { createHlsPlayer } from './handlers/HlsPlayerHandlers';

// TA client thingy
import { Match, Tournament, User_ClientTypes } from 'moons-ta-client';
import { useTAClient } from './useTAClient';

let currentMatch: Match;

function App() {
	const player1VideoRef = useRef<HTMLDivElement>(null);
	const player2VideoRef = useRef<HTMLDivElement>(null);
	const video1Ref = useRef<HTMLVideoElement | null>(null);
	const video2Ref = useRef<HTMLVideoElement | null>(null);
	const [selectableMatches, setSelectableMatches] = useState<[string, Match][]>();
	
	// Set up HLS player once refs are available
	useEffect(() => {
		console.log("Setting up HLS player");
		
		if (player1VideoRef.current && player2VideoRef.current) {
			// Clear previous children if any
			while (player1VideoRef.current.firstChild) {
				player1VideoRef.current.removeChild(player1VideoRef.current.firstChild);
			}
			while (player2VideoRef.current.firstChild) {
				player2VideoRef.current.removeChild(player2VideoRef.current.firstChild);
			}
			
			// Create video elements
			const video1 = document.createElement('video');
			video1.controls = true;
			video1.style.height = '100%';
			video1.style.objectFit = 'cover';
			player1VideoRef.current.appendChild(video1);
			video1Ref.current = video1;
			
			const video2 = document.createElement('video');
			video2.controls = true;
			video2.style.height = '100%';
			video2.style.objectFit = 'cover';
			player2VideoRef.current.appendChild(video2);
			video2Ref.current = video2;
		} else
		{
			console.log("There is no playerVideoRef.current");
		}
	}, []);
	
	const handleButton = (player: any, action: any) => {
		if (action === "skip") {
			console.log("Player " + player + " skipped");
			handleSkip(player);
		} else {
			console.log("Player " + player + " replayed");
			handleReplay(player);
		}
	};
	
	let taHook = useTAClient();
	
	// garbage name but I needed smt
	async function connectToMatch(myTourney: Tournament, matchID?: string) {
		let match = taHook.taClient.current!.stateManager.getMatch(myTourney.guid, matchID!)!;
		await taHook.taClient.current!.addUserToMatch(myTourney.guid, match.guid, taHook.taClient.current!.stateManager.getSelfGuid());
		// maybe error check? NAHH
		let users = taHook.taClient.current!.stateManager.getUsers(myTourney.guid)!.filter(x => match.associatedUsers.includes(x.guid) && x.clientType === User_ClientTypes.Player);
		if (users.length === 0) return;
		console.log(users);
		setPlayerInfo(users.map(x => x.guid), users.map(x => x.name));
		await setOverlay(users.map(x => x.guid), users.map(x => x.name), users.map(x => x.platformId));
		currentMatch = match;
		
		// Only fetch GUIDs and create HLS players if we have valid users
		if (users.length >= 2) {
			try {
				let beatkhanaGuid1 = await getGuid(users[0].platformId);
				let beatkhanaGuid2 = await getGuid(users[1].platformId);
				
				// Create HLS players if video elements exist
				if (video1Ref.current && video2Ref.current) {
					console.log("Creating HLS players for streams");
					
					const streamUrl1 = `https://stream.beatkhana.com/live/${beatkhanaGuid1}.m3u8`;
					const streamUrl2 = `https://stream.beatkhana.com/live/${beatkhanaGuid2}.m3u8`;
					
					console.log("Stream URL 1:", streamUrl1);
					console.log("Stream URL 2:", streamUrl2);
					
					createHlsPlayer(video1Ref.current, streamUrl1);
					createHlsPlayer(video2Ref.current, streamUrl2);
				} else {
					console.error("Video elements not available");
				}
			} catch (error) {
				console.error("Error setting up streams:", error);
			}
		} else {
			console.warn("Not enough players to set up streams");
		}
	}
	
	async function addSelfToMatch(playerName: string | undefined, matchID: string | undefined) {
		console.log("Add self to match");
		const myTourney = taHook.taClient.current!.stateManager.getTournaments().find(x => x.settings?.tournamentName === "Beat Saber Elites");
		
		if (!myTourney) {
			console.error(`Could not find tournament with name ${'Beat Saber Elites'}`);
			return;
		}
		
		myTourney.matches?.forEach(match => {
			if (match.associatedUsers.includes(taHook.taClient.current!.stateManager.getSelfGuid())) {
				// remove self from match
				console.log("Removing self from match")
				taHook.taClient.current!.removeUserFromMatch(myTourney.guid, match.guid, taHook.taClient.current!.stateManager.getSelfGuid());
			}
		});
		
		if (!(taHook.taClient.current!.stateManager.getMatches(myTourney.guid) !== undefined && taHook.taClient.current!.stateManager.getMatches(myTourney.guid)!.length > 0)) {
			return;
		}
		if (playerName === undefined && matchID === undefined) {
			let matchID = taHook.taClient.current!.stateManager.getMatches(myTourney.guid)![0].guid;
			await connectToMatch(myTourney, matchID);
			return;
		}
		if (matchID !== undefined) {
			await connectToMatch(myTourney, matchID);
			return;
		}
		for (let i = 0; i < taHook.taClient.current!.stateManager.getMatches(myTourney.guid)!.length; i++) {
			if (taHook.taClient.current!.stateManager.getMatches(myTourney.guid)![i].associatedUsers[0].toLowerCase() === playerName || taHook.taClient.current!.stateManager.getMatches(myTourney.guid)![i].associatedUsers[1].toLowerCase() === playerName) {
				await connectToMatch(myTourney, taHook.taClient.current!.stateManager.getMatches(myTourney.guid)![i].guid);
				break;
			}
		}
	}
	
	async function chooseMatch() {
		console.log("Choose match");
		const myTourney = taHook.taClient.current!.stateManager.getTournaments().find(x => x.settings?.tournamentName === "Beat Saber Elites")!;
		
		if (!myTourney) {
			console.error(`Could not find tournament with name ${'Beat Saber Elites'}`);
			return;
		}
		
		const tourneyPlayers = taHook.taClient.current!.stateManager.getUsers(myTourney.guid)!;
		
		let selectableMatches: [string, Match][] = taHook.taClient.current!.stateManager.getMatches(myTourney.guid)!.map((match) => {
			const matchPlayers = tourneyPlayers.filter(x => x.clientType === User_ClientTypes.Player && match.associatedUsers.includes(x.guid));
			console.log(match.associatedUsers[0] + " vs " + match.associatedUsers[1]);
			
			return [matchPlayers[0]?.name + " vs " + matchPlayers[1]?.name, match];
		});
		
		setSelectableMatches(selectableMatches);
	}
	
	const handleScoreClick = (player: number, isAddition: boolean) => {
		const scoreElement = document.getElementById(`Player${player}Score`);
		if (scoreElement) {
			const currentScore = parseInt(scoreElement.textContent || "0");
			const newScore = isAddition ? currentScore + 1 : currentScore - 1;
			scoreElement.textContent = Math.max(0, newScore).toString();
		}
	};
	
	useEffect(() => {
		console.log("Subscribing to TA client events");
		
		const unsubscribeFromTAConnected = taHook.subscribeToTAConnected(() => {
			addSelfToMatch(undefined, undefined);
		});
		
		const unsubscribeFromRealtimeScores = taHook.subscribeToRealtimeScores((score) => {
			console.log(score);
			scoreUpdate(score.userGuid, score.score, score.combo, score.accuracy, score.notesMissed, 0, score.songPosition);
		});
		
		const unsubscribeFromSongFinished = taHook.subscribeToSongFinished((songFinished) => {
			console.log("Song finished");
			let userScores: { userGuid: string | undefined, score: number } = {userGuid: "", score: 0};
			
			if (songFinished.matchId !== currentMatch?.guid) return;
			if (userScores.userGuid === "") {
				userScores = {userGuid: songFinished.player!.guid, score: songFinished.score};
			}
			// TODO: Fix user win scores
			// if (userScores.score < songFinished.score) {
			//   userWinScore(songFinished.player!.guid);
			//   userScores = { userGuid: "", score: 0 };
			// }
			// else {
			//   userWinScore(userScores.userGuid);
			//   userScores = { userGuid: "", score: 0 };
			// }
		});
		
		const unsubscribeFromFailedToCreateMatch = taHook.subscribeToFailedToCreateMatch(() => {
			console.log("failed to create Match");
		});
		
		const unsubscribeFromMatchCreated = taHook.subscribeToMatchCreated(([match, tournament]) => {
			console.log("Created match");
			if (currentMatch === undefined) {
				console.log("Match created");
				addSelfToMatch(undefined, undefined);
			}
		});
		
		const unsubscribeFromMatchUpdated = taHook.subscribeToMatchUpdated(([match, tournament]) => {
			console.log("Updated match");
			if (currentMatch?.guid !== match.guid) return;
			let levelID = match.selectedMap?.gameplayParameters?.beatmap?.levelId.toLowerCase().slice(13);
			let levelDiff = match.selectedMap?.gameplayParameters?.beatmap?.difficulty;
			getMap(levelID, levelDiff);
		});
		
		const unsubscribeFromMatchDeleted = taHook.subscribeToMatchDeleted(([match, tournament]) => {
			console.log("Deleted match");
			if (currentMatch?.guid === match?.guid) {
				// currentMatch = undefined;
				resetAllPlayers();
			}
		});
		
		return () => {
			console.log("Unsubscribing from TA client events");
			
			unsubscribeFromTAConnected();
			unsubscribeFromRealtimeScores();
			unsubscribeFromSongFinished();
			unsubscribeFromFailedToCreateMatch();
			unsubscribeFromMatchCreated();
			unsubscribeFromMatchUpdated();
			unsubscribeFromMatchDeleted();
		};
	}, [taHook]);
	
	return (
		<div className="BGImage">
			<div className="MainClass">
				<div className="PlayerContainers" id="PlayerContainers">
					<div className="Player1Container" id="Player1Container">
						<button className="Player1ReplayBase" id="Player1ReplayBase"
						        onClick={(e) => handleButton(0, "replay")}></button>
						<div className="Player1Score" id="Player1Score"
						     onClick={(e) => handleScoreClick(1, true)}
						     onContextMenu={(e) => {
							     e.preventDefault();
							     handleScoreClick(1, false);
						     }} style={{cursor: "pointer"}}>0
						</div>
						<p className="Player1Name" id="Player1Name">OK</p>
						{/*<button className="Player1SkipBase" id="Player1SkipBase"*/}
						{/*  onClick={(e) => handleButton(0, "skip")}></button>*/}
						<div className="imageContainer1" id="imageContainer1">
							<img src="./images/Placeholder.png" className="Player1Image"
							     id="Player1Image"/>
						</div>
					</div>
					<div className="LogoSpot" id="LogoContainer">
					</div>
					<div className="Player2Container" id="Player2Container">
						<div className="imageContainer2" id="imageContainer2">
							<img src="./images/Placeholder.png" className="Player2Image"
							     id="Player2Image"/>
						</div>
						<p className="Player2Name" id="Player2Name">BOOMER</p>
						<div className="Player2Score" id="Player2Score"
						     onClick={(e) => handleScoreClick(2, true)}
						     onContextMenu={(e) => {
							     e.preventDefault();
							     handleScoreClick(2, false);
						     }} style={{cursor: "pointer"}}>0
						</div>
						{/*<button className="Player2SkipBase" id="Player2SkipBase"*/}
						{/*  onClick={(e) => handleButton(1, "skip")}></button>*/}
						<button className="Player2ReplayBase" id="Player2ReplayBase"
						        onClick={(e) => handleButton(1, "replay")}></button>
					</div>
					<div className="divLine" id="divLine"></div>
					
					{/* control button(s) */}
					<button
						className={"chooseMatch"}
						id={"chooseMatch"}
						onClick={() => {
							console.log("Choose match button pressed");
							chooseMatch();
						}}>
					</button>
					
					<span className={"buttonsChooseMatch"}>
                        {selectableMatches && selectableMatches.map(([matchString, match], index) => (
	                        <button
		                        key={index}
		                        id={"MatchSelection"}
		                        onClick={() => {
			                        const myTourney = taHook.taClient.current!.stateManager.getTournaments().find(x => x.settings?.tournamentName === "Beat Saber Elites");
			                        
			                        if (!myTourney) {
				                        console.error(`Could not find tournament with name ${'Beat Saber Elites'}`);
				                        return;
			                        }
			                        addSelfToMatch(undefined, match.guid);
			                        let levelID = match.selectedMap?.gameplayParameters?.beatmap?.levelId.toLowerCase().slice(13);
			                        let levelDiff = match.selectedMap?.gameplayParameters?.beatmap?.difficulty;
			                        getMap(levelID, levelDiff);
			                        setSelectableMatches([]);
		                        }}
	                        >
		                        {matchString}
	                        </button>
                        ))}
                    </span>
					
					<button className={"MuteButton"} id={"MuteButton"} onClick={() => {
					  console.log("Mute button pressed");
					  if ((video1Ref.current!.muted && video2Ref.current!.muted) || (!video1Ref.current!.muted && !video2Ref.current!.muted)) {
						  video1Ref.current!.muted = false;
						  video2Ref.current!.muted = true;
					  }
					  else {
						  video1Ref.current!.muted = !video1Ref.current!.muted;
						  video2Ref.current!.muted = !video2Ref.current!.muted;
					  }
					}}></button>
				
				</div>
				
				{/* Streams */}
				<div className="videoContainer">
					<div id="player1Video" ref={player1VideoRef} className="playerVideo"></div>
					<div id="player2Video" ref={player2VideoRef} className="playerVideo"></div>
				</div>
				
				{/*Tug of War*/}
				<div className="TugOfWar FadeIn" id="TugOfWar">
					<div className="LeftTugOuter">
						<div className="LeftTugInner SmoothWidth" id="LeftTug"></div>
					</div>
					<div className="RightTugOuter">
						<div className="RightTugInner SmoothWidth" id="RightTug"></div>
					</div>
				</div>
				
				{/*Bottom bar*/}
				
				<div className="BottomBar" id="BottomBar">
					
					{/*Player scores*/}
					<div className="PlayerBounds ScoringShadow FadeIn" id="PlayerBounds">
						<div className="Player1Class" id="Player1Class">
							<p className="Player1ACC" id="Player1ACC">0.00%</p>
							<p className="Player1FC" id="Player1FC">FC</p>
							<p className="Player1Combo" id="Player1Combo">0x</p>
						</div>
						<div className="Player2Class" id="Player2Class">
							<p className="Player2ACC" id="Player2ACC">0.00%</p>
							<p className="Player2FC" id="Player2FC">FC</p>
							<p className="Player2Combo" id="Player2Combo">0x</p>
						</div>
					</div>
					
					<div className="SongCard FadeIn" id="SongCard">
						<div className="SongBox">
							<p className="SongName" id="SongName">Really Long Song name that is...</p>
							<div className="SongInfoLeft">
								<p className="SongMapper" id="SongMapper">Mapped by NightHawk</p>
								<p className="UploadDate" id="UploadDate">Uploaded on 2021-09-01</p>
							</div>
							<div className="SongInfoRight">
								<p className="SongArtist" id="SongArtist">Lauv</p>
								<p className="SongLength" id="SongLength">3:59</p>
							</div>
							<p className="MapKey" id="MapKey">ABC</p>
							<div className="SongCover" id="SongCover"></div>
							<div className="SongBoxBG" id="SongBoxBG"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;