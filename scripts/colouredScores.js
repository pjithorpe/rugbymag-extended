function set_colour_from_score(element, value) {
    if (value > 50) {
        if (value > 60) {
            //Gold tier score, with a fancy gradient
            element.classList.add('goldTier');
            return;
        }
        value = 50;
    }
    else if (value < 0) {
        if (value < -5) {
            // Poo tier score
            element.style.backgroundColor = 'rgb(92,64,51)';
            return;
        }
        value = 0;
    }

    const green = 255 * (value / 50);
    const red = 255 * ((50 - value) / 50);
    element.style.backgroundColor = 'rgb(' + red.toString() + ',' + green.toString() + ',0)';
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
                        set_colour_from_score(scoreElement, score);
                    });
                }
            }
        }
    });
}

colour_scores()