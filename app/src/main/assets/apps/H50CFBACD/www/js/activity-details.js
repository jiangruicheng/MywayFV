document.addEventListener('plusready',function(){
	var userid = plus.storage.getItem('userid');//用户id
	var ws = plus.webview.currentWebview();
	var activityid = ws.activityid;
	var html = "";
	var xhtml = "";
	var chtml = "";
	console.log(activityid)
	 plus.storage.setItem('sid',activityid); 
	$.ajax({
		type:"get",
		url:apiRoot+"/home/activity/activitydetail",
		data : {
			activityid : activityid
		},  
		dataType:'json',
		success:function(data){
			console.log(JSON.stringify(data));
				$('#activity >img ').attr('src',getAvatar(data.rev.userspic));
				$('#username').text(data.rev.usersni)
				$('#activityimg > img').attr('src',webRoot+data.res.articleimg);
				html = '<h4>'+data.res.article+'</h4>'+
						'<p style="margin-top: 5px;"><i class="mui-icon iconfont" style="font-size: 14px;color: #FFAD19;">&#xe617;</i>'+data.res.articleaddr+'</p>'+
						'<p><i class="mui-icon iconfont" style="font-size: 14px;color: #FF614F;">&#xe62a;</i> 距离活动开始时间还有'+data.ti+'</p>';
			    $('#activityxinx').html(html);
			    $('#activityress').text(data.res.articletext);
			    $('#punl').text(data.rea);
				$('#joins').text(data.req); 
				$.each(data.rew,function(k1,v1){
					
					xhtml += '<li class="mui-media mui-table-view-cell"> '+
							 '<img class="mui-media-object mui-pull-left" src="'+getAvatar(v1.users.userspic)+'" />'+
							 '<div class="mui-media-body">'+
							 '<span>'+v1.users.usersni+'</span><i class="mui-icon iconfont mui-yellow" style="margin-left: 6px;font-size: 14px;">&#xe605;</i>'+
							 '<p style="color: #000000;font-size: 12px;">'+v1.usertime+'</p>'+ 
							 '</div></li>';
				})    
			    $('#joinlist').html(xhtml);
			    $.each(data.reb,function(k2,v2){
					console.log(JSON.stringify(v2));
					chtml += '<li class="mui-media mui-table-view-cell">'+ 
							'<img class="mui-media-object mui-pull-left" src="'+getAvatar(v2.users.userspic)+'" />'+
							'<div class="mui-media-body"><span>'+v2.users.usersni+'</span><i class="mui-icon iconfont mui-yellow" style="margin-left: 6px;font-size: 14px;">&#xe605;</i>'+
							'<p style="color: #000000;font-size: 12px;">'+v2.addtime+'</p>'+
							'<p style="color: #000000;">'+v2.pintext+'</p>'+
							'</div></li>';   
				})    
				$('#pinlist').html(chtml);
		},error:function(e){
			 console.log(JSON.stringify(e))
		}
	});
	
	
	//评价
	$('#fasong').on('click',function(){
		var  pinress = $('#pinress').val();
		if(!pinress){
			toast('评论不能为空！');
			return;
		}
		$.ajax({
			type:"get",
			url:apiRoot+"/home/activity/activitypin",
			data : {
				userid : userid,
				activity : activityid,
				pintext : pinress
			},
			dataType:'json',
			success:function(data){
				location = location;
			},error:function(e){
				console.log(JSON.stringify(e))
			}
			
		});
		
	})
	//参加活动
	 $('#join').on('click',function(){
	 	
	 	$.ajax({ 
			type:"get",
		   	url:apiRoot+"/home/activity/activityjson",
		   	data : {
		   		userid : userid,
		   		activityid : activityid
		   	},
		   	dataType:'json',
		   	success:function(data){
		   		if(data > 0){
		   			toast('参加成功！！')
		   		}else{
		   			toast('已经加入了！！')
		   		}
		   		
		   	},error:function(e){
		   		
		   	}
		})
	 	
	 	
	 })


})