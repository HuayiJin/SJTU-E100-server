// 最大化时保存弹窗的位置大小
var preDialogWidth = 0; 
var preDialogHeight = 0;
var preDialogLeft = "0px";
var preDialogTop = "0px";
// 页面初始化
$(function () {
    // 常用功能
    // $(".dlg_btn_close").bind("click", hideDialog);    

    // 最大化 || 还原
    $(".dlg_btn_max_top").bind("click", maxDialog);
    $(".dlg_btn_reback_top").bind("click", rebackDialog);
});

function initHoverWindowBySuffix(suffix, curSubmit, curClose) {
    // 常用功能
    $(".dlg_btn_close").bind("click", hideDialog);    
    $("#dlg_submit"+suffix).bind("click", curSubmit);
    $("#dlg_close"+suffix).bind("click", curClose);

    // 移动
    $("#dialog"+suffix).bind("mousedown", moveHandler);

}

// 还原
function rebackDialog() {
    el_dialog = $("#dialog")[0];
    el_dialog.style.left = preDialogLeft;
    el_dialog.style.top = preDialogTop;
    el_dialog.style.width = preDialogWidth + "px";
    el_dialog.style.height = preDialogHeight + "px";

    $(this).blur();
    $(this).removeClass("dlg_btn_reback_top").addClass("dlg_btn_max_top");
    $(".dlg_btn_max_top").unbind("click").bind("click", maxDialog);
}
// 最大化
function maxDialog() {
    el_dialog = $("#dialog")[0];
    preDialogWidth = el_dialog.offsetWidth;
    preDialogHeight = el_dialog.offsetHeight;
    preDialogLeft = el_dialog.style.left;
    preDialogTop = el_dialog.style.top;
    el_dialog.style.left = 0 + "px";
    el_dialog.style.top = 0 + "px";
    el_dialog.style.width = window.innerWidth - 5 + "px";
    el_dialog.style.height = window.innerHeight - 5 + "px";
    $(this).blur();
    $(this).removeClass("dlg_btn_max_top").addClass("dlg_btn_reback_top"); 
    $(".dlg_btn_reback_top").unbind("click").bind("click", rebackDialog);  
}
// 移动
function moveHandler(evt) {
    var $trgt = $(event.target);
    if (!$trgt.hasClass("dlg_top")) return;

    var $this = $(this);
    var el = $this[0];
    var oevent = evt || event;
    var distanceX = oevent.clientX - el.offsetLeft;
    var distanceY = oevent.clientY - el.offsetTop;
    $(document).bind("mousemove", function (evt) {
        var oevent = evt || event;
        el.style.left = oevent.clientX - distanceX + 'px';
        el.style.top = oevent.clientY - distanceY + 'px';
    });
    $(document).bind("mouseup", function () {
        $(document).unbind("mousemove");
        $(document).unbind("mouseup");
    });
}
// 显示弹窗
function showDialog() {
    $("#dialog").show();
}
function showDialogID(idSuffix) {
    $("#dialog"+idSuffix).show();
}
// 隐藏弹窗
function hideDialog() {
    $("#dialog").hide();
}
function hideDialogID(idSuffix) {
    $("#dialog"+idSuffix).hide();
}
// 提交事件
function submitHandler() {
    alert("submit success!");
}

// TODO：拖拽适配
// 拖拽缩放：支持右拉 || 下拉 || 右下拉
window.onload = function () {
    var el_dlg_right_bottom = document.getElementById("dlg_right_bottom");
    var el_dialog = document.getElementById("dialog");
    var minHeight = $(el_dialog).attr("minheight");
    var minWidth = $(el_dialog).attr("minwidth");
    var right = document.getElementById("dlg_right");
    var bottom = document.getElementById("dlg_bottom");
    var mouseStart = {};
    var divStart = {};
    var rightStart = {};
    var bottomStart = {};
    // drag from right
    right.onmousedown = function (ev) {
        var oEvent = ev || event;
        mouseStart.x = oEvent.clientX;
        mouseStart.y = oEvent.clientY;
        rightStart.x = right.offsetLeft;
        if (right.setCapture) {
            right.onmousemove = doDragToRightBottomToRight;
            right.onmouseup = stopDragToRightBottomToRight;
            right.setCapture();
        }
        else {
            document.addEventListener("mousemove", doDragToRightBottomToRight, true);
            document.addEventListener("mouseup", stopDragToRightBottomToRight, true);
        }
    };
    function doDragToRightBottomToRight(ev) {
        var oEvent = ev || event;
        var l = oEvent.clientX - mouseStart.x + rightStart.x;
        var w = l + el_dlg_right_bottom.offsetWidth;
        if (w < el_dlg_right_bottom.offsetWidth) {
            w = el_dlg_right_bottom.offsetWidth;
        }
        else if (w > document.documentElement.clientWidth - el_dialog.offsetLeft) {
            w = document.documentElement.clientWidth - el_dialog.offsetLeft - 2;
        }
        if (w < minWidth) return;
        el_dialog.style.width = w + "px";
    };
    function stopDragToRightBottomToRight() {
        if (right.releaseCapture) {
            right.onmousemove = null;
            right.onmouseup = null;
            right.releaseCapture();
        }
        else {
            document.removeEventListener("mousemove", doDragToRightBottomToRight, true);
            document.removeEventListener("mouseup", stopDragToRightBottomToRight, true);
        }
    };
    // drag from bottom
    bottom.onmousedown = function (ev) {
        var oEvent = ev || event;
        mouseStart.x = oEvent.clientX;
        mouseStart.y = oEvent.clientY;
        bottomStart.y = bottom.offsetTop;
        if (bottom.setCapture) {
            bottom.onmousemove = doDragToRightBottomToBottom;
            bottom.onmouseup = stopDragToRightBottomToBottom;
            bottom.setCapture();
        }
        else {
            document.addEventListener("mousemove", doDragToRightBottomToBottom, true);
            document.addEventListener("mouseup", stopDragToRightBottomToBottom, true);
        }
    };
    function doDragToRightBottomToBottom(ev) {
        var oEvent = ev || event;
        var t = oEvent.clientY - mouseStart.y + bottomStart.y;
        var h = t + el_dlg_right_bottom.offsetHeight;
        if (h < el_dlg_right_bottom.offsetHeight) {
            h = el_dlg_right_bottom.offsetHeight;
        }
        else if (h > document.documentElement.clientHeight - el_dialog.offsetTop) {
            h = document.documentElement.clientHeight - el_dialog.offsetTop - 2;
        }
        if (h < minHeight) return;
        el_dialog.style.height = h + "px";
    };
    function stopDragToRightBottomToBottom() {
        if (bottom.releaseCapture) {
            bottom.onmousemove = null;
            bottom.onmouseup = null;
            bottom.releaseCapture();
        }
        else {
            document.removeEventListener("mousemove", doDragToRightBottomToBottom, true);
            document.removeEventListener("mouseup", stopDragToRightBottomToBottom, true);
        }
    };
    // drag from right bottom
    el_dlg_right_bottom.onmousedown = function (ev) {
        var oEvent = ev || event;
        mouseStart.x = oEvent.clientX;
        mouseStart.y = oEvent.clientY;
        divStart.x = el_dlg_right_bottom.offsetLeft;
        divStart.y = el_dlg_right_bottom.offsetTop;
        if (el_dlg_right_bottom.setCapture) {
            el_dlg_right_bottom.onmousemove = doDragToRightBottom;
            el_dlg_right_bottom.onmouseup = stopDragToRightBottom;
            el_dlg_right_bottom.setCapture();
        }
        else {
            document.addEventListener("mousemove", doDragToRightBottom, true);
            document.addEventListener("mouseup", stopDragToRightBottom, true);
        }
    };
    function doDragToRightBottom(ev) {
        var oEvent = ev || event;
        var l = oEvent.clientX - mouseStart.x + divStart.x;
        var t = oEvent.clientY - mouseStart.y + divStart.y;
        var w = l + el_dlg_right_bottom.offsetWidth;
        var h = t + el_dlg_right_bottom.offsetHeight;
        if (w < el_dlg_right_bottom.offsetWidth) {
            w = el_dlg_right_bottom.offsetWidth;
        }
        else if (w > document.documentElement.clientWidth - el_dialog.offsetLeft) {
            w = document.documentElement.clientWidth - el_dialog.offsetLeft - 2;
        }
        if (h < el_dlg_right_bottom.offsetHeight) {
            h = el_dlg_right_bottom.offsetHeight;
        }
        else if (h > document.documentElement.clientHeight - el_dialog.offsetTop) {
            h = document.documentElement.clientHeight - el_dialog.offsetTop - 2;
        }
        if (w < minWidth) return;
        el_dialog.style.width = w + "px";
        if (h < minHeight) return;
        el_dialog.style.height = h + "px";
    };
    function stopDragToRightBottom() {
        if (el_dlg_right_bottom.releaseCapture) {
            el_dlg_right_bottom.onmousemove = null;
            el_dlg_right_bottom.onmouseup = null;
            el_dlg_right_bottom.releaseCapture();
        }
        else {
            document.removeEventListener("mousemove", doDragToRightBottom, true);
            document.removeEventListener("mouseup", stopDragToRightBottom, true);
        }
    };    
};