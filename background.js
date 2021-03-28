debugger;
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ 
        liveScoreTotals: true,
    });
});