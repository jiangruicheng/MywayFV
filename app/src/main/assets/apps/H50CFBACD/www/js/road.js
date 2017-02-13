document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
   var html;
    $.ajax({
    	type:"get",
    	url:apiRoot+"/home/Road/road", 
    	dataType:'json',
    	success:function(data){
    	$.each(data,function(k,v){
    		html='<div class="my"><ul class="mui-table-view" onclick=roadcz('+v.id+')>'+
			'<li class="mui-table-view-cell"><img src="'+webRoot+v.img[0]+'" style="width:100%"><p class="mui-pull-right mui-icon" style="position:absolute;z-index: 22;top:10px;right:5px">'+
			'<span><i class="iconfont" style="font-size: 12px;">&#xe631;</i>'+v.numb+'</span>'+
			'<span style="margin: 0 10px;"><i class="iconfont" style="font-size: 11px;">&#xe617;</i>深圳</span>'+
			'<span>里程：'+v.mileage+'km</span></p>'+
			'<h3 style="position: absolute;bottom: 10px;left: 15px;color: white;">'+v.origin+'</h3></li></ul></div>'+
			'<div class="my1"><ul class="mui-table-view">'+
			'<li class="mui-table-view-cell"><span style="font-size: 14px;">风景：</span>';
		
		 
		switch(v.fengjing){ 
			case '1':
			html +=	'<i class="mui-icon iconfont" style="color: #FFB139;font-size: 13px;">&#xe610;</i>';
			break;
			case '2':
			html +=	'<i class="mui-icon iconfont" style="color: #FFB139;font-size: 13px;">&#xe610; &#xe610;</i>';
			break;
			case '3':
			html +=	'<i class="mui-icon iconfont" style="color: #FFB139;font-size: 13px;">&#xe610; &#xe610; &#xe610;</i>';
			break;
			case '4':
			html +=	'<i class="mui-icon iconfont" style="color: #FFB139;font-size: 13px;">&#xe610; &#xe610; &#xe610; &#xe610;</i>';
			break;
			default:
			html +=	'<i class="mui-icon iconfont" style="color: #FFB139;font-size: 13px;">&#xe610; &#xe610; &#xe610; &#xe610; &#xe610;</i>';
			break;
		}
		
		html +='<span class="mui-pull-right mui-media">'+
			'<img src="'+getAvatar(v.userxin.userspic)+'" class="mui-media-object mui-pull-left" />'+
			'<div class="mui-media-body" style="font-size: 14px;line-height: 25px;">'+v.userxin.usersni+'</div></span></li></ul></div>';
    	
    	$(html).appendTo($('#roadlist'));
    	})
    
    	},error:function(e){   
    		 console.log(JSON.stringify(e)); 
    	} 
    })


})
function roadcz(id){
	plus.webview.create('./road-cz.html','road-cz.html',{},{roadid : id}).show('pop-in',200);
}
