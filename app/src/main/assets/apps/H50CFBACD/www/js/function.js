/**
 * ------------------------------------------
 * 系统函数
 * ------------------------------------------
 */
var system = {};
var plug = {};

system.tool = {}; //工具
system.view = {}; //窗体控制

//效验是否全部数字
system.tool.isDigit = function(s) {
	var patrn = /^[0-9]{1,20}$/;
	if (!patrn.exec(s)) return false;
	return true;
}