var ws, uid, name, nickname, total=0, payment = 1, orderid, money=0, number=1;
var webpage, parentid, message, ftype;
function ready_red(){
	ws = plus.webview.currentWebview();
	webpage = ws.webpage;
	parentid = plus.webview.getWebviewById(webpage);
	ftype = ws.ftype;
	
	if(ftype == 0){
		$('#number').val(1);
		$('#number').parent().parent().hide();/*私人发单个红包*/
	}
	
	uid = plus.storage.getItem('userid');
	nickname = (plus.storage.getItem('usersni') || '');
	console.log(uid+' '+nickname);
//	getOrderId();/*获取交易单号*/
	getMoney();/*获取当前余额*/
	
	$('#money').bind('input propertychange', function() {
		$('#total').text('¥'+ ($(this).val() ? parseFloat($(this).val()).toFixed(2) : '0.00'));
	})
	
}

/*获取当前余额*/
function getMoney() {
	field = 'usersmoney';/*所需字段*/
	$.ajax({ 
		type:"post",
		url:apiRoot+'?m=Home&c=User&a=getInformation',
		async:true,
		dataType:"json",
		data:{
			uid:uid,
			field:field
		},
		success:function(data){
			console.log(JSON.stringify(data));
			if(data.status == 1){
				total = data.info;
				if(parseFloat(total) <= 0){
					plus.nativeUI.alert('当前余额为￥0.00元，无法发红包，请前往充值后再试', function(){}, official, "确定" );
					$('button').css('background','gray');
				}else{
					$('#ok').on('tap',checkMoney);
				}
			}
		},
		error:function(e){
			errortoast();
		}
	})
}

/*检查金额*/
function checkMoney() {	
	number = $('#number').val();
	money = $('#money').val();
	message = ($('#message').val() || '恭喜发财，大吉大利！');
	if(!number.match(p3) || number <1){
		toast('红包个数不正确');
		setTimeout(function () {
			$('#number').focus();
		},50);
		return false;		
	}else if(!money.trim() || !money.match(m)){
		toast('金额不正确');
		setTimeout(function () {
			$('#money').focus();
		},50);
		return false;
	}else if(parseFloat(money) > parseFloat(total)){
		plus.nativeUI.alert('余额不足！当前余额为：￥'+ total +'元', function(){
			setTimeout(function () {
				$('#money').focus();
			},50);
			return false;		
		}, official, "确定" );
	}else if(parseFloat(money).toFixed(2)/number <0.01){
		toast('红包个数不正确，每个红包金额不能低于￥0.01元');
		setTimeout(function () {
			$('#number').focus();
		},50);
		return false;			
	}else{
		money = parseFloat(money).toFixed(2);
		savePayment();/*保存交易*/
	}
}

/*获取交易单号*/
//function getOrderId () {
//	showWating('请稍后...',10000);
//	$.ajax({
//		type: "post",
//		url: apiRoot + "?m=Home&c=Payment&a=payfor_getid",
//		dataType:'json',
//		data:{uid:uid},
//		cache:false,
//		success: function(data) {
//			orderid = data.orderid;console.log(orderid);
//			plus.nativeUI.closeWaiting();
//		},
//		error:function(e){
//			times++;
//			if(times<3){
//				getOrderId();
//			}else{
//				plus.nativeUI.alert( "网络不稳定，暂不能支付，请稍后再试", function(){}, official, "确定" );
//			}
//		}
//	})		
//}


/*保存交易*/
function savePayment () {
	plus.nativeUI.showWaiting('正在发红包',8000);
	
	remark = '用户：'+ (nickname || '新用户' ) + '，发出红包￥'+ money + '元，个数：' + number;
	setRed();/*分配红包*/
//	$.ajax({
//		type: "post",
//		url: apiRoot + "?m=Home&c=Payment&a=setLoosechange",
//		data: {
//			uid: uid,
//			money: money,
//			payment:payment,
//			type:2,/*支出*/
////			orderid:orderid,
//			remark:remark
//		},
//		dataType: 'json',
//		success: function(data) {
//			plus.nativeUI.closeWaiting();
//			if(data.status == 1){
//				setRed();/*分配红包*/
//			}else{console.log(JSON.stringify(data));
//				plus.nativeUI.alert((data.msg || '获取交易单号失败，请稍后再试'), function(){}, official, "确定" );
//			}
//		},
//		error: function(e) {
//			errortoast();
//		}
//	});	
}

/*分配红包*/
function setRed () {
	$.ajax({
		type: "post",
		url: apiRoot + "?m=Home&c=Red&a=setRed",
		data: {
			uid: uid,
			money: money,
			number:number,
//			orderid:orderid,
			remark:message
		},
		dataType: 'json',
		success: function(data) {
			plus.nativeUI.closeWaiting();
			if(data.status == 1){
				console.log(data.pid+' '+message);
				mui.fire(parentid,'changeVal',{redid:data.pid,message:message});/*在聊天界面发红包*/
				setTimeout(function () {
					ws.close();
				},1000);				
			}else{
				toast('分配红包失败');
			}
		},
		error: function(e) {
			errortoast();
		}
	});	
}



if(window.plus){
	ready_red();
}else{
	document.addEventListener('plusready',ready_red,false);
}