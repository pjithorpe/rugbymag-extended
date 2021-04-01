function show_live_total() {
    // default value = true
    chrome.storage.sync.get({
        liveScoresSetting: true,
    }, (items) => {
        if (items.liveScoresSetting) {
            const lockedInScores = Array.from(document.getElementsByClassName('points complete'));
            const provisionalScores = Array.from(document.getElementsByClassName('points provisional'));
            const cancelledScores = Array.from(document.getElementsByClassName('points cancelled'));
            const allScores = lockedInScores.concat(provisionalScores).concat(cancelledScores);

            if (allScores.length > 0) {
                var total = 0;
                allScores.forEach(scoreElement => {
                    // try to detect strange elements elsewhere on the page that have a 'points' class, so we can ignore them
                    if (!(scoreElement.classList.contains('column') || scoreElement.classList.length > 3)) {
                        // add points to total
                        total += parseInt(scoreElement.textContent.trim(), 10);
                    }
                });

                // Find the fields in the heading stats block
                const gameweekStatsFields = document.getElementsByClassName('row stats')[0].children[0].children[1].children[0].children;
                // Find the gameweek points field
                const gameweekPointsField = Array.from(gameweekStatsFields).find(x => x.hasChildNodes && Array.from(x.children).some(y => y.textContent.includes('GW Points')));
                // Get the element that actually contains the text with the points value
                const gameweekPointsElement = Array.from(gameweekPointsField.children).find(x => x.classList.contains('text-right'));
                // Add our calculated total
                const totalPointsStr = gameweekPointsElement.textContent;
                const valueIndex = totalPointsStr.search(/\S|$/); //searches for position of first non-whitespace char
                gameweekPointsElement.textContent = totalPointsStr.slice(0, valueIndex) + "(~" + total.toString() + ") " + totalPointsStr.slice(valueIndex);
            }
        }
    });
}

show_live_total()