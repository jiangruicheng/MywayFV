document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
	  $.ajax({
		   	type:"get",
		   	url:apiRoot+"/Home/About/aboutus",
		   	dataType:'json',
			success:function(data){
				$('#aboutus').html(data);
			},error:function(e){ 
				 
			}
	});
})