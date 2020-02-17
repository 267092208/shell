/**
 * 从服务器返回的日期字符串转为Date对象
 * @param {string} value
 * @returns {Date} 
 */
export function FromMSJsonString (value) {
    if (!value || typeof (value) != "string") return value;
    var d = eval("new " + (value.replace(/\//g, "")));
    return d;
}

/**
 * 日期格式化
 * @param {string} fmt 格式(yMdhms)
 */
export function DateFormat (date, fmt) {
    var o = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}