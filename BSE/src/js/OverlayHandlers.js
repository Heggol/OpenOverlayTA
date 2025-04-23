async function getImage(platformID) {
    try {
        const response = await fetch(`http://api.beatkhana.com/api/getUserByBeatleader/${platformID}`);
        if (!response.ok) {
            // new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            console.log(data[0]);
            return data[0].avatarurl;
        } else {
            // new Error("Invalid response structure");
        }
    } catch (error) {
        console.error("Failed to fetch image:", error);
        return "./images/Placeholder.png"; // Fallback image
    }
}

async function getTwitchID(platformID)
{
    const response = await fetch(`http://api.beatkhana.com/api/getUserByBeatleader/${platformID}`);
    if (!response.ok) {
        new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    if (!text) {
        new Error("Empty response body");
        return "yetanotherbt"; // Fallback twitch name
    }
    const data = JSON.parse(text);
    return data[0].twitchname;
}

async function setOverlay(playerIDs, playerNames, platformIDs) {
    playerIDs = [playerIDs[0], playerIDs[1]];
    console.log("Setting overlay for players:", playerIDs, playerNames, platformIDs)

    const player1ImageElement = document.getElementById("Player1Image");
    const player1NameElement = document.getElementById("Player1Name");

    const player2ImageElement = document.getElementById("Player2Image");
    const player2NameElement = document.getElementById("Player2Name");

    const playerContainersElement = document.getElementById("PlayerContainers");
    const playerBoundsElement = document.getElementById("PlayerBounds");
    const tugOfWarElement = document.getElementById("TugOfWar");

    if (player1NameElement && player2NameElement) {
        // set player names

        player1NameElement.innerText = playerNames[0];
        player1NameElement.style.opacity = '1';

        let playerImage = [];
        playerImage[0] = await getImage(platformIDs[0]);
        playerImage[1] = await getImage(platformIDs[1]);

        // set player images
        if(!platformIDs[0] || !playerImage[0]){
            console.error("Invalid platform ID:", platformIDs[0]);
            player1ImageElement.src = "./images/Placeholder.png"; // Fallback image
        } else {
            player1ImageElement.src = playerImage[0];
        }
        if(!platformIDs[1] || !playerImage[1]){
            console.error("Invalid platform ID:", platformIDs[1]);
            player2ImageElement.src = "./images/Placeholder.png"; // Fallback image
        } else {
            player2ImageElement.src = playerImage[1];
        }

        player2NameElement.innerText = playerNames[1];
        player2NameElement.style.opacity = '1';

        window.setPlayerChannels(await getTwitchID(platformIDs[0]), await getTwitchID(platformIDs[1]));

        // set player containers
        playerContainersElement.style.opacity = '1';
        playerBoundsElement.style.opacity = '1';
        tugOfWarElement.style.opacity = '1';
    } else {
        console.error("Player name elements not found in the DOM");
    }
    // Additional code to fetch and update player images and other elements
}

export { setOverlay, getTwitchID };