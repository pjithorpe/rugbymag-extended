function add_base_score_to_contents(element, value) {
    const smallText = document.createElement('small');
    smallText.textContent = (value).toString() + '➔';
    smallText.classList.add('smallScore');
    const normalText = document.createTextNode(element.textContent);

    element.textContent = '';
    element.appendChild(smallText);
    element.appendChild(normalText);
}

function get_modification_for_score(element, value) {
    // try to detect strange elements elsewhere on the page that have a 'points' class, so we can ignore them
    if (!(element.classList.contains('column') || element.classList.length > 3)) {
        // check if the player has any 'checkers' (captain/kicker etc.)
        if (element.previousElementSibling?.classList?.contains('checkers')) {
            const checkers = element.previousElementSibling?.children;
            if (checkers && checkers.length > 0) {
                // If this player is captain
                if (Array.from(checkers).some(x => x.classList.contains('captain'))) {
                    add_base_score_to_contents(element, value / 2)
                }
            }
        }

        // check if the player is on the bench
        const playerElements = element.parentElement?.children;
        if (playerElements && playerElements.length > 0) {
            const playerNumber = Array.from(playerElements).find(x => x.classList.contains('number'));
            if (playerNumber) {
                const jerseyNumber = parseInt(playerNumber.textContent.trim(), 10);
                // If this player is benched
                if (jerseyNumber > 15) {
                    // Note: this calculation may be out by 1, as halved scores are rounded up.
                    add_base_score_to_contents(element, value * 2)
                }
            }
        }
    }
}

function get_modifications(elements) {
    if (elements && elements.length > 0) {
        elements.forEach(scoreElement => {
            const score = parseInt(scoreElement.textContent.trim(), 10);
            get_modification_for_score(scoreElement, score);
        });
    }
}

function show_score_modifications() {
    // default value = true
    chrome.storage.sync.get({
        modifiedScoresSetting: true,
    }, (items) => {
        if (items.modifiedScoresSetting) {
            const lockedInScores = Array.from(document.getElementsByClassName('points complete'));
            const provisionalScores = Array.from(document.getElementsByClassName('points provisional'));
            const cancelledScores = Array.from(document.getElementsByClassName('points cancelled'));
            const allScores = lockedInScores.concat(provisionalScores).concat(cancelledScores);

            // If we're looking at a live gameweek
            if (allScores.length > 0) {
                get_modifications(allScores);
            }
            else {
                // If we're looking at a past gameweek
                const scores = Array.from(document.getElementsByClassName('points'));
                get_modifications(scores);
            }
        }
    });
}

show_score_modifications()