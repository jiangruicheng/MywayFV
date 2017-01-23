var aid, ws, maxw, sum = 0, maxSM = 0, maxChat=0, maxChatTeam=0, uid, chatType, companyname;
var teamMaxAid = 0;
function ready_list(){
	ws = plus.webview.currentWebview();
	uid = plus.storage.getItem('uid');console.log(uid);
	companyname = plus.storage.getItem('companyname');
	chatType = ['text', 'image', 'sound', 'flowers'];
	/*聊天*/
	if(uid){
		//maxChat = plus.storage.getItem('maxChat');/*聊天最大id*/console.log(maxChat); 
		//maxChat = maxChat ? parseInt(maxChat) : 0;
		getChatNews();
		setInterval(getChatNewsOntime,2000);//聊天消息，2s
		
		if(companyname){
			findTeamNewList();
			setInterval(findTeamNumber,2000);//（群）聊天消息新条数，2s
		}else{
			var tt_team = setInterval(function () {
				if(plus.storage.getItem('companyname')){
					clearInterval(tt_team);
					companyname = plus.storage.getItem('companyname');
					findTeamNewList();
					setInterval(findTeamNumber,2000);//（群）聊天消息新条数，2s
				}
			},1000);
		}
	}
	
	/*系统消息*/
//	plus.storage.removeItem('sysmessgae');/*测试*/
	aid = (plus.storage.getItem('sysmessgae') || 0);/*已读系统消息，id存在则不再加载*/console.log(aid); 
	maxSM = plus.storage.getItem('MaxSM');/*系统消息最大id*/
	maxSM = maxSM ? parseInt(maxSM) : 0;
	getSysNews();/*系统消息,开始*/
	//setInterval(getSysMsgTimeout,60000);/*系统消息,定时10m*/
	
	//maxw = $('.mui-content li:first').width() -30;console.log(maxw);
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
					output = output + '<ul class="mui-table-view" data-aid="'+ vo.fid +'" data-name="'+ (vo.nickname || 'new users') +'">'+
						'<li class="mui-table-view-cell">'+
							'<div class="frien_img">'+
								'<div class="home_top">'+
									'<img src="'+ getAvatar(vo.avatar) +'" class="mui-pull-left"/>'+
								'</div>'+
								'<div class="frien_bq">'+
									'<span>'+ (vo.nickname || 'new users') +'<span class="new"></span><span class="mui-pull-right mui-h6">'+ turnChatTime(vo.createtime) +'</span>'+
									'</span>'+
									'<p>'+ vo.message +'</p>'+
								'</div>'+
							'</div>'+							
						'</li>'+				
					'</ul>';
				});
				$('#per').html(output);
				
				$('#per .mui-table-view').unbind('tap');
				$('#per .mui-table-view').on('tap',comeIn);
				$("#per .mui-table-view:not('.news')").unbind('longtap');/*已读消息*/
				$("#per .mui-table-view:not('.news')").on('longtap',readOld);				
				
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
						output = '<ul class="mui-table-view news" data-aid="'+ vo.fid +'" data-name="'+ (vo.nickname || 'new users') +'">'+
							'<li class="mui-table-view-cell">'+
								'<div class="frien_img">'+
									'<div class="home_top">'+
										'<img src="'+ getAvatar(vo.avatar) +'" class="mui-pull-left"/>'+
									'</div>'+
									'<div class="frien_bq">'+
										'<span>'+ (vo.nickname || 'new users') +'<span class="new">'+ (vo.num ? ('+'+ vo.num) :'') +'</span><span class="mui-pull-right mui-h6">'+ turnChatTime(vo.createtime) +'</span>'+
										'</span>'+
										'<p>'+ vo.message +'</p>'+
									'</div>'+
								'</div>'+							
							'</li>'+				
						'</ul>';
						$('#per').prepend(output);//列表不存在该聊天,头部插入
					}
					if(vo.num && parseInt(vo.num) >0){
						sum += parseInt(vo.num);
					}
				});
					maxChat = data.info[0].aid;//在新一轮获取条数时设置
					if(sum_old != sum){
						setNum(1);/*设置未读消息总数,震动*/
					}
				
					$('#per .mui-table-view').unbind('tap');
					$('#per .mui-table-view').on('tap',comeIn);
					$('#per .news').unbind('longtap');/*未读消息，设已读*/
					$('#per .news').on('longtap',readChat);
					$("#per .mui-table-view:not('.news')").unbind('longtap');/*已读消息，删除*/
					$("#per .mui-table-view:not('.news')").on('longtap',readOld);				
				
			}
		},
		error:function(e){
			console.log('chat-ontime-err');
		}
	})	
}


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








/*系统消息（进入时获取）*/
function getSysNews () {
	$.ajax({ 
		type:"post",
		url:apiRoot+'?m=Home&c=System&a=getSysMessageList',
		async:true,
		dataType:"json",
		data:{aid:aid},
		success:function(data){
			if(data.status == 1){
				var vo = data.info;
				var output = '';
				if((!aid || aid.indexOf(','+ vo.aid +',') <0) && maxSM < parseInt(vo.aid)){
					output = '<ul class="mui-table-view news" data-aid="'+ vo.aid +'">'+
						'<li class="mui-table-view-cell">'+
							'<div class="frien_img">'+
								'<div class="home_top">'+
									'<img src="../public/img/5.png" class="mui-pull-left"/>'+
								'</div>'+
								'<div class="frien_bq">'+
									'<span>System message<span class="new">+1</span><span class="mui-pull-right mui-h6">'+ turnChatTime(vo.addtime) +'</span>'+
									'</span>'+
									'<p>'+ vo.title +'</p>'+
								'</div>'+
							'</div>'+							
						'</li>'+				
					'</ul>';
					plus.storage.setItem('MaxSM',vo.aid+'');
					MaxSM = vo.aid;
					sum += 1;
					setNum(1);/*设置未读消息总数,震动*/
				}
				if(data.readed){
					$.each(data.readed, function(key,vo) {
						output = output +'<ul class="mui-table-view" data-aid="'+ vo.aid +'">'+
							'<li class="mui-table-view-cell">'+
								'<div class="frien_img">'+
									'<div class="home_top">'+
										'<img src="../public/img/5.png" class="mui-pull-left"/>'+
									'</div>'+
									'<div class="frien_bq">'+
										'<span>System message<span class="mui-pull-right mui-h6">'+ turnChatTime(vo.addtime) +'</span>'+
										'</span>'+
										'<p>'+ vo.title +'</p>'+
									'</div>'+
								'</div>'+							
							'</li>'+				
						'</ul>';
					});
				}
				$('#sys').append(output);
				
				$('#sys .mui-table-view').unbind('tap');
				$('#sys .mui-table-view').on('tap',comeIn);
				$('#sys .news').unbind('longtap');/*未读消息*/
				$('#sys .news').on('longtap',readNew);
				$("#sys .mui-table-view:not('.news')").unbind('longtap');/*已读消息*/
				$("#sys .mui-table-view:not('.news')").on('longtap',readOld);				
				
			}
		},
		error:function(e){
			errortoast();console.log('err');
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
		setNum();/*设置未读消息总数*/
	}
	switch(_this.parent().attr('id')){
		case 'sys':
			plus.webview.create('System_message.html','System_message.html',{},{aid:thisaid}).show('pop-in');
		break;
		case 'cus':
			plus.webview.create('','',{},{fid:thisaid}).show('pop-in');
		break;		
		case 'team':
			var fname = _this.attr('data-name');
			plus.webview.create('Chat.html','Chat.html',{},{fid:thisaid,fname:fname,ftype:1}).show('pop-in');
		break;			
		case 'per':
			var fname = _this.attr('data-name');
			//var sendAvatar = _this.find('img').attr('src');
			plus.webview.create('Chat.html','Chat.html',{},{fid:thisaid,fname:fname,ftype:0}).show('pop-in');
		break;	
		default:
		break;
	}
}

/*聊天设为已读*/
function readChat() {
	
}

/*系统消息：已读/删除操作*/
function readNew() {
	var _this = $(this);
	plus.nativeUI.confirm('Please select the action you want to perform',function(e){
		var thisaid = _this.attr('data-aid');
		if (e.index == 0) {
			aid = plus.storage.getItem('sysmessgae');
			if(!aid){
				aid = ','+thisaid+',';
			}else{
				aid = aid+thisaid+',';
			}
			plus.storage.setItem('sysmessgae',aid);
			_this.find('.new').remove();
			_this.removeClass('news');/*设为已读*/
			_this.unbind('longtap');
			_this.on('longtap',readOld);/*更改绑定事件为删除*/
		}else{
			_this.remove();
		}
		sum -=1;
		setNum();/*设置未读消息总数*/
	},official,['MarkRead','Delete']);
}

function readOld() {
	var _this = $(this);
	plus.nativeUI.confirm('Are you sure you want to delete this item?',function(e){
		var thisaid = _this.attr('data-aid');
		if (e.index == 0) {
			/*删除*/
			_this.remove();
			sum -=1;
			setNum();/*设置未读消息总数*/
		}
	},official,['Yes','No']);
}

/*定时获取系统消息，间隔10minutes*/
function getSysMsgTimeout () {
	$.ajax({ 
		type:"post",
		url:apiRoot+'?m=Home&c=System&a=getSysMsgTimeout',
		async:true,
		dataType:"json",
		data:{maxSM:maxSM},
		success:function(data){
			if(data.status == 1){
				var vo = data.info;
				var output = '';
				if(!aid || aid.indexOf(','+ vo.aid +',') <0){
					output = '<ul class="mui-table-view news" data-aid="'+ vo.aid +'">'+
						'<li class="mui-table-view-cell">'+
							'<div class="frien_img">'+
								'<div class="home_top">'+
									'<img src="../public/img/5.png" class="mui-pull-left"/>'+
								'</div>'+
								'<div class="frien_bq">'+
									'<span>System message<span class="new"> +1</span><span class="mui-pull-right mui-h6">'+ turnChatTime(vo.addtime) +'</span>'+
									'</span>'+
									'<p>'+ vo.title +'</p>'+
								'</div>'+
							'</div>'+							
						'</li>'+				
					'</ul>';
					sum += 1;
					plus.storage.setItem('MaxSM',vo.aid);
					MaxSM = vo.aid;
	
					$('#sys').prepend(output);
					setNum(1);/*设置未读消息总数,震动*/
					
					$('#sys .mui-table-view').unbind('tap');
					$('#sys .mui-table-view').on('tap',comeIn);
					$('#sys .news').unbind('longtap');/*未读消息*/
					$('#sys .news').on('longtap',readNew);						
				}
			}
		},
		error:function(e){
			console.log('timeout error');
		}
	})	
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