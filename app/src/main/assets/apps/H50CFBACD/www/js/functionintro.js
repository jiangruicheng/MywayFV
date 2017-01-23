document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
   var html = "";
	$.ajax({
	   	type:"get",
	   	url:apiRoot+"/Home/About/functionintro",
	   	dataType:'json',
	   	success:function(data){ 
	   		console.log(JSON.stringify(data))
			html += '<p>'+data.replace(/src="/g ,'src="'+webRoot)+'</p>'; 
			$('#gonne').html(html);
		},error:function(e){
			
		}
	});

})
