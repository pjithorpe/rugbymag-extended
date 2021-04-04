function show_live_total() {
    // default value = true
    chrome.storage.sync.get({
        liveScoresSetting: false,
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
                        const scoreElementText = scoreElement.textContent.trim();
                        // Get all numbers in the text
                        const numbers = [...scoreElementText.matchAll(/\-?[0-9]{1,3}/g)];
                        let pointsText;
                        if (numbers.length > 1) {
                            // Get the second number, as this shows the actual player score
                            pointsText = numbers[1][0];
                        }
                        else {
                            pointsText = numbers[0][0];
                        }
                        total += parseInt(pointsText, 10);
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