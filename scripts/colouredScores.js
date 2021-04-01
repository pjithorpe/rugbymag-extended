function set_colour_from_score(element, value) {
    // try to detect strange elements elsewhere on the page that have a 'points' class, so we can ignore them
    if (!(element.classList.contains('column') || element.classList.length > 3)) {
        // check if the player has any 'checkers' (captain/kicker etc.)
        if (element.previousElementSibling?.classList?.contains('checkers')) {
            const checkers = element.previousElementSibling?.children;
            if (checkers && checkers.length > 0) {
                // If this player is captain, divide the displayed score by 2
                if (Array.from(checkers).some(x => x.classList.contains('captain'))) {
                    value /= 2;
                }
            }
        }

        // check if the player is on the bench
        const playerElements = element.parentElement?.children;
        if (playerElements && playerElements.length > 0) {
            const playerNumber = Array.from(playerElements).find(x => x.classList.contains('number'));
            if (playerNumber) {
                const jerseyNumber = parseInt(playerNumber.textContent.trim(), 10);
                // If this player is benched, multiply the displayed score by 2
                if (jerseyNumber > 15) {
                    // Note: this calculation may be out by 1, as halved scores are rounded up.
                    value *= 2;
                }
            }
        }

        if (value > 49) {
            //Gold tier 50+ score, with a fancy gradient
            element.classList.add('goldTier');
            return;
        }
        else if (value < -10) {
            value = -10;
        }
    
        value += 10; // So that our gradient goes all the way down to -10
        const green = 255 * (value / 60);
        const red = 255 * ((60 - value) / 60);
        element.style.backgroundColor = 'rgb(' + red.toString() + ',' + green.toString() + ',0)';
    }
}

function set_colours(elements) {
    if (elements && elements.length > 0) {
        elements.forEach(scoreElement => {
            const score = parseInt(scoreElement.textContent.trim(), 10);
            set_colour_from_score(scoreElement, score);
        });
    }
}

function colour_scores() {
    // default value = true
    chrome.storage.sync.get({
        colouredScoresSetting: true,
    }, (items) => {
        if (items.colouredScoresSetting) {
            const lockedInScores = Array.from(document.getElementsByClassName('points complete'));
            const provisionalScores = Array.from(document.getElementsByClassName('points provisional'));
            const cancelledScores = Array.from(document.getElementsByClassName('points cancelled'));
            const allScores = lockedInScores.concat(provisionalScores).concat(cancelledScores);

            // If we're looking at a live gameweek
            if (allScores.length > 0) {
                set_colours(allScores);
            }
            else {
                // If we're looking at a past gameweek
                const scores = Array.from(document.getElementsByClassName('points'));
                set_colours(scores);
            }
        }
    });
}

colour_scores()