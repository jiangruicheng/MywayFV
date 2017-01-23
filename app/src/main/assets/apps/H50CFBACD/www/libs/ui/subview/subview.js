/**
 * ------------------------------------------
 * 导航插件
 * ------------------------------------------
 */
var aniShow = {};
//创建子页面，首个选项卡页面显示，其它均隐藏；
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	for (var i = 0; i < subpages.length; i++) {
		var temp = {};
		var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
		self.append(sub);
		if (i > 0) {
			sub.hide();
		} else {
			temp[subpages[i]] = "true";
			mui.extend(aniShow, temp);
		}
	}

	//当前激活选项
	var activeTab = subpages[0];
	var title = document.getElementById("title");
	//选项卡点击事件
	mui('.mui-bar-tab').on('tap', 'a', function(e) {
		var targetTab = this.getAttribute('href');
		if (targetTab == activeTab) {
			return;
		}
		//更换标题
		title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
		//显示目标选项卡
		//若为iOS平台或非首次显示，则直接显示
		if (mui.os.ios || aniShow[targetTab]) {
			plus.webview.show(targetTab);
		} else {
			//否则，使用fade-in动画，且保存变量
			var temp = {};
			temp[targetTab] = "true";
			mui.extend(aniShow, temp);
			plus.webview.show(targetTab, "fade-in", 300);
		}
		//隐藏当前;
		plus.webview.hide(activeTab);
		//更改当前活跃的选项卡
		activeTab = targetTab;
	});
});