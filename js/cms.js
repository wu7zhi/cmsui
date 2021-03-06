var cms = {};

//常量定义
cms.constant = {
    //每页查询条数
    rowsNum : 10
}


cms.isPhone = (window.navigator.platform != "Win32");
cms.isAndroid = (window.navigator.userAgent.indexOf('Android') >= 0 ) ? true : false;

/**
 * ajax请求数据 返回json数据
 *
 * type 请求方式 POST或 GET
 * url 取数据地址
 * params 请求数据的方法,是一个对象，如：｛params:newBook,ac1:bookinfo｝
 * message 请求数据时的提示消息,可以是字符串，空字符串''，null。如果为null，则请求没有toast弹窗
 * callback 回调函数，返回请求到的数据及所传的参数params
 */
cms.ajax = function(type, url, params, message, callback) {
    console.log("url:" + url + ' params:' + JSON.stringify(params));
    if ( typeof (message) == "string") {
        cms.toast(message);
    }
    if (!cms.isDefine(callback)) {
        callback = function() {
        }
    }

    appcan.ajax({
        url : url,
        type : type,
        //timeout : 10000,
        data : params,
        dataType : "text",
        appVerify : true,
        headers : {
            "x-mas-app-info" : cms.getLocVal('GetAppId') + "/" + cms.getLocVal('sessionId')
        },
        success : function(ret, status, xhr) {
            ret = ret.replace(/&quot;/g, "\"");
            cms.closeToast();
            if (ret == null || "" == ret) {
                callback("error", "success");
                return false;
            }
            try {
                var data = JSON.parse(ret);
            } catch (e) {
                uexWindow.resetBounceView(0);
                uexWindow.resetBounceView(1);
                cms.toast("抱歉！加载失败,请检查您的网络", 2000);
                callback("error", "success");
                return false;
            }

            if (status == "success") {
                uexWindow.resetBounceView(0);
                uexWindow.resetBounceView(1);
                callback(data, params);
            } else {
                cms.toast("抱歉！加载失败,请检查您的网络", 2000);
                callback("error", "success");
                return false;
            }
        },
        error : function(xhr, status, errMessage) {
            uexWindow.resetBounceView(0);
            uexWindow.resetBounceView(1);
            cms.toast("抱歉！加载失败,请检查您的网络", 2000);
            callback(status, "error");
            return false;
        }
    });
}
/**
 * @param name    窗口名称
 * @param url     窗口路径
 * @param aniId   打开动画
 * @param anim    动画执行时间
 * @param type    窗口类型
 */
cms.openWindow = function(name, url, aniId, anim, type) {
    appcan.window.open({
        name : name,
        data : url,
        aniId : aniId >= 0 ? aniId : 10,
        animDuration : anim >= 0 ? anim : 300,
        type : type >= 0 ? type : 0,
        dataType : 0,
        width : 0,
        height : 0
    });
}
/**
 * 显示加载框
 * @param String mes 显示的提示语
 * @param String position toast显示的位置,默认剧中
 * @param String time  toast执行的时间(毫秒), 如果该参数不为空则没有进度条
 */
cms.toast = function(message, time, position) {
    uexWindow.toast( time ? 0 : 1, position ? position : 5, message ? message : "加载中，请稍后...", time ? time : 0);
}
/**
 * 手动关闭加载框
 */
cms.closeToast = function() {
    uexWindow.closeToast();
}
/**
 * localStorage保存数据
 * @param String key  保存数据的key值
 * @param String value  保存的数据
 */
cms.setLocVal = function(key, value) {
    window.localStorage[key] = value;
}
/**
 * 根据key取localStorage的值
 * @param Stirng key 保存的key值
 */
cms.getLocVal = function(key) {
    if (window.localStorage[key])
        return window.localStorage[key];
    else
        return "";
}
/**
 * 清除本地缓存
 *  @param Stirng key 要清除的key值，可以为数组，可以为一个字符串，可以为空，为空则清除所有的缓存
 */
cms.removeLocVal = function(key) {
    if ( typeof (key) == "string") {
        window.localStorage.removeItem(key);
    } else if ( typeof (key) == "object") {
        for (index in key) {
            window.localStorage.removeItem(key[index]);
        }
    } else {
        window.localStorage.clear();
    }
}
//用于监听安卓返回按键
cms.listenBack = function() {
    uexWindow.onKeyPressed = function(keyCode) {
        if (keyCode == 0) {
            uexWidget.finishWidget('');
        }
    }
    uexWindow.setReportKey(0, 1);
}
/***
 * 使弹动重置为初始位置
 * @param String type 弹动的类型 0-顶部弹动  1-底部弹动
 */
cms.resetBV = function(type) {
    uexWindow.resetBounceView(type);
}
/***
 * 复制内容到剪贴板
 * @param str 要复制的内容
 */
cms.copy = function(str) {
    str = str.toString();
    uexClipboard.copy(str);
    cms.toast("复制成功", 1500);
}
/***
 * 拨打电话
 * @param tel 要拨打的电话号码
 */
cms.call = function(tel) {
    tel = tel.replace(/-/g, '');
    tel = tel.replace(/(^\s*)|(\s*$)/g, '');
    uexCall.call(tel);
}
/*
 * 底部弹出窗口选择拨打或复制电话
 * @param officePhone 办公电话
 * @param mobileNo 移动电话
 * @param type不为空的任意字符拨打电话，默认为复制
 */
cms.showcall = function(officePhone, mobileNo, type) {
    var title = cms.isDefine(type) ? "联系方式" : "联系方式";
    var isCall = cms.isDefine(type) ? true : false;
    if ((officePhone == '' || officePhone == null) && (mobileNo == '' || mobileNo == null)) {
        cms.toast('暂无联系方式', 1000);
    } else {
        var reg = /\d{7,}/g;
        if (officePhone && mobileNo) {
            var mbilno = mobileNo.replace('-','').replace('(','').replace(')','').match(reg)[0];
            var telno = officePhone.replace('-','').replace('(','').replace(')','').match(reg)[0];

            uexWindow.cbActionSheet = function(opId, dataType, data) {
                if (data == 0) {
                    if (isCall) {
                        cms.call(telno);
                    } else {
                        cms.copy(telno);
                    }
                } else if (data == 1) {
                    if (isCall) {
                        cms.call(mbilno);
                    } else {
                        cms.copy(mbilno);
                    }
                } else {

                }
            };
            uexWindow.actionSheet(title, "取消", "" + telno + "," + mbilno + "");
        } else if (officePhone) {
            var telno = officePhone.replace('-','').replace('(','').replace(')','').match(reg)[0];
            uexWindow.cbActionSheet = function(opId, dataType, data) {
                if (data == 0) {
                    if (isCall) {
                        cms.call(telno);
                    } else {
                        cms.copy(telno);
                    }
                } else {
                }
            };
            uexWindow.actionSheet(title, "取消", "" + telno + "");
        } else if (mobileNo) {
            var mbilno = mobileNo.replace('-','').replace('(','').replace(')','').match(reg)[0];
            uexWindow.cbActionSheet = function(opId, dataType, data) {
                if (data == 0) {
                    if (isCall) {
                        cms.call(mbilno);
                    } else {
                        cms.copy(mbilno);
                    }
                } else {
                }
            }
            uexWindow.actionSheet(title, "取消", "" + mbilno + "");
        }
    }
}
/**
 * 在其他窗口中执行指定主窗口中的代码
 * @param String wn  需要执行代码窗口的名称
 * @param String scr 需要执行的代码
 */
cms.uescript = function(wn, scr) {
    uexWindow.evaluateScript(wn, '0', scr);
}
/**
 * 在其他窗口中执行指定浮动窗口中的代码
 * @param String wn  需要执行代码浮动窗口所在的主窗口的名称
 * @param String pn  需要执行代码的浮动窗口的名称
 * @param String scr 需要执行的代码
 */
cms.ueppscript = function(wn, pn, scr) {
    uexWindow.evaluatePopoverScript(wn, pn, scr);
}
/*
 * 返回顶部
 */
cms.scrollToTop = function() {
    var x = document.body.scrollTop || document.documentElement.scrollTop;
    var timer = setInterval(function() {
        x = x - 100;
        if (x < 100) {
            x = 0;
            window.scrollTo(x, x);
            clearInterval(timer);
        }
        window.scrollTo(x, x);
    }, "10");
}
/*根据传入的时间,生成友好的时间显示方式
 * 传入时间格式为:
 * 2015-11-05 09:34:25
 * 2015-11-05T09:34:25
 * 2015/11/5 19:41:44
 * 不兼容格式化：20141010 13:34:57
 * 返回日期显示方式逻辑如下：
 * 1.当天日期只显示时间
 * 2.昨天和前天日期显示：昨天 时间
 * 3.更早日期只显示月，日
 */
cms.parserTime = function(times) {
    //把日期以：隔开。替换所有的：/,-,T为：
    times = times.replace(/\//g, ":");
    times = times.replace(/\-/g, ":");
    times = times.replace(/\T/g, ":");
    times = times.replace(" ", ":");
    times = times.split(":");
    //重新组合需比较日期
    var inDate = times[0] + '-' + times[1] + '-' + times[2];
    //yyyy-MM-dd
    var inTime = times[3] + ':' + times[4];
    //HH:MM:SS
    var d = new Date();
    var nowDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    //判断年份-今年
    if (times[0] == d.getFullYear()) {
        if (cms.difftime(nowDate, inDate) == 0) {
            dd = inTime;
        } else if (cms.difftime(nowDate, inDate) == 1) {
            dd = '昨天  ' + inTime;
        } else if (cms.difftime(nowDate, inDate) == 2) {
            dd = '前天  ' + inTime;
        } else {
            dd = parseInt(times[1]) + "月" + parseInt(times[2]) + "日";
        }
    } else {
        dd = times[0] + '/' + parseInt(times[1]) + '/' + parseInt(times[2]);
    }
    return dd;
}
/**
 *比较两个日期相差的天数，可为负值
 *time1和time2是2002-12-18格式
 **/
cms.difftime = function(time1, time2) {
    var aDate,
        oDate1,
        oDate2,
        iDays;
    aDate = time1.split("-");
    oDate1 = new Date(aDate[0], aDate[1] - 1, aDate[2]);
    aDate = time2.split("-");
    oDate2 = new Date(aDate[0], aDate[1] - 1, aDate[2]);
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24);
    if ((oDate1 - oDate2) < 0) {
        return -iDays;
    }
    return iDays;
}
/**
 *  日期格式转换，输出指定格式
 * @param dateStr 日期字符串 支持格式：
 *  2016-02-03 12:22:34
 *  2016/02/03 12:22:34
 *  2016年02月03日 12:22:34
 *  1472639579（10位的unix时间戳）
 *  20160912
 *  20160912 09:12:34
 * @param type 转换类型 d：反回日、md:返回月日、ymd：返回年月日、hi：返回时分、his：返回时分秒
 * @param separate 分隔符。 分隔符为 ch时返回时间类型如：2016年08月09日
 */
cms.strToDate = function(dateStr, type, separate) {
    dateStr = cms.trim(dateStr.toString());
    if (!cms.isDefine(separate)) {
        separate = "";
    }
    var date;
    if (dateStr.indexOf("年") > 0) {
        var str = dateStr.replace(/日/g, "")
        date = new Date(Date.parse(str.replace(/年|月/g, "/")));
    } else if (dateStr.indexOf("-") > 0 || dateStr.indexOf("/") > 0) {
        date = new Date(Date.parse(dateStr.replace(/-/g, "/")));
    } else if (dateStr.length == 10) {
        date = new Date(dateStr * 1000);
    } else if (dateStr.length == 8 || dateStr.length == 17) {
        var str = dateStr.substring(0, 4) + "/" + dateStr.substring(4, 6) + "/" + dateStr.substring(6, 8) + " " + dateStr.substring(8);
        date = new Date(Date.parse(str));
    } else {
        date = new Date(dateStr);
    }
    //year
    var y = date.getFullYear();
    //month
    var m = date.getMonth() + 1;
    //day
    var d = date.getDate();
    //hour
    var h = date.getHours();
    //minute
    var i = date.getMinutes();
    //second
    var s = date.getSeconds();
    m = m < 10 ? "0" + m : m;
    d = d < 10 ? "0" + d : d;
    if (type == "d") {
        return d;
    } else if (type == "y") {
        return y;
    } else if (type == "md") {
        if (separate == "ch") {
            return m + "月" + d + "日";
        } else {
            return m + separate + d;
        }
    } else if (type == "ymd") {
        if (separate == "ch") {
            return y + "年" + m + "月" + d + "日";
        } else {
            return y + separate + m + separate + d;
        }
    } else if (type == "hi") {
        if (separate == "ch") {
            return h + "时" + i + "分";
        } else {
            return h + ":" + i;
        }
    } else if (type == "his") {
        if (separate == "ch") {
            return h + "时" + i + "分" + s + "秒";
        } else {
            return h + ":" + i + ":" + s;
        }
    } else {
        if (separate == "ch") {
            return y + "年" + m + "月" + d + "日 " + h + "时" + i + "分" + s + "秒";
        } else {
            return y + separate + m + separate + d + " " + h + ":" + i + ":" + s;
        }
    }
}
/**
 * 统计当前输入字数在指定的输入区域显示
 * obj 当前输入框对象
 * @param currentNum 统计字数区域ID
 * @param spanId 显示总共可输入字数区域ID
 * @param wordNumber 限制的输入字数， 字数超过限制变红
 */
cms.countChar = function(obj, currentNum, totalNum, wordNumber) {
    var length = $.trim($(obj).val()).length;
    $(currentNum).html(length);
    if (length > wordNumber) {
        $(currentNum).addClass("sc-text-active");
    } else {
        $(currentNum).removeClass("sc-text-active");
    }
}
/**
 *将中间部分隐藏
 * @param str 要转换的数据
 * @param n要隐藏几个数字
 */
cms.hiddenPart = function(str, n) {
    n = cms.isDefine(n) ? n : 4;
    var str = cms.trim(str).toString();
    var len = str.length;
    var begin = parseInt((len - n) / 2);
    var sign = "";
    for (var i = 0; i < n; i++) {
        sign += "*";
    }
    var reg = new RegExp("^(\\d{" + begin + "})\\d{" + n + "}(\\d{" + (len - begin - n) + "})$");
    str = str.replace(reg, "$1" + sign + "$2");
    return str;
}
/**
 *滑动的选项卡
 * @param navId 选项卡区域ID
 */
cms.slideTab = function(navId, callback) {
    'use strict';
    var tagNav,
        tagBar,
        tagLi,
        timer,
        i,
        n,
        m,
        speed,
        changeWidth;
    speed = 0;
    tagNav = $(navId)[0];
    tagLi = $(navId).children().first().children();
    tagBar = $(navId).children().last()[0];
    tagBar.style.width = tagLi[0].offsetWidth + 'px';

    function slide(n, m) {
        timer = setInterval(function() {
            speed = (n - tagBar.offsetLeft) / 5;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            if (tagBar.offsetLeft === n) {
                clearInterval(timer);
            } else {
                tagBar.style.left = tagBar.offsetLeft + speed + 'px';
            }

            changeWidth = m - tagBar.offsetWidth;
            changeWidth = changeWidth > 0 ? Math.ceil(speed) : Math.floor(speed);
            tagBar.style.width = m + changeWidth + 'px';
        }, 20);
    }

    for ( i = 0; i < tagLi.length; i += 1) {
        tagLi[i].onclick = function() {
            clearInterval(timer);
            slide(this.offsetLeft, this.offsetWidth);
        }
    }
}
/**
 * 去掉字符串首尾空格
 * str 传入的字符串
 */
cms.trim = function(str) {
    str = str.toString();
    var count = str.length;
    var st = 0;
    var end = count - 1;

    if (str == "")
        return str;
    while (st < count) {
        if (str.charAt(st) == " ")
            st++;
        else
            break;
    }
    while (end > st) {
        if (str.charAt(end) == " ")
            end--;
        else
            break;
    }
    return str.substring(st, end + 1);
}
/**
 *去掉所有空格
 */
cms.trimAll = function(str) {
    return str.replace(/\s+/g, "");
}
/**
 * 判断是否是空
 * @param value
 */
cms.isDefine = function(value) {
    if (value == null || value == "" || value == "undefined" || value == undefined || value == "null" || value == "(null)" || value == 'NULL' || typeof (value) == 'undefined') {
        return false;
    } else {
        value = value + "";
        value = value.replace(/\s/g, "");
        if (value == "") {
            return false;
        }
        return true;
    }
}
/**
 * 点击提示已选中，改变的是背景色
 * id 要改变的元素
 * ac 增加的class
 * rc 移除的class
 */
cms.changeBc = function(id, ac, rc) {
    $(id).addClass(ac);
    setTimeout(function() {
        $(id).removeClass(rc);
    }, 200);
}
/*
 * 折叠面板
 * id 当前折叠面板的ID
 * firstIsOpen 第一项默认是否展开。true：展示开，为空或则其它值不展开
 */
cms.accordion = function(id, firstIsOpen) {
    var title = $("#" + id + " dl dd>div:first-child");
    var content = $("#" + id + " dl dd>div:last-child");

    //第一项默认是否展开
    if (firstIsOpen) {
        var firstContent = $(content[0]);
        firstContent.prev().css("background-color", "#eee");
        firstContent.height("100%");
        $(title.find(".fmoa-angle-down")[0]).addClass("transform180");
    }

    title.tap(function() {
        var obj = $(this).next();
        var height = obj[0].scrollHeight;
        title.css({
            "background-color" : "#fff"
        });
        content.css({
            "height" : "0px",
            "overflow" : "hidden"
        });
        title.find(".fmoa-angle-down").removeClass("transform180");
        if ($(this).next().height() > 0) {
            $(this).attr("data-flag", "0");
            $(this).css("background-color", "#fff");
            $(this).next().css({
                "height" : 0
            });
        } else {
            $(this).attr("data-flag", "1");
            $(this).children().next().addClass("transform180");
            $(this).css("background-color", "#eee");
            $(this).next().css({
                "height" : height
            });
        }
    });
}
/**
 *  底部弹出框
 */
cms.popup = function() {
    appcan.window.disableBounce();
    $(".cms-popup").removeClass("uhide");
    var content = $(".cms-popup>div:last-child");
    var height = content[0].scrollHeight;
    content.css("height", height);
    $(".cms-popup>.shade").tap(function() {
        close();
    });
    var close = function() {
        appcan.window.enableBounce();
        content.css("height", "0");
        setTimeout(function() {
            $(".cms-popup").addClass("uhide");
        }, 300);
    }
    return close;
}
/**
 *根据数据条数与每页多少条数据计算页数
 * totalnum 总条数
 * limit 每页多少条
 * return 返回总页数
 */
cms.pageCount = function(totalnum, limit) {
    return totalnum > 0 ? ((totalnum < limit) ? 1 : ((totalnum % limit) ? (parseInt(totalnum / limit) + 1) : (totalnum / limit))) : 0;
}
/**
 * 将数字每3位之间用“,”号分割
 * number 要转换的数据
 */
cms.formatNum = function(number) {
    var str = number.toString();
    var newStr = "";
    var count = 0;
    if (str.indexOf(".") == -1) {
        for (var i = str.length - 1; i >= 0; i--) {
            if (count % 3 == 0 && count != 0 && str.charAt(i) != '-') {
                newStr = str.charAt(i) + "," + newStr;
            } else {
                newStr = str.charAt(i) + newStr;
            }
            count++;
        }
        //自动补小数点后两位
        str = newStr + ".00";
        return str;
    } else {
        for (var i = str.indexOf(".") - 1; i >= 0; i--) {
            if (count % 3 == 0 && count != 0 && str.charAt(i) != '-') {
                newStr = str.charAt(i) + "," + newStr;
            } else {
                newStr = str.charAt(i) + newStr;
            }
            count++;
        }
        str = newStr + str.substr(str.indexOf("."), 3);
        return str;
    }
}
/**
 * 加水印
 * id 要加水印区域的ID
 * zindex 优先级别
 * opacity 透明度
 * marginTop 水印离顶部的高度
 */
cms.watermarkWord = function(id, zindex, opacity, marginTop) {
    zindex = typeof (zindex) == "undefined" ? -999 : zindex;
    opacity = typeof (opacity) == "undefined" ? 0.2 : opacity;
    marginTop = typeof (marginTop) == "undefined" ? 0 : marginTop;

    var screenHeight = window.screen.height;
    var watermarkImg = '../images/watermark.png';
    var MainInformation = '';
    var watermarkText = '';
    try {
        MainInformation = JSON.parse(cms.getLocVal('LoginInformation'));
        watermarkText = MainInformation.info.username;
    } catch (e) {
        watermarkText = 'APPCAN、HTML5 UI';
    }
    var stepHeight = '';
    var position = '';
    var step = '';
    if (id == "body") {
        //固定在body上的水印
        stepHeight = parseInt(screenHeight / 250);
        position = "fixed";
    } else {
        stepHeight = parseInt($(id).height() / 250);
        position = "absolute";
    }
    if(cms.isAndroid){
        step = 250;
    }else{
        step = 150;
    }
    for (var i = 0; i <= stepHeight*2; i++) {
        var top = i * step;
        var html = '';
        if (i == 0) {
            html += '<div class="ub watermark-word" style="height:250px;z-index:' + zindex + ';width:100%;text-align:center;opacity:' + opacity + ';color:#000;position:'+ position +';top:' + marginTop + 'px;font-size:2em;transform:rotate(-30deg); -ms-transform:rotate(-30deg); -o-tranform:rotate(-30deg); -webkit-transform:rotate(-30deg); -moz-transform:rotate(-30deg);filter:progid:DXImageTransform.Microsoft.Alpha(opacity=10));">';
        } else {
            html += '<div class="ub watermark-word" style="height:250px;z-index:' + zindex + ';width:100%;text-align:center;opacity:' + opacity + ';color:#000;position:'+ position +';top:' + top + 'px;font-size:2em;transform:rotate(-30deg); -ms-transform:rotate(-30deg); -o-tranform:rotate(-30deg); -webkit-transform:rotate(-30deg); -moz-transform:rotate(-30deg);filter:progid:DXImageTransform.Microsoft.Alpha(opacity=10));">';
        }
        html += '   <div class="ub-f1 ub-con">';
        html += '       <div class="ub-f1 uf">' + watermarkText + '<br><img style="width:8em;" src="../images/watermark.png"></div>';
        html += '   </div>';
        html += '   <div class="ub-f1 ub-con">';
        html += '       <div class="ub-f1 uf">' + watermarkText + '<br><img style="width:8em;" src="../images/watermark.png"></div>';
        html += '   </div>';
        html += '</div>';
        $(id).append(html);
    }
}
/**
 *RSA加密
 */
cms.RSAEncrypt = function(password) {
    setMaxDigits(129);
    var RSAPublicKeyExponent = '010001',
        RSAPublicKeyModulus = '94DFF4EBD542AB89F192BEA48D4678DF81749766BA0E6B4659202AD8B05D32104729D9A8856D252FF97168CAA0A9156749D43EBA1A8EDB1064E5E4F12B135A9B37528948C27CF41B189282653FB9355660C8D6FB2F0F3D1E213D40CE977A9764300ED4AB84E61506BDA1AABA283EA4B68C34B5B6CA7C82FF4BE019F8F78869EF';
    var key = new RSAKeyPair(RSAPublicKeyExponent, "", RSAPublicKeyModulus);
    return encryptedString(key, password);
    //return password;
};

/**
 * 下载文件
 *@String url 下载路径
 *@String name   保存的文件名及格式 例：file.jpg
 *@funciton cb   下载成功后的回调函数
 **/
var did = 1000;
cms.downloadFile = function(url, name, cb) {
    url = decodeURI(url);
    url = encodeURI(url);
    did++;
    var saveUpdate = "wgt://data/" + name;
    uexDownloaderMgr.onStatus = function(opCode, fileSize, percent, status) {
        //alert("opCode:"+opCode+" fileSize:"+fileSize+" percent:"+percent+" status:"+status)
        switch(status) {
        case 0:
            var str = '下载进度：' + percent + ' %';
            if (fileSize == -1)
                str = '下载中，请稍候...';
            cms.toast(str);
            break;
        case 1:
            uexDownloaderMgr.closeDownloader(opCode);
            cms.closeToast();
            cb(saveUpdate);
            break;
        case 2:
            uexDownloaderMgr.closeDownloader(opCode);
            break;
        }
    }
    uexDownloaderMgr.cbCreateDownloader = function(opCode, dataType, data) {
        if (data == 0) {
            uexDownloaderMgr.download(opCode, url, saveUpdate, '0');
        } else {
            alert("创建失败");
        }
    }

    uexFileMgr.cbIsFileExistByPath = function(opId, dataType, data) {
        if (cms.isDefine(data)) {
            cb(saveUpdate);
        } else {
            did++;
            uexDownloaderMgr.createDownloader(did);
        }
    }
    uexFileMgr.isFileExistByPath(did, saveUpdate);
}
/*
 * 获取文件的真实路径
 * path 文件路径
 * cb 回调函数
 */
cms.getRealPath = function(path, cb) {
    uexFileMgr.realPath = function(p) {
        if (cb)
            cb(p);
    }
    uexFileMgr.getFileRealPath(path, "realPath");
}
//压缩文件
var opidZip = 2000;
cms.unzipFile = function(path) {
    var zipPath = path.substring(0, path.lastIndexOf('.')).toLowerCase();
    uexFileMgr.cbIsFileExistByPath = function(opId, dataType, data) {
        if (data) {
            cms.zipRead(zipPath)
        } else {
            opidZip++;
            uexZip.cbUnZip = function(opCode, dataType, data) {
                if (data == 0) {
                    cms.zipRead(zipPath);
                } else {
                    cms.toast('解压失败', 2000);
                }
            }
            uexZip.unzip(path, zipPath);
        }
    }
    uexFileMgr.isFileExistByPath(opidZip, zipPath);
}
//打开文件管理器
cms.zipRead = function(zipPath) {
    uexFileMgr.cbExplorer = function(opId, dataType, data) {
        var fileType = data.substring(data.lastIndexOf('.') + 1).toLowerCase();
        if (fileType == ("zip") || fileType == (".7z")) {
            cms.unzipFile(data);
        } else if (data != '') {
            uexDocumentReader.openDocumentReader(data);
        }
    }
    uexFileMgr.explorer(zipPath)
}
