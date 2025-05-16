<script lang="ts">
    import { onMount } from "svelte";

    let timeLeft = 900;
    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const minutes = parseInt(urlParams.get('minutes') || "15", 10);
        timeLeft = minutes * 60;
    });
    
    const countdown = setInterval(() => {
        if (timeLeft <= 1) {
            clearInterval(countdown);
            timeLeft = 0;
        } else {
            timeLeft -= 1;
        }
    }, 1000);
    
    function formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }
</script>

<div class="background">
    <h1 class="Countdown">{formatTime(timeLeft)}</h1>
</div>

<style>
    @font-face {
        font-family: 'Rubik';
        src: url('./Font/RubikNorm.ttf') format('truetype');
    }

    .background {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        background: url("/background.png");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        position: absolute;
        top: 0px;
        left: 0px;
        overflow: hidden;
        z-index: -100000;
	}

    .Countdown {
        font-size: 10rem;
        color: white;
        font-family: Rubik, sans-serif;
        text-align: center;     
        margin-top: 10%;
    }
</style>