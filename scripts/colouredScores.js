function get_colour_from_score(value) {
    if (value > 50) {
        value = 50;
    }
    else if (value < 0) {
        if (value < -5) {
            // Poo tier score
            return 'rgb(92,64,51)';
        }
        value = 0;
    }

    const green = 255 * (value / 50);
    const red = 255 * ((50 - value) / 50);
    return 'rgb(' + red.toString() + ',' + green.toString() + ',0)';
}

function colour_scores() {
    // default value = true
    chrome.storage.sync.get({
        colouredScoresSetting: true,
    }, (items) => {
        if (items.colouredScoresSetting) {
            const lockedInScores = Array.from(document.getElementsByClassName('points complete'));
            const provisionalScores = Array.from(document.getElementsByClassName('points provisional'));

            // If we're looking at a live gameweek
            if (lockedInScores.length > 0 || provisionalScores.length > 0) {
                // todo
            }
            else {
                // If we're looking at a past gameweek
                const scores = Array.from(document.getElementsByClassName('points'));
                if (scores.length > 0) {
                    scores.forEach(scoreElement => {
                        const score = parseInt(scoreElement.textContent.trim(), 10);
                        if (score > 60) {
                            //Gold tier score, with a fancy gradient
                            scoreElement.style.background = 'radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%)';//, radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%);';
                        }
                        else {
                            scoreElement.style.backgroundColor = get_colour_from_score(score);
                        }
                    });
                }
            }
        }
    });
}

colour_scores()