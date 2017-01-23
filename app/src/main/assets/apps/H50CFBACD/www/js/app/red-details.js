var ws, uid, pid, rw=1, tttime;
function ready_reddetail(){
	ws = plus.webview.currentWebview();
	uid = plus.storage.getItem('userid');
	pid = ws.pid;
	showWating('请稍后...',10000);
	readRed();
	$('#open').on('tap',function () {
		rw = 2;/*领取红包*/
		readRed();
	})
	$('.mui-action-back').on('tap',function () {
		ws.close();
	})	
}

function readRed () {
	$.ajax({ 
		type:"post",
		url:apiRoot+'?m=Home&c=Red&a=readRed',
		async:true,
		dataType:"json",
		data:{
			uid:uid,
			pid:pid,
			rw:rw
		},
		success:function(data){
			console.log(JSON.stringify(data));
			rw = 1;
			plus.nativeUI.closeWaiting();
			var reds = data.red;
			var less = 0;
			if(reds){
				$('#nickname').text(reds.usersni +'的红包');/*红包主人的信息*/
				$('#nickname2').text(reds.usersni);
				$('#message').text(reds.remark);
				less = parseInt(reds.number) - data.info.length;
				$('#tishi').text(reds.number +'个红包，共'+ reds.money +'金币，'+ (less == 0 ? lessTime(data.info[data.info.length-1].createtime,data.info[data.info.length-1].givetime)+'被抢光' : '剩'+ less +'个'));
				if(reds.userspic){
					var avatar2 = getAvatar(reds.userspic);
					$('#avatar').attr('src',avatar2);
					$('#avatar2').attr('src',avatar2);
				}
			}
			if(data.msg){
				toast(data.msg);
			}
			if(data.status == 2){
				$('#canget').show();
			}else{
				$('header').show();
				$('.mui-content').show();
				$('#canget').hide();
				$('body').removeClass('dark');
			}
//			if(data.status == -2){
//				tttime = setInterval(readRed,2000);/*定时刷新获取好友的红包记录*/
//			}
			
			var output = '';
			var top = 0;
			$.each(data.info, function(key,vo) {
				output = output +'<ul class="mui-table-view">'+
					'<li class="mui-table-view-cell mui-media">'+
						'<img class="mui-media-object mui-pull-left" src="'+ getAvatar(vo.userspic) +'" />'+
						'<div class="mui-media-body">'+
							'<span style="line-height: 33px;">'+ (vo.usersni || '新用户') +'<span class="mui-pull-right">'+ vo.money +'元</span></span>'+
							'<p style="margin-top: -7px;">'+ turnChatTime(vo.givetime) +'<span class="mui-pull-right font-12" style="position: absolute;right: 15px;color: #DE1E1E;" data-money="'+ vo.money +'"></span></p>'+
						'</div>'+
					'</li>'+
				'</ul>';
				if(parseFloat(vo.money) > parseFloat(top)){
					top = vo.money;
				}
			});
			
			$('#list').html(output);
			if(data.status == 0){
				$('#list p span').each(function () {
					var _this = $(this);
					if(_this.attr('data-money') == top){
						_this.text('手气最佳');
						return false;
					}
				});/*已领完*/
			}
		},
		error:function(e){
			rw = 1;
			if(!tttime){
				errortoast();
			}
		}
	})
}

if(window.plus){
	ready_reddetail();
}else{
	document.addEventListener('plusready',ready_reddetail,false);
}