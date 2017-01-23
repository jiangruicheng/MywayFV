var ws ,userid; 
var pays={};
var ordernum;
var price;
var ptype = 'wxpay'; 
var w=null;
var url = '';
document.addEventListener('plusready',function(){
   ws = plus.webview.currentWebview();
   userid = plus.storage.getItem('userid');
   orderid = ws.orderid;
   var html ="";
   var xhtml = ""; 
// plus.nativeUI.showWaiting();
   $.ajax({
   	type:"get",
   	url:apiRoot+"/home/order/orderdetails",
   	data : {
   		orderid : orderid
   	},
   	dataType:'json',
   	success:function(data){
   		console.log(JSON.stringify(data))
   		$('#name').text(data.res.shouperson);
   		$('#phone').text(data.res.phone);
   		$('#addr').text(data.res.useraddr);
   		$('#dindan').text(data.res.orderdanhao);
   		$('#yanse').text(data.res.yanse);
   		$('#numbe').text(data.res.numbe);
   		$('#beizhu').text(data.res.beitext);
   	    html += '<li class="mui-table-view-cell mui-media" onclick=goodsdetails('+data.res.goodsid+')>'+
				'<img class="mui-media-object mui-pull-left" src="'+webRoot+data.rew.litpic+'" />'+
				'<div class="mui-media-body"><span class="font-14">'+data.rew.title+'</span>'+
				'<p style="margin-top: 10px;">'+
				'<span style="color: #DC4949;">¥'+data.rew.price+'</span></p></div></li>';
		$('.kong').html(html)	
	switch(data.res.orderss){ 
		case '1':
		xhtml +='<li class="mui-table-view-cell">合计：¥'+data.res.heji+'';
		xhtml +='<button type="button" class="mui-btn" style="right: 22%;" onclick=quxiao('+data.res.id+')>取消订单</button>'+
				'<button type="button" class="mui-btn xx" onclick = fukuan('+data.res.id+','+data.res.heji+') >付款</button>';
		break;
		case '2':
		xhtml +='<li class="mui-table-view-cell">合计：¥'+data.res.heji+'<button type="button" class="mui-btn xx">等待发货</button>'
		break;
		case '3':
		 xhtml +='<li class="mui-table-view-cell">合计：¥'+data.res.heji+'';
		 xhtml +='<button type="button" class="mui-btn" style="right: 30%;" onclick=wuliu('+data.res.id+')>查看物流</button>'+
				 '<button type="button" class="mui-btn xx">确认收货</button>';
		break;
		case '4':
		xhtml +='<li class="mui-table-view-cell">合计：¥'+data.res.heji+'<button type="button" class="mui-btn xx" onclick=orderrate('+data.res.id+')>评价</button>'
		break;
		case '5':
		xhtml +='<li class="mui-table-view-cell">合计：¥'+data.res.heji+'<span style="float: right;">已完成</span></li>'
		break;
		default:
		xhtml +='<li class="mui-table-view-cell">合计：¥'+data.res.heji+'<span style="float: right;">已取消</span></li>'
		break;
	}
	$('#zhuant').html(xhtml);

   	},error:function(e){
   		
   	}
   });

})
function goodsdetails(id){
	
}
//评价
function orderrate(id){
	plus.webview.create('./order-rate.html','order-rate.html',{},{orderid : id}).show('pop-in',200);
}
//取消
function quxiao(id){
	plus.nativeUI.showWaiting('正在取消，请稍后...');
	$.ajax({
		type:"get",
		url:apiRoot+"/home/order/quxiao/id"+id,
		data : {
			id : id
		},
		dataType:'json',
		success:function(data){ 
			console.log(JSON.stringify(data))
			if(data){ 
				plus.webview.getWebviewById('my-order.html').reload();
				plus.nativeUI.closeWaiting();
				plus.nativeUI.toast('取消成功');
			}
		},error:function(e){
			console.log(JSON.stringify(e))
		}
		
	});
}
//付款
function fukuan(orderid , price){
	plus.nativeUI.actionSheet( {cancel:"取消",buttons:[{title:"微信支付"},{title:"支付宝支付"},]}, function(e){
		console.log( "User pressed: "+e.index );
		var i=e.index;
		if(i==1){ 
			console.log(orderid+","+price);  
//			var type='微信支付';
			var type ="wxpay";
			payment(orderid ,price,type);  
		}else if(i==2){   
//			var type='支付宝支付';
			var type ="alipay"
			console.log(orderid+","+price); 
			payment(orderid ,price,type);  
		}
	});
	// 获取支付通道
	plus.payment.getChannels(function(channels){
		for(var i in channels){
			var channel=channels[i];
			pays[channel.id]=channel;
			checkServices(channel);
		} 
	},function(e){
		outLine("获取支付通道失败："+e.message);
	});

        
}
//支付
function payment(ordernum, price , ptype){
console.log(ordernum+" "+price+" "+ptype);
	//预设订单Id ——> 用户Id+当前时间戳
	orderid = ordernum+new Date().getTime();

	if(w){return;}//检查是否请求订单中
	
	if(ptype == 'alipay'){
//		console.log(webRoot + '/pay/Alipay.php?orderid=' + orderid + '&price='+price);
		url = webRoot + '/pay/Alipay.php?orderid=' + orderid + '&price='+price;
	}else if(ptype == 'wxpay'){
//		console.log(webRoot + '/pay/index.php?orderid=' + orderid + '&price='+price);
		url = webRoot + '/pay/index.php?orderid=' + orderid + '&price='+price;
	}
	w = plus.nativeUI.showWaiting('支付中...',{width:'80px',height:'80px',background:'rgba(0,0,0,0.3)'});
	console.log(w);
	// 请求支付订单
	var xhr=new XMLHttpRequest();
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		switch (xhr.readyState) {
			case 4:
			w.close();  
			w = null;
			if (xhr.status == 200) { 
				var order = xhr.responseText;
//				console.log(JSON.stringify(pays[ptype]));
//				console.log(order);
				plus.payment.request(pays[ptype], order, function(result) { 
					//对订单进行操作
					console.log('支付成功');
					paying(ordernum);
				}, function(e) {
					console.log("提示", null, "支付失败");
					console.log("["+e.code+"]："+e.message);
				});
			} else { 
				plus.nativeUI.toast("获取订单信息失败！", null, "捐赠");
			}
			break;
		default:
			break;
		}
	}
	xhr.open('GET', url);
	xhr.send();
}
/*
 * 修改订单状态
 * 
 * 
 */

function paying(orderid){
	$.ajax({
		type:"get",
		url:apiRoot+"/home/order/xiuorder",
		data : { 
			orderid : orderid
		},
		dataType:'json',
		success:function(data){
           ws.reload();
		},error:function(e){
			
		}
		
	});
}