document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
   $('#found').on('click',function(){
   	  	var tx = $('#text').val();
	   $.ajax({
	   	type:"get",
	    url:apiRoot+"/home/other/found/",
	   	data : {
	   		tex : tx
	   	},
	   	dataType:'json',
	   	success:function(data){
	   		$.each(data, function(k,v) {
	   			html += '<p onclick=found('+v.id+')><span></span></p>';
	   		});
	   		$('.mui-content').html(html);
	   	},error:function(e){
	   		
	   	}
	   });
   })
  
})