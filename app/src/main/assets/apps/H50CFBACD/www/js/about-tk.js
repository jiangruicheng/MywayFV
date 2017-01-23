document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
	  $.ajax({
		   	type:"get",
		   	url:apiRoot+"/Home/About/abouttk",
		   	dataType:'json',
			success:function(data){
				$('#tkxy').html(data);
			},error:function(e){ 
				 
			}
	});
})