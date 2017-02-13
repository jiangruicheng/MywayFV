document.addEventListener('plusready',function(){
	var ws = plus.webview.currentWebview();
	var sid = ws.sid;
	var userid = plus.storage.getItem('userid');
	var html = "";
	if(sid){

		$.ajax({
			type:"get",
			url:apiRoot+"/home/Active/myactive", 
			data : {
				userid : sid,
			},
			dataType:'json', 
			success:function(data){ 
				$('.biaoti').text('动态详情');
				$('#user > img').attr('src',getAvatar(data.ree.userspic));
				$('#username').text(data.ree.usersni);
				$('#dengji').text(data.req);
				$('#money').text(data.ree.usersmoney);
				$('.dz').text(data.ree.usersaddr)
				$('#chat').on('tap',function () {
					if(!userid){ plus.nativeUI.toast('请先登录!'); return; }
					plus.webview.create('club-chat.html','club-chat.html',{},{fid:sid,ftype:0,fname:data.ree.usersni}).show('pop-in');
				})
				
				$.each(data.res, function(k,v){
					console.log(JSON.stringify(v))
				html+='<div class="mui-card kong"><div class="mui-card-header mui-card-media">'+
					'<div class="mui-card-media-object mui-pull-left mui-col-xs-2"><img src="'+getAvatar(data.ree.userspic)+'" /></div>'+
					'<div class="mui-card-media-body">'+
					'<span>'+data.ree.usersni+'</span><i class="mui-icon iconfont mui-yellow" style="margin-left: 6px;font-size: 14px;">&#xe605;</i>'+
					'<p class="font-12">'+v.addtime+'</p></div></div>'+
					'<div class="mui-card-content" onclick="activedetails(\''+v.id+'\',\''+v.addtime+'\')">'+
					'<div class="mui-card-content-inner"><p style="color: #000000;">'+v.body+'</p>';
					'</div><div class="mui-card-media">'+
					
					$.each(v.imagess,function(k1,v1){
						if(v1 != ""){
								html+='<img src="'+webRoot+v1+'"/style=" width:32%;height: 90px;">';
						}
					
					});
				html+='</div></div><div class="mui-card-footer">'+
					'<button type="button" class="mui-btn"><i class="mui-icon iconfont">&#xe664;</i>赞</button>'+
					'<button type="button" class="mui-btn" onclick="activedetails(\''+v.id+'\',\''+v.addtime+'\')"><i class="mui-icon iconfont">&#xe665;</i>评论</button>'+
					'<button type="button" onclick="tshare(\''+v.id+'\')" class="mui-btn mui-pull-right"><a  href="#room-share" ><i class="mui-icon iconfont">&#xe666;</i>转发</a></button>'+
					'</div></div>';
					
				});
				$('#myactivelist').html(html);
			},error:function(e){ 
				
			} 
		});
	
	}else{
		$.ajax({
			type:"get",
			url:apiRoot+"/home/Active/myactive", 
			data : {
				userid : userid,
			},
			dataType:'json', 
			success:function(data){ 
				
				$('#user > img').attr('src',getAvatar(data.ree.userspic));
				$('#username').text(data.ree.usersni);
				$('#dengji').text(data.req);
				$('#money').text(data.ree.usersmoney);
				$.each(data.res, function(k,v){
					console.log(JSON.stringify(v))
				html+='<div class="mui-card kong"><div class="mui-card-header mui-card-media">'+
					'<div class="mui-card-media-object mui-pull-left mui-col-xs-2"><img src="'+getAvatar(data.ree.userspic)+'" /></div>'+
					'<div class="mui-card-media-body">'+
					'<span>'+data.ree.usersni+'</span><i class="mui-icon iconfont mui-yellow" style="margin-left: 6px;font-size: 14px;">&#xe605;</i>'+
					'<p class="font-12">'+v.addtime+'</p></div></div>'+
					'<div class="mui-card-content" onclick="activedetails(\''+v.id+'\',\''+v.addtime+'\')">'+
					'<div class="mui-card-content-inner"><p style="color: #000000;">'+v.body+'</p>';
					'</div><div class="mui-card-media">'+
			
					$.each(v.imagess,function(k1,v1){
						if(v1 != ""){
							html+='<img src="'+webRoot+v1+'"/style=" width:32%;height: 90px;">';
						}
					});
				html+='</div></div><div class="mui-card-footer">'+
					'<button type="button" class="mui-btn"><i class="mui-icon iconfont">&#xe664;</i>赞</button>'+
					'<button type="button" class="mui-btn" onclick="activedetails(\''+v.id+'\',\''+v.addtime+'\')"><i class="mui-icon iconfont">&#xe665;</i>评论</button>'+
					'<button type="button" onclick="tshare(\''+v.id+'\')" class="mui-btn mui-pull-right"><a><i class="mui-icon iconfont">&#xe666;</i>转发</a></button>'+
					'</div></div>';
					
				});
				$('#myactivelist').html(html);
			},error:function(e){ 
				
			} 
		});
		
	}
	
 	
   	$('#zz').on('click',function(){
   		$(this).css('display','none');
   		$('#room-share').css({'display':'none','opacity':0});
   	})
	
})

function activedetails(id ,adtime, name ,pic){
	
	plus.webview.create('./active-details.html','active-details.html',{},{did : id,adtime : adtime,name : name ,pic : pic}).show('pop-in',200);
}
function tshare(id){
	var userid = plus.storage.getItem('userid');
	if(!userid){
		  toast('请登入!');
    	return ;
	}
	$('#zz').css('display','block')
	$('#room-share').css({'display':'block','opacity':1})
	plus.storage.setItem('sid',id); 
}
