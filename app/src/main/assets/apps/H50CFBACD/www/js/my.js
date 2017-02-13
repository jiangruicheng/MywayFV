var userid
document.addEventListener('plusready',function(){
	userid = plus.storage.getItem('userid');//用户id
	PullToRefresh(plus.webview.currentWebview())
	var html = "";
	$.ajax({
		type:"get",
		url:apiRoot+"/home/user/my", 
		data : {
			userid : userid
		}, 
		dataType:'json',
		success:function(data){
			console.log(JSON.stringify(data));
			if(data.res){
//				html+='<img  style="position: relative;left: -25px;top: 0px;width: 20px;height: 20px;" src="../public/img/VIP1.png">';
				if(!data.res.userspic){
					html += '<img class="mui-media-object mui-pull-left" src="../public/img/4.jpeg" onclick=usersdata('+data.res.id+') />';
				}else{
					html += '<img class="mui-media-object mui-pull-left" src="'+getAvatar(data.res.userspic)+'" onclick=usersdata('+data.res.id+')  />';
				}
				    
					html += '<div class="mui-media-body" style="padding-left: 5px;">';
				if(!data.res.usersni){
					html += '<span style="line-height: 33px;">'+data.res.title+'<i class="mui-icon iconfont mui-red" style="font-size: 11px;margin-left: 6px;">';
				}else{
					html += '<span style="line-height: 33px;">'+data.res.usersni+'<i class="mui-icon iconfont mui-red" style="font-size: 11px;margin-left: 6px;">';
				}
				if(data.res.sex == 0){
					html += '&#xe621;</i></span>'; 
				}else{ 
					html += '&#xe620;</i></span>';
				}
	  			html += '<p style="color: #000000;"><i class="mui-icon iconfont" style="color: #ff6700;font-size: 14px;">&#xe61a;</i><span style="margin: 0 10px;"><a onclick=driver("'+data.res.id+'") style="color: #000000;">'+data.rew.drivername+'</a></span>'+
						'<i class="mui-icon iconfont" style="color: #F0AD4E">&#xe663;</i><span>'+data.res.usersmoney+'</span></p></div>';
			   
			    if(data.rex.code==1001){
			   	 html+='<img style="position: relative;left: -26px;top: -16px;width: 20px;height: 20px;" src="../public/img/VIP1.png">';
			    }
			}else{
				html += '<img class="mui-media-object mui-pull-left" src="../public/img/4.jpeg" onclick=login() /><p class="back font10" style="margin-top: 1.1em;"><span>您还未登录！</span></p>';
			}
			$('.mui-media').html(html);
			
		},error:function(e){
			   
		}
		
	});
	$('#qiandao').on('click',function(){
		if(!userid){
			alert('您还没有登录！！');
			return;
		}
		$.ajax({
			type:"get",
			url:apiRoot+"/home/user/qiandao",
			data : {
				userid : userid
			},
			dataType:'json',
			success:function(data){
				if(data > 0){
					toast('签到成功');
				}else{
					toast('已经签到过!')
				}
			},error:function(e){
				console.log(JSON.stringify(e))
			}
			
		});
	})
	
})  
function usersdata(id){
	if(!id){
		plus.webview.create('./login.html','login.html',{},{}).show('pop-in',250); 
	}else{
		plus.webview.create('./my-infor.html','my-infor.html',{},{usersid : id}).show('pop-in',250); 
	}
	
} 
function driver(id){
	plus.webview.create('./driver-grade.html','driver-grade.html',{},{usersid : id}).show('pop-in',250); 
}
function login(){
	plus.webview.create('./login.html','login.html',{},{}).show('pop-in',250); 
}
