var lrd = 1;

var defaultSettings = {
  toolbar_button_def_lr: "right",
  tab_context_def_lrd: "left",
  page_context_def_lrd: "disabled",
  toolsmen_def_lrd: "right",
  keyboard_def_lrd: "right"
};

function checkStoredSettings(storedSettings) {
  if (!storedSettings.toolbar_button_def_lr || !storedSettings.tab_context_def_lrd || !storedSettings.page_context_def_lrd ||
      !storedSettings.toolsmen_def_lrd || !storedSettings.keyboard_def_lrd) {
    chrome.storage.sync.set(defaultSettings);
  }
}

const getStoredSettings = chrome.storage.sync.get(Object.keys(defaultSettings), checkStoredSettings);

function onCreated() {
  if (chrome.runtime.lastError) {
    console.log(`Error: ${chrome.runtime.lastError}`);
  } else {
    //console.log("Context menu entry created successfully.");
  }
}

function onSuccess(tab) {
  //console.log(`Created new tab here: ${tab.index}`);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function openTabs(tabs) {
  for (let tab of tabs) {
    //console.log(tab.index);
    //console.log(lrd);
    if (lrd < 2){
      chrome.tabs.create({index: ((lrd == 0) ? tab.index : (tab.index + 1))});
    }
  }
  lrd = 1;
}

function createMenus(){

  function createPageContextMenu(setting) {
    if(setting.page_context_def_lrd != "disabled"){
      chrome.contextMenus.create({
        id: "NTH-page",
        title: "Open TewTabHere",
        contexts: ["all"]
      }, onCreated)
    }
  }

  function createTabContextMenu(setting) {
    if(setting.tab_context_def_lrd != "disabled"){
      if(chrome.contextMenus.ContextType.TAB)
      {
        chrome.contextMenus.create({
          id: "NTH-tab",
          title: "Open NewTabHere",
          contexts: [chrome.contextMenus.ContextType.TAB]
        }, onCreated)
      }
    }
  }

  function createFileMenuEntry(setting) {
    if(setting.tab_context_def_lrd != "disabled"){
      chrome.contextMenus.create({
        id: "NTH-menu",
        title: "Open TewTabHere",
        contexts: ["all"],
      }, onCreated);
    }
  }

  var getting1 = chrome.storage.sync.get(["page_context_def_lrd"], createPageContextMenu);

  var getting2 = chrome.storage.sync.get(["tab_context_def_lrd"], createTabContextMenu);

  var getting3 = chrome.storage.sync.get(["toolsmen_def_lrd"], createFileMenuEntry);


  chrome.contextMenus.onClicked.addListener(
    function(info, tab) {
      switch (info.menuItemId) {
      case "NTH-page":
        function setLRD(pos){
          if(pos.page_context_def_lrd == "left"){
            lrd = 0;
          }
          if(pos.page_context_def_lrd == "right"){
            lrd = 1;
          }
          if(pos.page_context_def_lrd == "disabled"){
            lrd = 2;
          }
          openTabs([tab]);
          //console.log(pos);
        }
        var getting = chrome.storage.sync.get(["page_context_def_lrd"], setLRD);
        break;
      case "NTH-tab":
        function setLRD(pos){
          if(pos.tab_context_def_lrd == "left"){
            lrd = 0;
          }
          if(pos.tab_context_def_lrd == "right"){
            lrd = 1;
          }
          if(pos.tab_context_def_lrd == "disabled"){
            lrd = 2;
          }
          openTabs([tab]);
          //console.log(pos);
          //console.log(pos.tab_context_def_lrd);
        }
        var getting = chrome.storage.sync.get(["tab_context_def_lrd"], setLRD);
        break;
      case "NTH-menu":
        function setLRD(pos){
          if(pos.toolsmen_def_lrd == "left"){
            lrd = 0;
          }
          if(pos.toolsmen_def_lrd == "right"){
            lrd = 1;
          }
          if(pos.toolsmen_def_lrd == "disabled"){
            lrd = 2;
          }
          openTabs([tab]);
          //console.log(pos);
          //console.log(pos.tab_context_def_lrd);
        }
        var getting = chrome.storage.sync.get(["toolsmen_def_lrd"], setLRD);
        break;
      }
    })

  }

  createMenus();

  chrome.commands.onCommand.addListener(function(command) {
    if (command == "new-tab-here") {
      function setLRD(pos){
        if(pos.keyboard_def_lrd == "left"){
          lrd = 0;
        }
        if(pos.keyboard_def_lrd == "right"){
          lrd = 1;
        }
        if(pos.keyboard_def_lrd == "disabled"){
          lrd = 2;
        }
        var querying = chrome.tabs.query({currentWindow: true, active: true}, openTabs);
      }
      var getting = chrome.storage.sync.get("keyboard_def_lrd", setLRD);
      //console.log("Opening new tab (keyboard shortcut)");
    }
  });

  chrome.browserAction.onClicked.addListener(function() {
    function setLRD(pos){
      if(pos.toolbar_button_def_lr == "left"){
        lrd = 0;
      }
      if(pos.toolbar_button_def_lr == "right"){
        lrd = 1;
      }
      var querying = chrome.tabs.query({currentWindow: true, active: true}, openTabs);
      //console.log(pos);
    }

    var getting = chrome.storage.sync.get(["toolbar_button_def_lr"], setLRD);

    //console.log("Opening new tab (toolbar button)");
  });
