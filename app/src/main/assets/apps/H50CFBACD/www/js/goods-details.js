var html , xhtml ;
document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
   var goodsid = ws.goodsid;
   var chtml = "";
   plus.storage.setItem('sid',goodsid); 
   console.log(goodsid )
   $.ajax({
   	type:"get",
   	url:apiRoot+"/home/shop/goods",
   	data : {
   		goodsid : goodsid,
   	},
   	dataType:'json', 
   	success:function(data){  
   		
   		console.log(JSON.stringify(data));
   		html +='<div class="mui-slider-item mui-slider-item-duplicate"><a href="#">'+
			  '<img src="'+ (data.pro[0]?getuserPic(data.pro[0]):'') +'" style="height: 140px;"></a></div>';
		$.each(data.pro, function(index , value){ 
		html +='<div class="mui-slider-item"><a href="#">'+
				'<img src="'+ webRoot + value +'" style="height: 140px;"></a></div>';
		}); 
		html +='<div class="mui-slider-item mui-slider-item-duplicate"><a href="#">'+
				'<img src="'+ webRoot + data.pro[0] +'" style="height: 140px;"></a></div>';
	$('#goodsbanner').append(html);
	$('#goodsname').text(data.title);
	$('#goodsmoney').text('¥'+data.price);
	$('#description').text(data.description);
	xhtml = '<p>'+data.body.replace(/src="/g ,'src="'+webRoot)+'</p>';
	$('#body').html(xhtml);
	
	chtml += '<li class="mui-table-view-cell"  onclick=rate("'+data.id+'")>'+
				'<span class="font-14">评价('+data.pinl+')</span></li>';
    $('#pinl').append(chtml); 
	},error:function(e){ 
   		console.log(JSON.stringify(e))
   	}
   });
    
   $('#buymai').on('click',function(){
   	  plus.webview.create('./buy-ok.html','buy-ok.html',{},{goodsid : goodsid, spage : 1}).show('pop-in',200);
   })
})
function rate(id){ 
	plus.webview.create('./rate.html','rate.html',{},{goodsid : id, spage : 1}).show('pop-in',200);
}
