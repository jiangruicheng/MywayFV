document.addEventListener('plusready',function(){
	var userid = plus.storage.getItem('userid');//用户id
	var ws = plus.webview.currentWebview();
	var html = "";
	var xhtml = "";
      $.ajax({
	   	type:"get",
	   	url:apiRoot+"/home/activity/activitymylist",
	   	data : {
	   		userid : userid
	   	},
	   	dataType:'json',
	   	success:function(data){
	   		//console.log(JSON.stringify(data));
	   		$.each(data.req, function(k,v) {  
	   			//console.log(JSON.stringify(v)) 
	   		html+='<div style="margin-top: 4px;"><ul class="mui-table-view"><li class="mui-table-view-cell mui-media">'+
				'<img class="mui-media-object mui-pull-left" src="'+getAvatar(v.user.userspic)+'" /><div class="mui-media-body">'+
				'<span style="line-height: 40px;">'+v.user.usersni+'<i class="mui-icon iconfont" style="color: #FFAD19;margin-left: 5px;">&#xe605;</i></span>'+
				'<button type="button" onclick=join('+v.id+')>参加活动</button></div></li>'+
				'<p onclick=activitydetails('+v.id+') style="height:280px"><img src="'+webRoot+v.articleimg+'" style="width:100%; height:100%"/></p><li class="mui-table-view-cell">'+
				'<h4>'+v.articleaddr+'</h4><p style="margin-top: 5px;"><i class="mui-icon iconfont" style="font-size: 14px;color: #FFAD19;">&#xe617;</i> '+v.articleaddr+'</p>'+
				'<p><i class="mui-icon iconfont" style="font-size: 14px;color: #FF614F;">&#xe62a;</i> 距离活动开始时间还有1天3小时</p></li></ul></div>';
	   		});
	   		$('.mui-scroll').html(html);
	   		
	   		$.each(data.res, function(k1,v1){  
	   			console.log(JSON.stringify(v1))
	   		xhtml+='<div style="margin-top: 4px;"><ul class="mui-table-view"><li class="mui-table-view-cell mui-media">'+
				'<img class="mui-media-object mui-pull-left" src="'+getAvatar(v1.user.userspic)+'" /><div class="mui-media-body">'+
				'<span style="line-height: 40px;">'+v1.user.usersni+'<i class="mui-icon iconfont" style="color: #FFAD19;margin-left: 5px;">&#xe605;</i></span>'+
				'<button type="button" onclick=join('+v1.id+')>参加活动</button></div></li>'+
				'<p onclick=activitydetails('+v1.id+') style="height:280px"><img src="'+webRoot+v1.articleimg+'" style="width:100%; height:100%"/></p><li class="mui-table-view-cell">'+
				'<h4>'+v1.articleaddr+'</h4><p style="margin-top: 5px;"><i class="mui-icon iconfont" style="font-size: 14px;color: #FFAD19;">&#xe617;</i> '+v1.articleaddr+'</p>'+
				'<p><i class="mui-icon iconfont" style="font-size: 14px;color: #FF614F;">&#xe62a;</i> 距离活动开始时间还有1天3小时</p></li></ul></div>';
	   		});
	   		$('#item2').html(xhtml); 
	   		 
	   	},error:function(e){
	   		
   	}
   })

})

function activitydetails(id){
	plus.webview.create('./activity-details.html','activity-details.html',{},{activityid : id}).show('pop-in',200);
}
function join(id){
	var userid = plus.storage.getItem('userid');
	$.ajax({ 
		type:"get",
	   	url:apiRoot+"/home/activity/activityjson",
	   	data : {
	   		userid : userid,
	   		activityid : id
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
}