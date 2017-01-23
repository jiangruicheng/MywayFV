var ws ,userid; 
var pays={};
var ordernum;
var price;
var ptype = 'wxpay'; 
var w=null;
var url = '';
//var id,user,num,heji,kouwei,shuliang,chose_id,shumu,sid='';
//var orderid;
//var bianhao;
//var dingdanid;
//var shangpin_id = "";
document.addEventListener('plusready',function(){
   ws = plus.webview.currentWebview();
   userid = plus.storage.getItem('userid');
   var html = "";
   var xhtml = ""; 
   var chtml = "";
   var vhtml = ""; 
   var bhtml = "";
   $.ajax({
   	  type:"get",
   	  url:apiRoot+"/home/order/myorders",
   	   data : {
   	   	 userid : userid
   	   },
   	   dataType:'json', 
   	   success:function(data){
   	   	//console.log(JSON.stringify(data)); 
   	   	$.each(data, function(k,v){ 
   	   		
   	   		if(v.orderss == '1'){ 
   	   		var	pay1="fukuan('"+v.id+"','"+v.heji+"')";
   	   			xhtml+= '<ul class="mui-table-view kong"><li class="mui-table-view-cell mui-media" onclick=orderdetails4("'+v.id+'")>'+
					'<img class="mui-media-object mui-pull-left" src="'+webRoot+v.goods.litpic+'" /><div class="mui-media-body">'+
					'<span class="font-14">'+v.goods.title+'</span><p>'+
					'<span style="color: #DC4949;">¥'+v.goods.price+'</span><span style="float: right;">×'+v.numbe+'</span>'+
					'</p></div></li></ul><ul class="mui-table-view"><li class="mui-table-view-cell">'+
					'<span class="font-14">合计：¥'+v.heji+'</span>'+
					'<button type="button" class="mui-btn" style="right: 25%;padding: 4px 12px;" onclick=quxiao('+v.id+')>取消订单</button>'+
					'<button type="button" class="mui-btn xx ord plusready" onclick = "'+pay1+'">付款</button></li></ul>';
					
   	   		}
   	   		if(v.orderss == '2'){
   	   			chtml+= '<ul class="mui-table-view kong"><li class="mui-table-view-cell mui-media" onclick=orderdetails4("'+v.id+'")>'+
					'<img class="mui-media-object mui-pull-left" src="'+webRoot+v.goods.litpic+'" /><div class="mui-media-body">'+
					'<span class="font-14">'+v.goods.title+'</span><p>'+
					'<span style="color: #DC4949;">¥'+v.goods.price+'</span><span style="float: right;">×'+v.numbe+'</span>'+
					'</p></div></li></ul><ul class="mui-table-view"><li class="mui-table-view-cell">'+
					'<span class="font-14">合计：¥'+v.heji+'</span>'+
					'<button type="button" class="mui-btn xx">提醒发货</button></li></ul>';
   	   		}
   	   		if(v.orderss == '3'){ 
   	   			vhtml+= '<ul class="mui-table-view kong"><li class="mui-table-view-cell mui-media" onclick=orderdetails4("'+v.id+'")>'+
					'<img class="mui-media-object mui-pull-left" src="'+webRoot+v.goods.litpic+'" /><div class="mui-media-body">'+
					'<span class="font-14">'+v.goods.title+'</span><p>'+
					'<span style="color: #DC4949;">¥'+v.goods.price+'</span><span style="float: right;">×'+v.numbe+'</span>'+
					'</p></div></li></ul><ul class="mui-table-view"><li class="mui-table-view-cell">'+
					'<span class="font-14">合计：¥'+v.heji+'</span>'+
					'<button type="button" class="mui-btn" style="right: 31%;padding: 4px 12px;" onclick=wuliu()>查看物流</button>'+
					'<button type="button" class="mui-btn xx">确认收货</button></li></ul>';
   	   		}
   	   		if(v.orderss == '4'){ 
   	   			bhtml+= '<ul class="mui-table-view kong"><li class="mui-table-view-cell mui-media" onclick=orderdetails4("'+v.id+'")>'+
					'<img class="mui-media-object mui-pull-left" src="'+webRoot+v.goods.litpic+'" /><div class="mui-media-body">'+
					'<span class="font-14">'+v.goods.title+'</span><p>'+
					'<span style="color: #DC4949;">¥'+v.goods.price+'</span><span style="float: right;">×'+v.numbe+'</span>'+
					'</p></div></li></ul><ul class="mui-table-view"><li class="mui-table-view-cell">'+
					'<span class="font-14">合计：¥'+v.heji+'</span>'+ 
					'<button type="button" class="mui-btn xx" onclick=orderrate("'+v.goodsid+'")>评价</button></li></ul>';
   	   		}
   	   		
   	   			html+= '<ul class="mui-table-view kong"><li class="mui-table-view-cell mui-media" onclick=orderdetails4("'+v.id+'")>'+
					'<img class="mui-media-object mui-pull-left" src="'+webRoot+v.goods.litpic+'" /><div class="mui-media-body">'+
					'<span class="font-14">'+v.goods.title+'</span><p>'+
					'<span style="color: #DC4949;">¥'+v.goods.price+'</span><span style="float: right;">×'+v.numbe+'</span>'+
					'</p></div></li></ul><ul class="mui-table-view"><li class="mui-table-view-cell">'+
					'<span class="font-14">合计：¥'+v.heji+'</span>';
				if(v.orderss ==1 ){
				   	var	pay="fukuan('"+v.id+"','"+v.heji+"')";
				   	html+='<button type="button" class="mui-btn" style="right: 25%;padding: 4px 12px;" onclick=quxiao('+v.id+')>取消订单</button>'+
						  '<button type="button" class="mui-btn xx ord plusready" onclick="'+pay+'">付款</button></li></ul>';
				}
				 if(v.orderss ==2 ){  	
				   	html+=	'<button type="button" class="mui-btn xx">提醒发货</button></li></ul>';
				}
				if(v.orderss ==3){
				   	html+= 	'<button type="button" class="mui-btn" style="right: 31%;padding: 4px 12px;" onclick=wuliu()>查看物流</button>'+
							'<button type="button" class="mui-btn xx">确认收货</button></li></ul>';
				}
				 if(v.orderss ==4){
					html+= '<button type="button" class="mui-btn xx" onclick=orderrate("'+v.goodsid+'")>评价</button></li></ul>';
				 }
				 if(v.orderss ==5 ){
				   	html+= ' <span class="font-14 mui-pull-right" style="color: gray;">已完成</span></li></ul>';
				   		
				 }
				 if(v.orderss ==6){
				   	html+= ' <span class="font-14 mui-pull-right" style="color: gray;">已取消</span></li></ul>';
				   		
				  }
					
   	   		
   	   	});
   	   	$('#scroll1').html(html);
   	   	$('#scroll2').html(xhtml);
   	   	$('#scroll3').html(chtml);
   	   	$('#scroll4').html(vhtml);
   	   	$('#scroll5').html(bhtml);
   	   	},error:function(e){
   	   	
   	   }
   }); 
   
   
 
   
})
//评价
function orderrate(id){
	plus.webview.create('./order-rate.html','order-rate.html',{},{goodsid:id}).show('pop-in',200);
}
//详细订单
function orderdetails4(id){
    plus.webview.create('./order-details.html','order-details.html',{},{orderid : id}).show('pop-in',200);
}
//物流
function wuliu(){ 
	 
}
//付款
function fukuan(orderid,price){
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
		console.log(channels)
		for(var i in channels){
			var channel=channels[i];
			pays[channel.id]=channel;
			checkServices(channel);
		} 
	},function(e){
		outLine("获取支付通道失败："+e.message);
	});
     
}
function checkServices(pc){
	if(!pc.serviceReady){
		var txt=null;
		switch(pc.id){ 
			case "alipay":
			txt="检测到系统未安装“支付宝快捷支付服务”，无法完成支付操作，是否立即安装？";
			break;
			default:
			txt="系统未安装“"+pc.description+"”服务，无法完成支付，是否立即安装？";
			break;
		}
		plus.nativeUI.confirm(txt,function(e){
			if(e.index==0){
				pc.installService();
			}
		},pc.description);
	}
}
//支付
function payment(ordernum, price , ptype){
console.log(ordernum+" "+price+" "+ptype);
	//预设订单Id ——> 用户Id+当前时间戳
	var orid=new Date().getTime();
    var orderid ="E"+ordernum+orid;
    console.log(orderid)
	if(w){return;}//检查是否请求订单中
//	
	if(ptype == 'alipay'){
//		console.log(webRoot + '/pay/Alipay.php?orderid=' + orderid + '&price='+price);
		url = webRoot + '/pay/Alipay.php?orderid=' + orderid + '&price='+price;
	}else if(ptype == 'wxpay'){
		console.log(webRoot + '/pay/index.php?orderid=' + orderid + '&price='+price);
		url = webRoot + '/pay/index.php?orderid=' + orderid + '&price='+price;
		console.log(url)
	}
	w = plus.nativeUI.showWaiting('支付中...',{width:'80px',height:'80px',background:'rgba(0,0,0,0.3)'});
	//console.log(w);
	// 请求支付订单
//	var xhr=new XMLHttpRequest();
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		switch (xhr.readyState) {
			case 4:
			w.close();  
			w = null;
			if (xhr.status == 200) { 
				var order = xhr.responseText;
				console.log(JSON.stringify(pays[ptype]));
				console.log(order);
				plus.payment.request(pays[ptype],order, function(result) { 
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
			plus.webview.create('my-order.html','my-order.html').show('slide-in-right');
		},error:function(e){
			
		}
	});
}
//取消
function quxiao(id){
	plus.nativeUI.showWaiting('正在取消，请稍后...');
	$.ajax({
		type:"get",
		url:apiRoot+"/home/order/quxiao/id"+id,
		data : {id : id},
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