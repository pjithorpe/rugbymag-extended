function show_live_total() {
    // default value = true
    chrome.storage.sync.get({
        liveScoreTotals: true,
    }, (items) => {
        console.log("boop");
        if (items.liveScoreTotals) {
            console.log("beep");
            const lockedInScores = Array.from(document.getElementsByClassName('points complete'));
            const provisionalScores = Array.from(document.getElementsByClassName('points provisional'));
            const allScores = lockedInScores.concat(provisionalScores);

            if (allScores.length > 0) {
                var total = 1;
                allScores.forEach(scoreElement => {
                    total += parseInt(scoreElement.textContent.trim(), 10);
                });
                const gameweekPointsElement = document.querySelector("body > section.user-squad.thin > div:nth-child(2) > div.small-12.column.right > div.row.stats > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div.small-5.column.text-right");
                const totalPointsStr = gameweekPointsElement.textContent;
                const valueIndex = totalPointsStr.search(/\S|$/); //searches for position of first non-whitespace char
                gameweekPointsElement.textContent = totalPointsStr.slice(0, valueIndex) + "(~" + total.toString() + ") " + totalPointsStr.slice(valueIndex);
            }
        }
    });
}

show_live_total()