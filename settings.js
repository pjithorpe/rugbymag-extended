function call_script_on_page(scriptName) {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        var currTab = tabs[0];
        if (currTab) { // Sanity check
            const tabId = currTab.id;
            chrome.scripting.executeScript({
                target: {tabId: tabId, allFrames: true},
                files: [scriptName],
            });
        }
        });
}

// Saves options to chrome.storage
function save_settings() {
    const scoreTotalsOn = document.getElementById('changeLiveScoresSetting').checked;
    chrome.storage.sync.set({
        liveScoreTotals: scoreTotalsOn,
    }, () => {
        if (scoreTotalsOn) {
            call_script_on_page('totalScores.js')
        }
        else {
            call_script_on_page('reloadPage.js')
        }
    });
}
  
// Restores checkbox state using the preferences stored in chrome.storage.
function restore_settings() {
    // default value = true
    chrome.storage.sync.get({
        liveScoreTotals: true,
    }, (items) => {
        document.getElementById('changeLiveScoresSetting').checked = items.liveScoreTotals;
    });
}

document.addEventListener('DOMContentLoaded', restore_settings);
document.getElementById('changeLiveScoresSetting').addEventListener('click', save_settings);