document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
   var goodsid = ws.goodsid;
   var html = "";
    $.ajax({
			type:"get",
			url:apiRoot+"/home/order/rate",
			data : {
				goodsid : goodsid
			},
			dataType:'json', 
			success:function(data){
//				console.log(JSON.stringify(data))
				$.each(data, function(k,v) {
					console.log(JSON.stringify(v))
					html+='<ul class="mui-table-view"><li class="mui-table-view-cell mui-media">'+
						'<img class="mui-media-object mui-pull-left" src="'+getAvatar(v.user.userspic)+'" />'+
						'<div class="mui-media-body"><p>'+v.user.usersni+'</p>'+
						'<p class="font-12" style="line-height: 25px;">2016-06-28</p>'+
						'<p>'+v.pintext+'</p>';
						if(v.pho!=''){
								$.each(v.pho, function(k1,v1) {
							html+='<img src="'+webRoot+v1+'"  style="margin-left: 3px;"/>';
						});	
						}
					
						if(v.shophuifu != null){ 
							html+='<p style="margin-top: 5px;color: #2B3E62;">[商家回复]：'+v.shophuifu+'！</p>';
						}
					html+='</div></li></ul>';
				});
				$('#ratelist').append(html);
			},error:function(e){
				
			}
	})

})