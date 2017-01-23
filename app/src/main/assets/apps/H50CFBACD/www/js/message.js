document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
   var userid = plus.storage.getItem('userid');
   var html = "";
   var xhtml = "";
   plus.nativeUI.showWaiting();
   $.ajax({
	   	type:"get",
	   	url:apiRoot+"/Home/Active/messagelist",
	   	data : {
	   		userid : userid 
	   	}, 
	   	dataType:'json',
	   	success:function(data){ 
	   		//console.log(JSON.stringify(data)); 
	   		$.each(data, function(k1,v1) { 
	   			console.log(JSON.stringify(v1));
	   			$.each(v1.pl, function(k2,v2) {  
//	   				console.log(JSON.stringify(v2));
	   				 html +='<li class="mui-media mui-table-view-cell">';
	   				    if(v1.imagess!=""){
	   				         html +='<img class="mui-media-object mui-pull-right" src="'+webRoot+v1.imagess+'" />';
	   				    }else{
	   				    	 html +='<p class="mui-media-object mui-pull-right" style="font-size:8px;">'+v1.body+'</p>';
	   				    }
			   		
					html +=	'<img class="mui-media-object mui-pull-left" src="'+getAvatar(v2.neir.userspic)+'" />'+
							'<div class="mui-media-body">'+
							'<span>'+v2.neir.usersni+'</span><span style="font-size: 12px;float: right;color: gray;">'+v2.addtime+'</span>'+
							'<p style="color: #000000;margin-top: 5px;">'+v2.pintext+'</p></div></li>';
	   		 
	   			});
	   			
	   			$.each(v1.zan, function(k3,v3) {
	   				xhtml +='<li class="mui-media mui-table-view-cell">'+
							'<img class="mui-media-object mui-pull-left" src="'+getAvatar(v3.userlike.userspic)+'" />';
					if(v1.imagess!=""){
	   				         xhtml +='<img class="mui-media-object mui-pull-right" src="'+webRoot+v1.imagess+'" />';
	   				    }else{
	   				    	 xhtml +='<p class="mui-media-object mui-pull-right" style="font-size:8px;">'+v1.body+'</p>';
	   				    }
					
					
					xhtml +='<div class="mui-media-body">'+
							'<span>'+v3.userlike.usersni+'</span><span style="font-size: 12px;float: right;color: gray;">'+v3.addtime+'</span>'+
							'<p style="color: #000000;margin-top: 5px;">赞了你的动态</p>'+
							'</div></li>';
	   				
	   			});
	   			
	   			
	   		});
	   		plus.nativeUI.closeWaiting();
		   $('#messagelist').html(html);
		   $('#messagelike').html(xhtml);
	   	},error:function(e){
	   		
	   	}
   });
})