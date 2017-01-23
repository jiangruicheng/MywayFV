document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
	  $.ajax({
		   	type:"get",
		   	url:apiRoot+"/Home/About/notice",
		   	dataType:'json',
			success:function(data){
				$('#notice').html(data);
			},error:function(e){ 
				 
			}
	});
})