var jingdu = weidu = 0;
document.addEventListener('plusready',function(){
	var ws = plus.webview.currentWebview();
	var fid = ws.fid;
	var map = new BMap.Map("allmap");
	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
//			var cur_city = r.address.city;//获取当前城市
			jingdu = r.point.lng;//经度
			weidu = r.point.lat;//纬度
//			console.log(id+'---'+jingdu +'---'+ weidu);
			
		}else {
			console.log('failed'+this.getStatus()); 
		}        
	},{enableHighAccuracy: true})
	
		var auths = [];
	var first = null;
	//获取登录权限列表
	plus.oauth.getServices(function(data){
		for(var i in data){
			var service = data[i];    
			auths[service.id] = service;
		}
	} , function(e){
		toast('获取第三方登录失败!');
	})
   var ws = plus.webview.currentWebview();
   var ii = ws.deid;
   if(ii){
   		var first = null;
			mui.back = function() {
				//首次按键，提示‘再按一次退出应用’
				if (!first) {
					first = new Date().getTime();
					mui.toast('再按一次退出应用');
					setTimeout(function() {
						first = null;
					}, 2000);
				} else {
					if (new Date().getTime() - first < 2000) {
						plus.runtime.quit();
					}
				}
			};
   }
   
	
	
	$('#login').on('click',function(){
		
		var phone = $('#phone').val();
		var pas = $('#pass').val();
		
//		if(phone.length >11 || phone.length < 11){
//			plus.nativeUI.toast('请输入正确的手机号');
//			return;
//		}
		if(!phone || !pas){
			plus.nativeUI.toast('不能为空');
			return;
		} 
		plus.nativeUI.showWaiting();
		$.ajax({
			type:'get',
			url:apiRoot+"/home/user/login",
			data : { 
				username : phone,
				userpass : pas
			},
			dataType:'json',
			success:function(data){
				plus.nativeUI.closeWaiting();
				console.log(JSON.stringify(data));
				if(data !=0){
					var sid = data.id;
					//console.log(sid);
					if(jingdu || weidu){
						$.ajax({
							type:"get",
							url:apiRoot +"?m=Home&c=user&a=weizhi",
							data:{
								id:sid,
								jingdu:jingdu,
								weidu:weidu
							},
							dataType:'json',
							success:function(data){
			//					console.log(JSON.stringify(data));
								
							},
							error:function(e){
								console.log(JSON.stringify(e));
							}
						});
					}
					
					plus.storage.setItem('userid',data.aid);
					plus.storage.setItem('userspic',data.userspic);
					plus.storage.setItem('usersni',data.usersni);
		       		plus.webview.close();
		       		startActivity();
					//relogin(plus.webview.currentWebview().id);
				}else{
					plus.nativeUI.toast('账号密码错误');
				}
			},error:function(e){
				console.log(JSON.stringify(e));
			}
		});
		
	})
	//退出登录的判断
	if(fid){
//		var first = null;
		mui.back = function() {
			//首次按键，提示‘再按一次退出应用’
//			if (!first) {
				plus.runtime.quit();
//				first = new Date().getTime();
//				mui.toast('再按一次退出应用');
//				setTimeout(function() {
//					first = null;
//				}, 2000);
//			} 
//			else {
//				console.log(13)
//				if (new Date().getTime() - first < 2000) {
//					plus.runtime.quit();
//				console.log(145);
//				}
//			}
		};
	}
	//第三方登录
	$('.qq').on('click' , function(){
		showWating('登录中...');
		oauthLogin('qq');
	})
	$('.wx').on('click' , function(){
		showWating('登录中...');
		oauthLogin('weixin');
	})
	
    $('.weibo').on('click' , function(){
		showWating('登录中...');
		oauthLogin('sinaweibo');
	})
	 /* 权限认证
	 * @param {Object} id
	 */
	function oauthLogin(id){ 
//		console.log(id+" "+gid);return;
		var s = auths[id];
		if(!s.authResult){
			s.login(function(success){
				plus.nativeUI.showWaiting();
				getAuthsInfo(id);
				return; 
			} , function(e){
				plus.nativeUI.closeWaiting();
				toast('登录认证失败');
				return;
			})       
		}else{ 
			getAuthsInfo(id);
			return; 
		}
	}
	/**
	 * 获取用户信息
	 */
	function getAuthsInfo(id){
		var s = auths[id] , userinfo = null , user = null , avatar = null , openid = null , oauthtype = s.id , name = null , openid = null;
		s.getUserInfo(function(data){
			userinfo = data.target.userInfo;
//			console.log(JSON.stringify(userinfo))
			
			switch(oauthtype){  
				case 'weixin' :  
					avatar = userinfo.headimgurl;//头像 
					name = userinfo.nickname;  
					openid = data.target.authResult.openid;
					break;
				case 'qq' : 
					avatar = userinfo.figureurl_qq_2;//头像 
					name = userinfo.nickname;
					openid = data.target.authResult.openid;
					break;
				case 'sinaweibo':
                    avatar = userinfo.profile_image_url;
                    name = userinfo.screen_name;
					openid = userinfo.idstr;
                    break;
                default:
                    break;	
			}
//			console.log(apiRoot + '?m=home&c=user&a=oauthLogin&openid='+openid +"&userlogo="+avatar+"&title="+name+"&oauthtype="+oauthtype); 
			$.ajax({     
				url : apiRoot + '?m=home&c=user&a=oauthLogin' , 
				type : 'get' ,    
				data : {  
					openid:openid, 
					userlogo : avatar ,  
					title : name ,     
					oauthtype : oauthtype
				} , 
				dataType:'json', 
				success : function(data){ 
						var siid = data.id;
					if(data){
						if(jingdu || weidu){
							$.ajax({
								type:"get",
								url:apiRoot +"?m=Home&c=user&a=weizhi",
								data:{
									id:siid,
									jingdu:jingdu,
									weidu:weidu
								},
								dataType:'json',
								success:function(data){
				//					console.log(JSON.stringify(data));
									
								},
								error:function(e){
									console.log(JSON.stringify(e));
								}
							}); 
						} 
				        plus.storage.setItem('userid',data.id);
				        plus.storage.setItem('usersni',data.usersni);
				        plus.storage.setItem('userspic',data.userspic);
					   	plus.webview.close();
						relogin(plus.webview.currentWebview().id);
					}else{
						plus.nativeUI.toast('获取用户信息失败！');
					}
				} ,
				error : function(e){  
					plus.nativeUI.closeWaiting();
					console.log(JSON.stringify(e));  
					errortoast(e);
				}
			});  
			
		} , function(){
			toast('获取用户信息失败');
			return;
		})  
	}
	
})
function relogin(_self) {
	var all = plus.webview.all();
//	console.log(JSON.stringify(all));
	for(var i in all) {
//		var aaa = plus.runtime.appid;  
		if(all[i].id !== plus.runtime.appid && all[i].id !== _self) {
			all[i].close();   
		}
		if(i == all.length - 1) {
			var nwaiting = plus.nativeUI.showWaiting();//显示原生等待框
			var webviewContent= plus.webview.create('./index.html','index.html');//后台创建webview并打开show.html
			webviewContent.addEventListener("loaded", function() { //注册新webview的载入完成事件
			        nwaiting.close(); //新webview的载入完毕后关闭等待框
			        	plus.nativeUI.closeWaiting()
			        webviewContent.show("slide-in-right",20); //把新webview窗体显示出来，显示动画效果为速度200毫秒的右侧移入动画
			        }, false);
////			plus.webview.create('./index.html','index.html').show('slide-in-right');
		}
	}
}
function startActivity(){
main = plus.android.runtimeMainActivity();
var Intent = plus.android.importClass('android.content.Intent');
var connActivity = plus.android.importClass("com.cndll.myway.hbuildertest.activity.ConnectBleActivity");
var  intent = new Intent(main,connActivity.class);
main.startActivity(intent);
}