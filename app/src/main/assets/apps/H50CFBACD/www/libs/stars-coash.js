
document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
   var html="";
   var xhtml = "";
   $.ajax({
	   	type:"get",
	   	url:apiRoot+"/home/stars/stars",
	   	dataType:'json',
	   	success:function(data){
	   		
	   		$.each(data,function(k,v){
	   			console.log(JSON.stringify(v));
	   			if(v.id == '69'){
	   				html = '<p>'+v.body+'</p>';
	   			}
	   		
		   		if(v.id == '70'){
		   			xhtml = '<p>'+v.body+'</p>';
		   		}
	   		})
	   		
	   		$('#my2').html(xhtml); 	
	   		$('#my3').html(html);
	   	
	   		
	   	},error:function(e){
	   		
	   	}
   });
   
})