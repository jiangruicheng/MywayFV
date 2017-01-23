var ws ,userid; 
document.addEventListener('plusready',function(){
   ws = plus.webview.currentWebview();
   userid = plus.storage.getItem('userid');
   var html ="";
    $.ajax({
   	  type:"get",
   	  url:apiRoot+"/home/order/myduihuans",
   	   data : {
   	   	 userid : userid
   	   },
   	   dataType:'json', 
   	   success:function(data){
   	   $.each(data, function(k,v) {
   	   			console.log(JSON.stringify(v)); 
   	   		html +='<ul class="mui-table-view">'+
					'<li class="mui-table-view-cell">'+
						'<p>'+v.time+'</p>'+
						'<p style="margin-top: 8px;">'+v.goods.title+'</p>'+
					'</li>'+
				'</ul>'; 
   	   	});
   	   	$('#duihuan').html(html);
   	   }
   	});
   	   
})