var NOTEPAD_AUTOSAVE_DELAY_MS = 1000;
var TAB_INSERT_STRING = '  ';

$(document).ready(onReady);

function onReady() {
    setI18NText();
    $(document).mousedown(onMouseDown);
    $(document).mouseup(onMouseUp);
    $('#notepad')
        .keyup(onNotepadKeyUp)
        .keydown(onNotepadKeyDown)
        .val(loadSetting('notepadContent', ''))
        .focus();

    var lastSavedDateVal = loadSetting('notepadSavedAt');
    if (lastSavedDateVal) {
        setLastSavedText(lastSavedDateVal);
    }
}

function onNotepadKeyUp(evt) {
    TimeoutManager.reset('saveNotepad', saveNotepad, NOTEPAD_AUTOSAVE_DELAY_MS);
}

function onNotepadKeyDown(evt) {
    if (evt.keyCode == 9) {
        evt.stopPropagation();
        $('#notepad').insertAtCaret(TAB_INSERT_STRING);
        return false;
    }

    if (evt.keyCode == 83 && evt.ctrlKey) {
        saveNotepad();
        evt.stopPropagation();
        return false;
    }
}

function saveNotepad() {
    saveSetting('notepadContent', $('#notepad').val());

    var dateVal = Date.now();
    saveSetting('notepadSavedAt', dateVal);

    setLastSavedText(dateVal);
}

function setLastSavedText(dateVal) {
    var dateText = new Date(dateVal).toString().replace(/ GMT.+/, '');
    $('#lastSavedAt').text(dateText);
}

var lockScrollInterval;

function onMouseDown() {
    // inhibit mouse-dragging from scrolling the sidebar panels container
    lockScrollInterval = setInterval(function() {
        parent.manager.scrollToCurrentSidebarPanel(true);
    }, 0);
}

function onMouseUp() {
    // inhibit mouse-dragging from scrolling the sidebar panels container
    clearInterval(lockScrollInterval);
}
