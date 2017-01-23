var webRoot = 'http://app229.51edn.com';
var apiRoot = webRoot + '/api/index.php';
var p1=/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;//手机号码格式验证
var passReg = /^[A-Za-z0-9]{6,16}$/;//验证密码规范

var adminname = "Myway官方";
var adminimg = webRoot+'/api/Public/images/2.png';
var p3 = /^[0-9]$/; //判断是否为数字
var m = /^(([1-9]\d*)|0)(\.\d*)?$/;	//判断金钱
var a = /^([0-9]|[0-9]{2}|100)$/; //年龄
var h = /^[1-2]\d{2}$/; //身高
var w = /^\d{2,3}$/; //体重
var cph = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;//车牌号
var gh = /^((\d{3,4}\-)|)\d{7,8}(|([-\u8f6c]{1}\d{1,5}))$/;//固话
var ema = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; 
var official = 'Myway';/*官方提示文字*/
var sfz=/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
var a = /^(\d{4})-(\d{2})-(\d{2})$/;//日期格式
var xlh=/^[a-b0-9]{12}$/
//获取头像
var getAvatar = function(avatar){
	if(avatar == null || avatar == ''){ 
		return '../public/img/15.jpg';
	}
	return avatar.indexOf('http')<0? (webRoot + avatar) : avatar;
}

//获取头像，身份证照片
var getuserPic = function(pic){
	if(pic == null || pic == ''){ 
		return '';
	}
	if(pic.indexOf('http')<0 && pic.indexOf('../images')>=0){
		return pic;
	}	
	return pic.indexOf('http')<0? webRoot + pic : pic;
}


/**
 * 判断用户是否登录
 * @param {webview} page
 */
var isLogin = function (page){
	var uid =  plus.storage.getItem('userid');
	if(!uid){
		toast('你还未登录');
		plus.webview.create('../view/login.html' , 'login.html' , {} , {spage:page}).show('slide-in-right');
	}
}

//页面跳转
var goUrl = function(url){
	plus.webview.open(url,url,{},'slide-in-right');
}
//去除竖条的滚动条
document.addEventListener('plusready',function(){
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
})
//弹窗
var toast = function(info){
	plus.nativeUI.toast(info);
}
//网络连接失败提示
var errortoast = function(e){
	plus.nativeUI.closeWaiting();
	toast('network connection is failed');
}
//下拉刷新
function PullToRefresh(ws){
	ws=plus.webview.currentWebview();
	ws.setPullToRefresh({support:true,
		height:"50px",
		range:"200px",
		contentdown:{  
			caption:"Pull down to refresh"
		},
		contentover:{
			caption:"Release immediate refresh"
		},
		contentrefresh:{
			caption:"Refreshing..."
		} 
	},function(){
		setTimeout(function(){
			ws.reload();
			ws.endPullToRefresh();
		},1500);
	});
}

//等待窗口
var showWating = function(info , time){
	if(info == null){
		info = 'Loading...';
	}
	if(!time || time==0){
		time = 1000;  
	}
	var waiting = plus.nativeUI.showWaiting(info,{width:'80px',height:'80px',background:'rgba(0,0,0,0.3)'});
	setTimeout(function(){
		if(waiting){
			waiting.close();
		}
	},time);
}    


//压缩图片(路径，新图片额外后缀标识，覆盖原图片，清晰度)
function compressImg(urls,adds,num){
	var all = urls.split('/');
	var name = all.pop();
	var end = name.split('.');
	var type = end.pop();
	var fileName = end.join('.');
	var newImg = all.join('/') +'/'+ fileName + adds + '.' + type;
	plus.zip.compressImage({
			src:urls,
			dst:newImg,
			overwrite:true,
			quality:num
		},
		function() {
			newImg;
		},function(error) {
			newImg = urls;
	});
	return newImg;
}



	function relogin (_self) {
		var all = plus.webview.all();
		for(var i in all){
			if(all[i].id !== plus.runtime.appid && all[i].id !== _self){
				all[i].close();
			}
			if(i == all.length -1){
				goUrl('../index.html');
			}
		}
	}

	function relogin2 (_view) {
		var all = plus.webview.all();
		for(var i in all){
			if(all[i].id !== plus.runtime.appid && all[i].id != 'view/Me.html' && all[i].id != '../index.html'){
				all[i].close();console.log(all[i].id);
			}
			if(i == all.length -1){
				goUrl(_view);
			}			
		}
	}	
	
	function closeWeb (_web) {
		var _this;
		if(typeof(_web) !=='object'){
			_this = plus.webview.getWebviewById(_web);
			if(_this!=null){
				_this.close();
			}			
		}else{
			for(var i in _web){
				_this = plus.webview.getWebviewById(_web[i]);
				if(_this!=null){
					_this.close();
				}
			}
		}
	}
	function reloadWeb (_web) {
		var _this;
		if(typeof(_web) !=='object'){
			_this = plus.webview.getWebviewById(_web);
			if(_this!=null){
				_this.reload();
			}			
		}else{
			for(var i in _web){
				_this = plus.webview.getWebviewById(_web[i]);
				if(_this!=null){
					_this.reload();
				}
			}
		}
	}	
	/**
	 * 与当前时间比较
	 * @param {int} time php时间戳，秒
	 * @param {int} timestamp js时间戳，毫秒
	 */
	function turnTime(time){
		time = parseInt(time);
		var timestamp = Math.ceil(parseInt(new Date().getTime())/1000);
		var less = timestamp - time;
		var rst = '';
		if(less < 90){
			rst = 'A minute ago';
		}else if(less < 3600){
			rst = Math.round(less/60)+' minutes ago';
		}else if(less < 5400){
			rst = 'An hour ago';
		}else if(less < 86400){
			rst = Math.round(less/3600)+' hours ago';	
		}else if(less < 129600){
			rst = 'One day ago';
		}else if(less < 259200){
			rst = Math.round(less/86400)+' days ago';/*3天*/	
		}else{
			var day = new Date(time*1000);
			rst = day.getFullYear()+'-'+(day.getMonth()+1)+'-'+day.getDate();		
		}
		return rst;		
	}
	/**
	 * 与当前时间比较
	 * @param {int} time php时间戳，秒
	 * @param {int} timestamp js时间戳，毫秒
	 */
	function turnMonDay(time){
		time = parseInt(time);
		var timestamp = Math.ceil(parseInt(new Date().getTime())/1000);
		var less = timestamp - time;
		var rst = '';
		if(less < 90){
			rst = 'A minute ago';
		}else if(less < 3600){
			rst = Math.round(less/60)+' minutes ago';
		}else if(less < 5400){
			rst = 'An hour ago';
		}else if(less < 86400){
			rst = Math.round(less/3600)+' hours ago';	
		}else if(less < 129600){
			rst = 'One day ago';
		}else if(less < 259200){
			rst = Math.round(less/86400)+' days ago';/*3天*/			
		}else{
			var day = new Date(time*1000);
			if(new Date().getFullYear() == day.getFullYear()){
				rst = (day.getMonth()+1)+'-'+day.getDate();		
			}else{
				rst = day.getFullYear()+'-'+(day.getMonth()+1)+'-'+day.getDate();		
			}
		}
		return rst;		
	}
	
	/**
	 * 聊天时间
	 * @param {int} time php时间戳，秒
	 * @param {int} timestamp js时间戳，毫秒
	 */
	function turnChatTime(time){
		time = new Date(parseInt(time)*1000);
		var today = new Date();
		if(time.getFullYear() != today.getFullYear()){
			rst = (time.getMonth()+1) +'月'+ time.getDate() +','+ time.getFullYear();
		}else if(time.getMonth() != today.getMonth()){
			rst = (time.getMonth()+1) +'月'+ time.getDate();		
		}else if(time.getDate() == today.getDate()){
			rst = time.getHours() +':'+ time.getMinutes();
		}else if(today.getDate() == time.getDate()+1){
			rst = '昨天 '+ time.getHours() +':'+ time.getMinutes();
		}else if(today.getDate() == time.getDate()+2){
			rst = '前天 '+ time.getHours() +':'+ time.getMinutes();
		}else if(today.getDay() == time.getDay()){
			var week = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日'];
			rst = week2[today.getDay()]+' '+ time.getHours() +':'+ time.getMinutes();
		}else{
			rst = (time.getMonth()+1)  +'月'+ time.getDate();	
		}
		return rst;		
	}
	
	/**
	 * 倒计时
	 * @param {int} time php时间戳，秒
	 * @param {int} timestamp js时间戳，毫秒
	 */
	function downTime(time){
		time = parseInt(time);
		var timestamp = Math.ceil(parseInt(new Date().getTime())/1000);
		var less = time - timestamp;
		var rst = '';
		if(less < 60){
			rst = less+'秒';
		}else if(less < 3600){
			rst = Math.ceil(less/60)+'minutes';
		}else if(less < 86400){
			rst = Math.ceil(less/3600)+'hours';
		}else{
			rst = Math.ceil(less/86400)+'day';/*3天*/
		}
		return rst;		
	}
	/**
	 * 转化时间
	 * @param {int} time php时间戳，秒
	 */
	function turnDay(time){
		time = parseInt(time);
		var day = new Date(time*1000);
		rst = day.getFullYear()+'-'+(day.getMonth()+1)+'-'+day.getDate();		
		return rst;		
	}
	/**
	 * 
	 * 随机生成数组
	 *
	 ***/
    function GetRandomNum(Min,Max){   
	var Range = Max - Min;   
	var Rand = Math.random();   
	return(Min + Math.round(Rand * Range));   
	}   
	var num = GetRandomNum(1,10);   
	var chars = ['0','1','2','3','4','5','6','7','8','9'];
	
	function generateMixed(n) {
	     var res = "";
	     for(var i = 0; i < n ; i ++) {
	         var id = Math.ceil(Math.random()*35);
	         res += chars[id];
	     }
	     return res;
	}
	/**
	 * 防止页面跳转时白频，页面传值
	 * @param {String} url:页面
	 * @param {Object} zhi:传的值
	 */
	function goNewPage(url, zhi){
		var ws = plus.webview.getWebviewById(url); 
		if(ws){//避免多次打开同一个页面
			return false;
		}else{
			//	 console.log(JSON.stringify(zhi))
			if(zhi){
				var newPage = plus.webview.create(url,url,{},zhi);
			}else{
				var newPage = plus.webview.create(url,url);
			}
			newPage.addEventListener('close',function(){
				newPage = null;//页面关闭后可再次打开
			},false);
			//showWating();
			newPage.addEventListener('loaded',function(){
				newPage.show('pop-in',50);
				//plus.nativeUI.closeWaiting();
			},false)
		}
	}
	
