const scriptMappings = {
    'liveScoresSetting': 'scripts/totalScores.js',
    'colouredScoresSetting': 'scripts/colouredScores.js',
    'modifiedScoresSetting': 'scripts/modifiedScores.js',
}

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
function save_setting(settingId) {
    const turnedOn = document.getElementById(settingId).checked;
    chrome.storage.sync.set({
        [settingId]: turnedOn,
    }, () => {
        if (turnedOn) {
            call_script_on_page(scriptMappings[settingId])
        }
        else {
            call_script_on_page('reloadPage.js')
        }
    });
}
  
// Restores checkbox state using the preferences stored in chrome.storage.
function restore_settings() {
    // For all checkboxes
    for (const settingId in scriptMappings) {
        chrome.storage.sync.get({
            // default value = true
            [settingId]: true,
        }, (items) => {
            // Set checkbox to stored setting value
            document.getElementById(settingId).checked = items[settingId];
        });
    }
}

document.addEventListener('DOMContentLoaded', restore_settings);
// For all checkboxes
for (const settingId in scriptMappings) {
    // Add a listener that updates the relevant 
    document.getElementById(settingId).addEventListener('click', () => save_setting(settingId));
}