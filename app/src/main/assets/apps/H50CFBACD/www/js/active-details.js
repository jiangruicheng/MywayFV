document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
    var id = ws.did;
    var adtime = ws.adtime;
    var html="";
    var xhtml="";
    var hhtml="";
    plus.storage.setItem('sid',id);
    $.ajax({ 
   	type:"get",
   	url:apiRoot+"/Home/Active/activedetail",
   	data : {
   		id : id 
   	},  
   	dataType:'json',
	success:function(data){   
		//console.log(JSON.stringify(data));  
	  html +='<div class="mui-card-header mui-card-media"><div class="mui-card-media-object mui-pull-left mui-col-xs-2">';
	if(data.usa){
		html +=	'<img src="'+getAvatar(data.usa.userspic)+'"></div><div class="mui-card-media-body">'+
		'<span>'+data.usa.usersni+'</span><i class="mui-icon iconfont mui-yellow" style="margin-left: 6px;font-size: 14px;">&#xe605;</i>';
	}else{
		html +=	'<img src="'+adminimg+'"></div><div class="mui-card-media-body">'+
		'<span>'+adminname+'</span><i class="mui-icon iconfont mui-yellow" style="margin-left: 6px;font-size: 14px;">&#xe605;</i>';
	}
	
	html +=	'<p class="font-12">'+adtime+'</p></div></div>'+
			'<div class="mui-card-content"><div class="mui-card-content-inner">'+
			'<p style="color: #000000;">'+data.res.body+'</p></div><div class="mui-card-media">';
		if(data.res.pro != ""){
			$.each(data.res.pro,function(k,v){
				if(k < 7){
					html+=checkTv(v);   
				}
				
			})
		}
		
		html+=	'</div></div>'; 
	$('.ping').html(html);
	$('#pingnumber').text(data.req);  
	$('#likenumber').text(data.rep);
	$.each(data.rew, function(k1,v1){ 
		console.log(JSON.stringify(v1));
		xhtml += '<li class="mui-media mui-table-view-cell">'+
			    '<img class="mui-media-object mui-pull-left" style="height: 40px;width: 40px;" src="'+getAvatar(v1.user.userspic)+'" />'+
				'<div class="mui-media-body">'+
				'<span>'+v1.user.usersni+'</span><i class="mui-icon iconfont mui-yellow" style="margin-left: 6px;font-size: 14px;">&#xe605;</i>'+
				'<p style="color: #000000;font-size: 12px;">'+v1.addtime+'</p>'+
				'<p style="color: #000000;">'+v1.pintext+'</p></div></li>';
				console.log(v1.addtime)
	});
	$('.pinlist').append(xhtml);
	//console.log(JSON.stringify(data.ree)); 
	$.each(data.ree, function(k2,v2){  
		console.log(JSON.stringify(v2)); 
		hhtml +='<li class="mui-media mui-table-view-cell">'+
				'<img class="mui-media-object mui-pull-left" style="height: 40px;width: 40px;" src="'+getAvatar(v2.userlike.userspic)+'" />'+
				'<div class="mui-media-body">'+
				'<span>'+v2.userlike.usersni+'</span><i class="mui-icon iconfont mui-yellow" style="margin-left: 6px;font-size: 14px;">&#xe605;</i>'+
				'<p style="color: #000000;font-size: 12px;">'+v2.addtime+'</p></div></li>';
	});
	$('.likelist').append(hhtml);
	},error:function(e){  
		
	}
   });
   
   $('#bthn').on('click',function(){
   	var userid = plus.storage.getItem('userid');
   	var meagetext = $('#meagetext').val();
   	if(!userid){
   	toast('请登入！');
		return;	
   	}
   	if(!meagetext){
   		toast('评论不能为空！');
		return;
   	}
   	$.ajax({
   		type:"get",
   		url:apiRoot+"/home/Active/meassge",
   		data : {
   			activeid : id,
   			userid : userid,
   			pintext : meagetext
   		},
   		dataType:'json',
   		success:function(data){
   			$('#meagetext').val('');
   			console.log(data.sj)
   			var shtml;
   			shtml= '<li class="mui-media mui-table-view-cell">'+
			    '<img class="mui-media-object mui-pull-left" style="height: 40px;width: 40px;" src="'+getAvatar(data.cont.userspic)+'" />'+
				'<div class="mui-media-body">'+
				'<span>'+data.cont.usersni+'</span><i class="mui-icon iconfont mui-yellow" style="margin-left: 6px;font-size: 14px;">&#xe605;</i>'+
				'<p style="color: #000000;font-size: 12px;">'+data.sj+'</p>'+
				'<p style="color: #000000;">'+data.cont.pintext+'</p></div></li>';
			$(shtml).prependTo($('.pinlist'))
			$('#pingnumber').text(data.shu)
   		},error:function(e){
   			
   		}
   	});
   })
    $('#like').on('tap',function(){ 
		var userid = plus.storage.getItem('userid');
		if(!userid){
			toast('请先登入');
		}
		$.ajax({
	   		type:"get",
	   		url:apiRoot+"/home/Active/clicklike",
	   		data : {
	   			actid : id,
	   			userid : userid,
	   		},
	   		dataType:'json',
	   		success:function(data){
	   			console.log(data)
	   			if(data==-1){
	   				toast('你已评论过');
	   			}else{
	   				var thtml;
	   		thtml ='<li class="mui-media mui-table-view-cell">'+
				'<img class="mui-media-object mui-pull-left" style="height: 40px;width: 40px;" src="'+getAvatar(data.cont.userspic)+'" />'+
				'<div class="mui-media-body">'+
				'<span>'+data.cont.usersni+'</span><i class="mui-icon iconfont mui-yellow" style="margin-left: 6px;font-size: 14px;">&#xe605;</i>'+
				'<p style="color: #000000;font-size: 12px;">'+data.sj+'</p></div></li>';
	   			$(thtml).prependTo($('.likelist'))
	   			$('#likenumber').text(data.shu)
	   			}
	   		},error:function(e){
	   			
	   		}
   	});
   	})
  
}) 
function checkTv(tv){
	var tv_id=tv;
     var index= tv_id.indexOf("."); //得到"."在第几位
     tv_id=tv_id.substring(index); //截断"."之前的，得到后缀
     if(tv_id!=".jpg"&&tv_id!=".png"&&tv_id!=".git"&&tv_id!=".jpeg"){ //根据后缀，判断是否符合视频格式
         var  v=tv.split(":");
        return   '<video width="100%" height="200" controls="controls" preload="auto" poster="http://app229.51edn.com'+v[1]+'">'+
				'<source src="http://app229.51edn.com'+ v[0] +'" type="video/mp4"></source></video>';
     }else{
     return  '<img src="http://app229.51edn.com'+tv+'"   data-preview-src="" data-preview-group="1"/>' ; 
     }
}


