document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview(); PullToRefresh(ws);
   var userid = plus.storage.getItem('userid');
   var html = "";
   $.ajax({
   	 type:'get',
   	 url:apiRoot+"/home/club/clublist",
   	 data : { 
   	 	userid : userid,
   	 	othte:1
   	 },  
   	 dataType:'json',
   	 success:function(data){
   	 	console.log(JSON.stringify(data));
   	 	$.each(data, function(k,v) {   
   	 		if(v.res!=null){
   	 		html += '<ul class="mui-table-view">'+
				'<li class="mui-table-view-cell mui-media" onclick=clubchat("'+v.res.id+'","'+v.res.userid+'","'+v.res.name+'")>'+
				'<img class="mui-media-object mui-pull-left" src="'+getAvatar(v.res.avatar)+'" />'+
				'<div class="mui-media-body">'+
				'<span>'+v.res.name+'</span><span class="mui-pull-right font-12 gray"><i class="mui-icon iconfont" style="font-size: 11px;margin-right: 5px;">&#xe617;</i>'+v.res.info+'</span>'+
				'<p class="font-12">'+v.res.address+'</p>'+
				'</div></li></ul>';
   	 	}});
   	 	
   	 	$('#clublist').append(html);
   	 	
	},error:function(e){
   	 	
   	 }
   }) 
   
 
})

 


function clubchat(id,userid,name){
	console.log(id+","+name+","+userid)
	plus.webview.create('./club-chat.html','club-chat.html',{},{fid:id,ftype:1,fname:name,cludid :id , cuseid : userid}).show('pop-in',200);
}				
	
//	plus.webview.create('./club-chat.html','club-chat.html',{},{cludid :id , cuseid : userid}).show('pop-in',200);
//}




/*（群）聊天列表*/
function findTeamNewList () {
	$.ajax({ 
		type:"post",
		url:apiRoot+'?m=Home&c=Chat&a=findTeamNewList',
		async:true,
		dataType:"json",
		data:{
			uid:uid,
			fid:companyname
		},
		success:function(data){
			if(data.status == 1){
				console.log(JSON.stringify(data));
				var output = '';
				$.each(data.info, function(key,vo) {
					if(vo.type && vo.type != 0){
						vo.message = '['+ chatType[vo.type] +']';
					}				
					output = '<ul class="mui-table-view news" data-aid="'+ vo.fid +'" data-name="'+ vo.name +'">'+
						'<li class="mui-table-view-cell">'+
							'<div class="frien_img">'+
								'<div class="home_top">'+
									'<img src="'+ getAvatarTwo('',1) +'" class="mui-pull-left"/>'+
								'</div>'+
								'<div class="frien_bq">'+
									'<span>'+ vo.name +'<span class="new"></span><span class="mui-pull-right mui-h6">'+ (vo.createtime ? turnChatTime(vo.createtime) :'') +'</span>'+
									'</span>'+
									'<p>'+ (vo.message || '') +'</p>'+
								'</div>'+
							'</div>'+							
						'</li>'+				
					'</ul>';
					$('#team').append(output);//列表不存在该聊天,头部插入
				});
					$('#team .mui-table-view').unbind('tap');
					$('#team .mui-table-view').on('tap',comeIn);
			}
		},
		error:function(e){
			console.log('chat-ontime-err');
		}
	})	
}

/*（群）聊天新条数*/
function findTeamNumber () {
	$.ajax({ 
		type:"post",
		url:apiRoot+'?m=Home&c=Chat&a=findTeamNumber',
		async:true,
		dataType:"json",
		data:{
			uid:uid,
			fid:companyname,
			teamMaxAid:teamMaxAid
		},
		success:function(data){
			if(data.status == 1){
				console.log(JSON.stringify(data));
				var output = '';
				var sum_old = sum;
				$.each(data.info, function(key,vo) {
					if(vo.type && vo.type != 0){
						vo.message = '['+ chatType[vo.type] +']';
					}				
					var isnull = true;
					$.each($('#team>ul'), function() {
						var _this = $(this);
						if(vo.fid == _this.attr('data-aid')){
							if(!_this.hasClass('news')){
								_this.addClass('news');
							}
							var numbers = _this.find('.new').text();
							if(numbers && vo.num){
								_this.find('.new').text('+'+(parseInt(numbers.substr(1)) + parseInt(vo.num)));//未读数量
							}else if(vo.num){
								_this.find('.new').text('+'+(parseInt(vo.num)));
							}else{
								_this.find('.new').text('');
							}
							_this.find('.mui-h6').text(turnChatTime(vo.createtime));
							_this.find('p').text(vo.message);
							isnull = false;
							return false;//列表存在该聊天
						}
						
					});
					if(isnull){
						output = '<ul class="mui-table-view news" data-aid="'+ vo.fid +'" data-name="'+ vo.name +'">'+
							'<li class="mui-table-view-cell">'+
								'<div class="frien_img">'+
									'<div class="home_top">'+
										'<img src="'+ getAvatarTwo('',1) +'" class="mui-pull-left"/>'+
									'</div>'+
									'<div class="frien_bq">'+
										'<span>'+ vo.name +'<span class="new">+'+ vo.num +'</span><span class="mui-pull-right mui-h6">'+ turnChatTime(vo.createtime) +'</span>'+
										'</span>'+
										'<p>'+ vo.message +'</p>'+
									'</div>'+
								'</div>'+							
							'</li>'+				
						'</ul>';
						$('#team').prepend(output);//列表不存在该聊天,头部插入
					}
					if(vo.num && parseInt(vo.num)>0){
						sum += parseInt(vo.num);
					}
					if(vo.aid){
						teamMaxAid = vo.aid;
					}
				});
				
				if(sum_old != sum){
					setNum(1);/*设置未读消息总数,震动*/
				}
				
					$('#team .mui-table-view').unbind('tap');
					$('#team .mui-table-view').on('tap',comeIn);
			}
		},
		error:function(e){
			console.log('chat-ontime-err');
		}
	})	
}
