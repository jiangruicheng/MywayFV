/**
 * ------------------------------------------
 * 通用函数
 * ------------------------------------------
 */
mui.init();
mui.plusReady(function() {
	plus.navigator.setStatusBarBackground('#3385FF'); //设置状态栏背景色
	plus.webview.currentWebview().setStyle({
		scrollIndicator: 'none'
	}); //关闭滑动条显示	

	//首页返回键处理
	//处理逻辑：1秒内，连续两次按返回键，则退出应用；
	var first = null;
	var showMenu = null;
	mui.back = function() {
		if (showMenu) {
			closeMenu();
		} else {
			//首次按键，提示‘再按一次退出应用’
			if (!first) {
				first = new Date().getTime();
				mui.toast('再按一次退出应用');
				setTimeout(function() {
					first = null;
				}, 1000);
			} else {
				if (new Date().getTime() - first < 1000) {
					plus.runtime.quit();
				}
			}
		}
	};
})