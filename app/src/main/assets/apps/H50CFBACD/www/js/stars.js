document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
   var html="";
  
   $.ajax({
	   	type:"get",
	   	url:apiRoot+"/home/stars/starlist",
	   	dataType:'json',
	   	success:function(data){ 
	   		
	  $.each(data,function(k,v){
	  	console.log(JSON.stringify(v)); 
		  	html +='<ul class="mui-table-view" onclick=starsxq('+v.userid+')><li class="mui-table-view-cell mui-media">'+
				'<img class="mui-media-object mui-pull-left" src="'+webRoot+v.user.userspic+'" />'+ 
				'<div class="mui-media-body">'+ 
				'<span>'+v.user.usersni+'</span><i class="mui-icon iconfont xx">&#xe667;</i>'+
				'<p><i class="mui-icon iconfont" style="color: #FFA2A2;">&#xe615;</i>'+v.user.yuers+'岁</p>'+
				'</div></li></ul>';   
		  	}); 
			$('#strar').html(html);
	   	},error:function(e){
	   		
	   	} 
   }); 
   
}) 
function starsxq(id){
	plus.webview.create('./my-active1.html','my-active1.html',{},{sid:id}).show('pop-in',200);
}
