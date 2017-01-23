document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
   var html = "";
   $.ajax({
	   	type:"get",
	   	url:apiRoot+"/home/shop/exchangzone",
	   	dataType:'json',
	   	success:function(data){  
	   		console.log(JSON.stringify(data));
		  $.each(data, function(k,v) {
		  	console.log(JSON.stringify(v));
		  	  html += '<ul class="mui-table-view"><li class="mui-table-view-cell mui-media" onclick=exchangegoods('+v.id+')>'+
				'<img class="mui-media-object mui-pull-left" src="'+webRoot+v.litpic+'" />'+
				'<div class="mui-media-body"><span class="font-14" style="line-height: 18px;">'+v.title+'</span>'+
				'<p><i class="mui-icon iconfont">&#xe663;</i> '+Number(v.price)+'金币</p></div></li></ul>';
		  });
		
		$('#exchangelist').append(html);
	   	},error:function(e){
	   		
	   	}
	});
   
})
function exchangegoods(id){
	plus.webview.create('./exchange-goods.html','exchange-goods.html',{},{goodsid : id}).show('pop-in',200);
}
