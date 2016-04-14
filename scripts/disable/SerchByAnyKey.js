var swt_strKeyword = '', swt_range, swt_bSpecFunc = false;
var swt_windows = new Array(), swt_curFrsIndex;
var swt_e, swt_altLeft, swt_altKey, swt_ctrlKey;
var swt_msg = new Array(
    '特殊功能已开启！',         //  0
    '特殊功能已关闭！',         //  1
    '找到关键字！',             //  2
    '找不到关键字！',           //  3
    '已跳过网页开头！',         //  4
    '已跳过网页末尾！',         //  5
    '已清除关键字！',           //  6
    '已复制选择文本到剪贴板！', //  7
    '已剪切选择文本到剪贴板！', //  8
    '特殊功能: 已',             //  9
    '开启',                     // 10
    '关闭',                     // 11
    '关键字:',                  // 12
    '信息:',                    // 13
    '设置从头开始新的搜索。'    // 14
);
swt_getAllWindows(window);
swt_attachEvent();

function swt_getAllWindows(win) {
    swt_windows.push(win);
    var frs = win.frames;
    if (frs) for (var i = 0; i < frs.length; i++) swt_getAllWindows(frs[i]);
}
function swt_attachEvent() {
    var nWindow = swt_windows.length;
    for (var i = 0; i < nWindow; i++) {
        swt_windows[i].document.attachEvent('onkeydown', swt_keydown);
        swt_windows[i].document.attachEvent('onkeyup', swt_keyup);
        swt_windows[i].document.attachEvent('onclick', swt_click);
    }
}
function swt_click() {
    swt_getEvent();
    if (swt_e && swt_e.keyCode == 0 && swt_strKeyword.length > 0)
        swt_clearKeyword('');
}
function swt_keydown() {
    swt_getEvent();
    if (swt_e) {
        swt_altLeft = swt_e.altLeft;
        swt_altKey = swt_e.altKey;
        swt_ctrlKey = swt_e.ctrlKey;
    }
}
function swt_keyup() {
    if (!swt_e) return;
    if (/^(INPUT|TEXTAREA)$/.test(swt_e.srcElement.tagName)) return;
    if (!swt_confirm(swt_e)) return;
    if (swt_bSpecFunc) {
        swt_interpret(swt_e.keyCode);
        return;
    }
    var s = swt_convert(swt_e.shiftKey, swt_e.keyCode);
    if (s == null) return;
    swt_strKeyword += s;
    if (!swt_searchNextNoCollapse(false)) swt_clearKeyword(swt_msg[3]);
}
function swt_confirm(e) {
    if (swt_ctrlKey) {
        if (e.keyCode == 17) {
            if (!swt_clearKeyword('')) {
                swt_range.move('textedit', -1);
                swt_showStatusInfo(swt_msg[14]);
            }
            return false;
        } else swt_ctrlKey = false;
    }
    if (e.ctrlKey) return false;
    if (swt_altKey) {
        if (e.keyCode == 18) {
            swt_searchNext(!swt_altLeft);
            external.gbSendKey('\x1b\x1b');
            return false;
        } else swt_altKey = false;
    }
    if (e.altKey) return false;
    if (!e.shiftKey && e.keyCode == 192) {
        swt_bSpecFunc = !swt_bSpecFunc;
        swt_showStatusInfo(swt_bSpecFunc ? swt_msg[0] : swt_msg[1]);
        return false;
    }
    return true;
}
function swt_getEvent() {
    if (swt_curFrsIndex != null && swt_windows[swt_curFrsIndex].event) return;
    var nWindow = swt_windows.length;
    for (var i = 0; i < nWindow; i++) {
        if (swt_windows[i].event) {
            if (swt_curFrsIndex != i) {
                swt_curFrsIndex = i;
                swt_e = swt_windows[i].event;
                var odoc = swt_e.srcElement.ownerDocument;
                if (!odoc) odoc = swt_e.srcElement;
                swt_range = odoc.body.createTextRange();
            }
            break;
        }
    }
}
function swt_searchKeyword(bForward) {
    if (!bForward && swt_range.findText(swt_strKeyword) || bForward && swt_range.findText(swt_strKeyword, -10000000)) {
        swt_range.select();
        swt_showStatusInfo(swt_msg[2]);
        return true;
    } else return false;
}
function swt_searchNext(bForward) {
    if (swt_range && swt_strKeyword.length > 0) {
        swt_range.collapse(bForward);
        if (!swt_searchKeyword(bForward)) {
            swt_range.move('textedit', bForward ? 1 : -1);
            if (swt_searchKeyword(bForward))
                swt_showStatusInfo(bForward ? swt_msg[4] : swt_msg[5]);
            else swt_clearKeyword(swt_msg[3]);
        }
    }
}
function swt_searchNextNoCollapse(bForward) {
    if (swt_range && swt_strKeyword.length > 0) {
        if (!swt_searchKeyword(bForward)) {
            swt_range.move('textedit', bForward ? 1 : -1);
            if (swt_searchKeyword(bForward)) {
                swt_showStatusInfo(bForward ? swt_msg[4] : swt_msg[5]);
                return true;
            } else swt_clearKeyword(swt_msg[3]);
            return false;
        }
        return true;
    }
    return false;
}
function swt_clearKeyword(msg) {
    swt_bSpecFunc = false;
    if (swt_strKeyword.length > 0) {
        swt_showStatusInfo(msg + swt_msg[6]);
        swt_strKeyword = '';
        return true;
    } else return false;
}
function swt_interpret(code) {
    switch(code) {
        case 49:    // Key 1
            swt_range.expand('character');  // expand selected text a character
            swt_range.select();
            break;
        case 50:    // Key 2
            swt_range.expand('word');   // expand selected text a word
            swt_range.select();
            break;
        case 51:    // Key 3
            swt_range.expand('sentence');   // expand selected text a sentence
            swt_range.select();
            break;
        case 52:    // Key 4
            swt_range.expand('textedit');   // expand selected text to entire page
            swt_range.select();
            break;
        case 65:    // Key A
            swt_searchNext(true);     // search previous keyword
            break;
        case 67:    // Key C
            external.gbExec(57634); // "Edit->Copy Ctrl+C"
            swt_showStatusInfo(swt_msg[7]);
            break;
        case 68:    // Key D
            swt_searchNext(false);     // search next keyword
            break;
        case 71:    // Key G
            external.gbExec(33047);     // search selected text or open selected text as webpage
            break;
        case 72:    // Key H
            external.gbExec(33221);     // highlight selected text
            break;
        case 81:    // Key Q
            swt_clearKeyword('');
            swt_showStatusInfo(swt_msg[1] + swt_msg[6]);
            break;
        case 83:    // Key S    // search the last keyword
            swt_range.move('textedit');
            swt_searchNextNoCollapse(true);
            break;
        case 84:    // Key T
            external.gbExec(57635); // "Edit->Cut Ctrl+T"
            swt_showStatusInfo(swt_msg[8]);
            break;
        case 86:    // Key V
            external.gbExec(57637); // "Edit->Paste Ctrl+V"
            break;
        case 87:    // Key W     // search the first keyword
            swt_range.move('textedit', -1);
            swt_searchNextNoCollapse(false);
            break;
        case 88:    // Key X
            external.gbExec(33154); // increase page size; Ctrl + NumPad+
            break;
        case 90:    // Key Z
            external.gbExec(33155); // decrease page size; Ctrl + NumPad-
            break;
    }
}
function swt_convert(bShift, code) {    //convert event.keyCode to String
    if (code <= 57 && code >= 48) return bShift ? ')!@#$%^&*('.charAt(code - 48) : String.fromCharCode(code);
    else if (code <= 90 && code >= 65) return String.fromCharCode(code + 32);
    else if (code <= 107 && code >= 96) return '0123456789*+'.charAt(code - 96);
    else if (code <= 111 && code >= 109) return '-./'.charAt(code - 109);
    else if (code <= 192 && code >= 186) return (bShift ? ':+<_>?~' : ';=,-./`').charAt(code - 186);
    else if (code <= 222 && code >= 219) return (bShift ? '{|}\"' : '[\\]\'').charAt(code - 219);
    else return null;
}

var swt_statusTimeout;
function swt_showStatusInfo(msg) {
    window.status = swt_msg[9] + (swt_bSpecFunc ? swt_msg[10] : swt_msg[11]) + '    ' + swt_msg[12] + swt_strKeyword + (msg ? '    ' + swt_msg[13] + msg:'');
    window.clearTimeout(swt_statusTimeout);
    swt_statusTimeout = window.setTimeout('swt_clearStatus();', 3000);
}
function swt_clearStatus() {
    window.status = '';
}
