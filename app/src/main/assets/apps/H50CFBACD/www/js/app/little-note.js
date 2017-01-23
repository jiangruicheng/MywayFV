var aid, ws, maxw, sum = 0, maxSM = 0, maxChat=0, maxChatTeam=0, uid, chatType, companyname;
var teamMaxAid = 0;
function ready_list(){
	ws = plus.webview.currentWebview();
	uid = plus.storage.getItem('userid');console.log(uid);
	companyname = plus.storage.getItem('companyname');
	chatType = ['text', 'image', 'sound', 'flowers'];
	/*聊天*/
	if(uid){
		//maxChat = plus.storage.getItem('maxChat');/*聊天最大id*/console.log(maxChat); 
		//maxChat = maxChat ? parseInt(maxChat) : 0;
		getChatNews();
//		setInterval(getChatNewsOntime,2000);//聊天消息，2s
	}
	
//	 $('.mui-content li:first').width() -30;console.log(maxw);
}
if(window.plus){
	ready_list();
}else{
	document.addEventListener('plusready',ready_list,false);
}

/*双人聊天列表*/
function getChatNews () {
	$.ajax({ 
		type:"post",
		url:apiRoot+'?m=Home&c=Chat&a=findNewsList',
		async:true,
		dataType:"json",
		data:{
			uid:uid
		},
		success:function(data){
			if(data.status == 1){
				console.log(JSON.stringify(data));
				var output = '';
				$.each(data.info, function(key,vo) {
					if(vo.uid != uid){
						vo.fid = vo.uid;//对方
					}
					if(vo.type != 0){
						vo.message = '['+ chatType[vo.type] +']';
					}
					console.log(JSON.stringify(vo));
					output = output + '<ul class="mui-table-view" data-aid="'+ vo.fid +'" data-name="'+ (vo.nickname || '新用户') +'">'+
						'<li class="mui-table-view-cell">'+
							'<div class="frien_img">'+
								'<div class="home_top">'+
									'<img src="'+ getAvatar(vo.userspic) +'" class="mui-pull-left"/>'+
								'</div>'+
								'<div class="frien_bq">'+
									'<span>'+ (vo.usersni || '新用户') +'<span class="new"></span><span class="mui-pull-right mui-h6">'+ turnChatTime(vo.createtime) +'</span>'+
									'</span>'+
									'<p>'+ vo.message +'</p>'+
								'</div>'+
							'</div>'+							
						'</li>'+				
					'</ul>';
				});
				$('#content').html(output);
				
				$('#content .mui-table-view').unbind('tap');
				$('#content .mui-table-view').on('tap',comeIn);
//				$("#content .mui-table-view:not('.news')").unbind('longtap');/*已读消息*/
//				$("#content .mui-table-view:not('.news')").on('longtap',readOld);				
				
			}
			//getChatNewsOntime();//开始第一次获取
		},
		error:function(e){
			console.log('chat-err');
		}
	})	
}

/*双人聊天（更新）*/
function getChatNewsOntime () {
	$.ajax({ 
		type:"post",
		url:apiRoot+'?m=Home&c=Chat&a=findnew',
		async:true,
		dataType:"json",
		data:{
			uid:uid,
			maxid:maxChat
		},
		success:function(data){
			if(data.status == 1){
				console.log(JSON.stringify(data));
				var output = '';
				var sum_old = sum;
				$.each(data.info, function(key,vo) {
					if(!vo.fid){
						return true;
					}
					if(vo.uid != uid){
						vo.fid = vo.uid;//对方
						console.log(vo.fid+' '+uid);
					}					
					if(vo.type != 0){
						vo.message = '['+ chatType[vo.type] +']';
					}				
					var isnull = true;
					$('#per>ul').each(function() {
						var _this = $(this);
						if(vo.fid == _this.attr('data-aid')){
							if(!_this.hasClass('news')){
								_this.addClass('news');
							}
							if(vo.num && parseInt(vo.num) >0){
								var numbers = _this.find('.new').text();
								if(numbers){
									_this.find('.new').text('+'+(parseInt(numbers.substr(1)) + parseInt(vo.num)));//未读数量
								}else{
									_this.find('.new').text('+'+(parseInt(vo.num)));
								}
							}
							_this.find('.mui-h6').text(turnChatTime(vo.createtime));
							_this.find('p').text(vo.message);
							isnull = false;
							return false;//列表存在该聊天
						}
						
					});
					if(isnull){
						output = '<ul class="mui-table-view news" data-aid="'+ vo.fid +'" data-name="'+ (vo.usersni || '新用户') +'">'+
							'<li class="mui-table-view-cell">'+
								'<div class="frien_img">'+
									'<div class="home_top">'+
										'<img src="'+ getAvatar(vo.userspic) +'" class="mui-pull-left"/>'+
									'</div>'+
									'<div class="frien_bq">'+
										'<span>'+ (vo.usersni || '新用户') +'<span class="new">'+ (vo.num ? ('+'+ vo.num) :'') +'</span><span class="mui-pull-right mui-h6">'+ turnChatTime(vo.createtime) +'</span>'+
										'</span>'+
										'<p>'+ vo.message +'</p>'+
									'</div>'+
								'</div>'+							
							'</li>'+				
						'</ul>';
						$('#content').prepend(output);//列表不存在该聊天,头部插入
					}
					if(vo.num && parseInt(vo.num) >0){
						sum += parseInt(vo.num);
					}
				});
					maxChat = data.info[0].aid;//在新一轮获取条数时设置
					if(sum_old != sum){
						setNum(1);/*设置未读消息总数,震动*/
					}
				
					$('#content .mui-table-view').unbind('tap');
					$('#content .mui-table-view').on('tap',comeIn);
//					$('#content .news').unbind('longtap');/*未读消息，设已读*/
//					$('#content .news').on('longtap',readChat);
//					$("#content .mui-table-view:not('.news')").unbind('longtap');/*已读消息，删除*/
//					$("#content .mui-table-view:not('.news')").on('longtap',readOld);				
				
			}
		},
		error:function(e){
			console.log('chat-ontime-err');
		}
	})	
}






function setNum (vibrate) {
	var webP = '../index.html';
	var parentid = plus.webview.getWebviewById(webP);
	if(!vibrate){
		mui.fire(parentid,'change',{sum:sum});console.log('not vibrate');
	}else{
		mui.fire(parentid,'change',{sum:sum,vibrate:1});
	}
}

function comeIn () {
	var _this = $(this);
	var thisaid = _this.attr('data-aid');console.log(thisaid);/*对方id*/
	if(_this.hasClass('news')){
		var numbers = _this.find('.new').text();
		if(numbers){
			sum -= parseInt(numbers.substr(1));
		}
		_this.removeClass('news');/*设为已读*/
		_this.find('.new').text('');
//		setNum();/*设置未读消息总数*/
	}

	var fname = _this.attr('data-name');
	console.log(thisaid)
	plus.webview.create('club-chat.html','club-chat.html',{},{fid:thisaid,fname:fname,ftype:0,cuseid:uid}).show('pop-in');

}

/*聊天设为已读*/
function readChat() {
	
}




function renew () {
	$('#sys').html('');
	$('#cus').html('');
//	$('#team').html('');
	$('#per').html('');
	maxChat = 0;
	teamMaxAid = 0;
	sum = 0;
	getChatNews();
	getSysNews();/*系统消息,开始*/
}

function removeNumber (fid,ftype) {
	if(!fid || !ftype){
		return;
	}
	switch(ftype){
		case '0':
			$("#per>ul[data-aid='"+ fid +"']").find('.new').text('');
		break;
		case '1':
			$("#team>ul[data-aid='"+ fid +"']").find('.new').text('');
		break;
		default:
		break;
	}
}