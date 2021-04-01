chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ 
        liveScoresSetting: true,
        colouredScoresSetting: true,
    });
});