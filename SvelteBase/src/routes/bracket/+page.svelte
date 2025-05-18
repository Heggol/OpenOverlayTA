<div class="container">
            <iframe 
                title="ChalloneBracket"
                src="https://challonge.com/bs_elites/module?theme=2&scale_to_fit=1"
                class="bracket"
                allowTransparency={true}
                frameBorder="1"
                scrolling="auto"
                style="width: 72%; height: 100%; border: none;"
            ></iframe>
        </div>

<style>
    .container {
        position: relative;
        width: 1920px;
        height: 1080px;
        background: transparent;
        overflow: hidden;
        isolation: isolate;
    }
    .bracket {
        -webkit-mask-image: linear-gradient(to right, black 50%, black 60%, transparent 70%);
        mask-image: linear-gradient(to right, black 50%, black 60%, transparent 70%);
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
    }
</style>