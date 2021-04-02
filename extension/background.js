chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ 
        liveScoresSetting: false,
        colouredScoresSetting: false,
        modifiedScoresSetting: false,
    });
});