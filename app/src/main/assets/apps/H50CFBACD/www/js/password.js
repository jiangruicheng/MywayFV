document.addEventListener('plusready', function() {
	var ws = plus.webview.currentWebview();
	var ii = ws.deid;

	if(ii) {
		var first = null;
		mui.back = function() {
			//首次按键，提示‘再按一次退出应用’
			if(!first) {
				first = new Date().getTime();
				mui.toast('再按一次退出应用');
				setTimeout(function() {
					first = null;
				}, 2000);
			} else {
				if(new Date().getTime() - first < 2000) {
					plus.runtime.quit();
				}
			}
		};
	}

	$('#Regist').on('click', function() {
		var phone = $('#phone').val();
		plus.storage.setItem('phone', phone);
		yanz = $('#yanz').val();
		//	    alert(phone)
		console.log()
		$.ajax({
			type: "get",
			url: apiRoot + "/home/user/verifyUser",
			data: {
				phone: phone,
				yanz: yanz
			},
			dataType: 'json',
			success: function(data) {
				console.log(JSON.stringify(data));
				if(data > 0) {
					plus.webview.create('./password1.html', 'password1.html').show();
				} else {
					plus.nativeUI.toast('验证失败');
				}
			},
			error: function(e) {}

		});
	})

	//获取验证吗
	var tel = 0,
		t = 60,
		tt, t2;
	$('#yanzhenma').unbind('tap');
	$('#yanzhenma').on('tap', getcheck);
	//	var phone = plus.storage.getItem('phone');

	function getcheck() {
		$('#yanzhenma').unbind('tap');
		var phone = $('#phone').val();
		//console.log(apiRoot+'/home/user/sendmessage/phone/'+phone);

		if(!phone) {
			toast('请输入手机号');
			$('#yanzhenma').on('tap', getcheck);
			return false;
		}

		$.ajax({
			type: "get",
			url: apiRoot + "/home/user/sendmessage",
			data: {
				phone: phone
			},
			success: function(data) {
				toast(data);
				setTimeout(time_less, 1000);
				//				toast('验证码发送成功');
			},
			error: function(e) {
				$('#yanzhenma').text('获取验证码');
				$('#yanzhenma').unbind('tap');
				$('#yanzhenma').on('tap', function() {
					getcheck();
				});
			}
		});

	}

	function time_less() {
		t--;
		$('#yanzhenma').text(t);
		if(t <= 0) {
			$('#yanzhenma').unbind('tap');
			$('#yanzhenma').on('tap', function() {
				getcheck();
			});
			$('#yanzhenma').text('重新获取');
			t = 60;
		} else {
			setTimeout(time_less, 1000);
		}
	}

	$('#btn').on('click', function() {
		var pasone = $('#passwordone').val();
		var pastwo = $('#passwordtwo').val();
		var phon = plus.storage.getItem('phone');
		if(!pasone || !pastwo) {
			plus.nativeUI.toast('请输入密码');
			return;
		}
		if(pasone != pastwo) {
			plus.nativeUI.toast('两次密码不一致！');
			return;
		}
		console.log(apiRoot + "/home/user/phonetion/phone/" + phon + "/passeord/" + pasone)
		$.ajax({
			type: "get",
			url: apiRoot + "/home/user/phonetion/phone/" + phon + "/passeord/" + pasone,
			dataType: 'json',
			success: function(data) {
				console.log(JSON.stringify(data));
				if(data.code == 1001) {
					plus.nativeUI.toast('修改成功');
					plus.webview.create('./login.html', 'login.html').show();
				} else if(data.code == 1002) {
					plus.nativeUI.toast(data.cont)
				}

			},
			error: function(e) {
				//console.log(apiRoot+"/Yuezu/User/Registered/phone/"+phon+/pasone/+pasone)
				console.log(JSON.stringify(e));
				plus.nativeUI.toast('失去网络连接');
			}
		});
	})
})