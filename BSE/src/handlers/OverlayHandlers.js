async function getImage(platformID) {
    try {
        const response = await fetch(`https://api.beatkhana.com/api/users/${platformID}`);
        if (!response.ok) {
            // new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.avatarUrl;
    } catch (error) {
        console.error("Failed to fetch image:", error);
        return "./images/Placeholder.png"; // Fallback image
    }
}

export async function getGuid(platformID) {
    try {
        const response = await fetch(`https://api.beatkhana.com/api/users/${platformID}`);
        if (!response.ok) {
            // new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.guid;
    } catch (error) {
        console.error("Failed to fetch image:", error);
        return "./images/Placeholder.png"; // Fallback image
    }
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

        // set player containers
        playerContainersElement.style.opacity = '1';
        playerBoundsElement.style.opacity = '1';
        tugOfWarElement.style.opacity = '1';
    } else {
        console.error("Player name elements not found in the DOM");
    }
    // Additional code to fetch and update player images and other elements
}

export { setOverlay };