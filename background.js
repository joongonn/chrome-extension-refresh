var interval = 5; // seconds
var beep = new Audio("beep.wav");
var monitor = {};

function updateBadge(tab) {
    chrome.browserAction.setBadgeText({
        text: monitor[tab.id] ? interval.toString() : '',
        tabId: tab.id
    });
}

function addMonitor(tabId) {
    monitor[tabId] = setInterval(function() {
        if (monitor[tabId]) {
            chrome.tabs.reload(tabId);
        }
    }, interval * 1000);
}

function removeMonitor(tabId) {
    clearInterval(monitor[tabId]);
    delete monitor[tabId];
}

chrome.browserAction.onClicked.addListener(function (tab) {
    if (monitor[tab.id]) {
        // disable
        removeMonitor(tab.id);
    } else {
        // enable
        addMonitor(tab.id);
    };

    updateBadge(tab);

    if (monitor[tab.id]) {
        chrome.tabs.reload(tab.id);
    }
});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (monitor[tabId] === undefined) monitor[tabId] = false;

    if (changeInfo.status == 'complete') {
        updateBadge(tab);
        
        if (monitor[tabId]) {
            chrome.tabs.executeScript(tab.id, {
                file: 'check.js'
            }, function(results) {
                var hasJob = results[0];
                if (hasJob) {
                    beep.play();
                    removeMonitor(tab.id);
                    updateBadge(tab);
                }
            });
        }
    }
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    if (monitor[tabId]) {
        removeMonitor(tabId);
    }
});

