document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
   var html = "";
   var xhtml = "";
    var chtml = "";
     var vhtml = "";
      var bhtml = ""; 
      var nhtml = "";
      plus.nativeUI.showWaiting();
   $.ajax({
	   	type:"get",
	   	url:apiRoot+"/home/shop/shopping",
	   	dataType:'json',
	   	success:function(data){
	   		console.log(JSON.stringify(data)); 
	   		$.each(data.res, function(k,v) { 
	   			//console.log(JSON.stringify(v)); 
	   			html +='<div class="mui-pull-left xx" onclick=goodsdetils("'+v.id+'")>'+
						'<img src="'+webRoot+v.litpic+'" style="height: 122px;" /><ul class="mui-table-view">'+
						'<li class="mui-table-view-cell">'+
						'<p style="color: #000000;">'+v.title+'</p>'+
						'<p style="font-size: 12px;color: #D42C4D;">¥'+v.price+'</p>'+
						'</li></ul></div>'; 
						
	   			if(v.tid == '38'){
	   			xhtml +='<div class="mui-pull-left xx" onclick=goodsdetils("'+v.id+'")>'+
						'<img src="'+webRoot+v.litpic+'" style="height: 122px;" /><ul class="mui-table-view">'+
						'<li class="mui-table-view-cell">'+
						'<p style="color: #000000;">'+v.title+'</p>'+
						'<p style="font-size: 12px;color: #D42C4D;">¥'+v.price+'</p>'+
						'</li></ul></div>';
	   			}
	   			if(v.tid == '39'){
	   			chtml +='<div class="mui-pull-left xx" onclick=goodsdetils("'+v.id+'")>'+
						'<img src="'+webRoot+v.litpic+'" style="height: 122px;" /><ul class="mui-table-view">'+
						'<li class="mui-table-view-cell">'+
						'<p style="color: #000000;">'+v.title+'</p>'+
						'<p style="font-size: 12px;color: #D42C4D;">¥'+v.price+'</p>'+
						'</li></ul></div>';
	   			} 
	   			if(v.tid == '40'){
	   			vhtml +='<div class="mui-pull-left xx" onclick=goodsdetils("'+v.id+'")>'+
						'<img src="'+webRoot+v.litpic+'" style="height: 122px;" /><ul class="mui-table-view">'+
						'<li class="mui-table-view-cell">'+
						'<p style="color: #000000;">'+v.title+'</p>'+
						'<p style="font-size: 12px;color: #D42C4D;">¥'+v.price+'</p>'+
						'</li></ul></div>';
	   			} 
	   			if(v.tid == '41'){
	   			bhtml +='<div class="mui-pull-left xx" onclick=goodsdetils("'+v.id+'")>'+
						'<img src="'+webRoot+v.litpic+'" style="height: 122px;" /><ul class="mui-table-view">'+
						'<li class="mui-table-view-cell">'+
						'<p style="color: #000000;">'+v.title+'</p>'+
						'<p style="font-size: 12px;color: #D42C4D;">¥'+v.price+'</p>'+
						'</li></ul></div>';
	   			}  
	   			 
	   		}); 
	   		
	   		
	   		$.each(data.rew,function(k1,v1){
	   			console.log(JSON.stringify(v1))
	   		 	nhtml +='<a class="mui-control-item" href="'+v1.gourl+'">'+v1.classname+'</a>';
	   		})
	   		$('#shoplist').append(nhtml);
	   		$('#content1').append(html);
	   		$('#content2').append(xhtml);
	   		$('#content3').append(chtml); 
	   		$('#content4').append(vhtml);  
	   		$('#content5').append(bhtml);  
	   		plus.nativeUI.closeWaiting();
	   	},error:function(e){
	   		
	   	} 
   });
   
   $('#myorder').on('tap',function(){
   	var userid=plus.storage.getItem('userid')
   	if(!userid){
   	plus.nativeUI.toast('请先登录')	
   		return;
   	}
   	   plus.webview.create('./my-order.html','my-order.html',{}).show('pop-in',200)
   })
   
}) 
function goodsdetils(id){
	plus.webview.create('./goods-details.html','goods-details.html',{},{goodsid : id}).show('pop-in',200)
}
