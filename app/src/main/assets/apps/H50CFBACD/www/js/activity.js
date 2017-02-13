document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
   var html = ""; 
   plus.nativeUI.showWaiting();
   $.ajax({
   	type:"get",
   	url:apiRoot+"/home/activity/activitylist",
   	dataType:'json',
   	success:function(data){
   		plus.nativeUI.closeWaiting();
   		$.each(data, function(k,v) { 
   			console.log(JSON.stringify(v))
   			if(v.user!=null){
   		html+='<div style="margin-top: 4px;"><ul class="mui-table-view"><li class="mui-table-view-cell mui-media">'+
			'<img class="mui-media-object mui-pull-left" src="'+getAvatar(v.user.userspic)+'" /><div class="mui-media-body">'+
			'<span style="line-height: 40px;">'+v.user.usersni+'<i class="mui-icon iconfont" style="color: #FFAD19;margin-left: 5px;">&#xe605;</i></span>'+
			'<button type="button" onclick=join('+v.id+')>参加活动</button></div></li>'+
			'<p onclick=activitydetails('+v.id+') style="height:280px"><img src="'+webRoot+v.articleimg+'" style="width:100%; height:100%"/></p><li class="mui-table-view-cell">'+
			'<h4>'+v.article+'</h4><p style="margin-top: 5px;"><i class="mui-icon iconfont" style="font-size: 14px;color: #FFAD19;">&#xe617;</i> '+v.articleaddr+'</p>'+
			'<p><i class="mui-icon iconfont" style="font-size: 14px;color: #FF614F;">&#xe62a;</i> 距离活动开始时间还有'+v.ti+'</p></li></ul></div>';
   		}});
   		 
   		$('.mui-content').html(html); 
   		plus.nativeUI.closeWaiting();
   	},error:function(e){
   		
   	}
   })
   
})
function activitydetails(id){
	plus.webview.create('./activity-details.html','activity-details.html',{},{activityid : id}).show('pop-in',200);
}
function join(id){
	var userid = plus.storage.getItem('userid');
	if(!userid){
		plus.nativeUI.toast('请先登录')
		return;
	}
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
 
	//倒计时定时器  
function show_time(){ 
    var time_start = new Date().getTime();//设定当前时间
    var time_start = Math.floor(time_start/1000);  
    var time = plus.storage.getItem('time'); 
    var time_end = time;//设定目标时间
//  console.log(time_end +'---'+time_start);
//     计算时间差     
    var time_distance = time_end - time_start; 
    if(time_distance >= 0){
    	// 天    
	    var int_day = Math.floor(time_distance/86400);
	    time_distance -= int_day * 86400; 
	    // 时
	    var int_hour = Math.floor(time_distance/3600); 
	    time_distance -= int_hour * 3600; 
	    // 分
	    var int_minute = Math.floor(time_distance/60); 
	    time_distance -= int_minute * 60; 
	//  console.log(time_distance);
	    // 秒 
	    var int_second = time_distance;  
	    // 时分秒为单数时、前面加零  
	             
	    if(int_day < 10){   
	        int_day = "0" + int_day;  
	    }   
	    if(int_hour < 10){ 
	        int_hour = "0" + int_hour; 
	    }  
	    if(int_minute < 10){ 
	        int_minute = "0" + int_minute; 
	    } 
	    if(int_second < 10){
	        int_second = "0" + int_second; 
	    }    
	    // 显示时间      
	//  $(".miao").text('00');
//	    console.log(int_day);
	    if(int_day > 0){  
	    	$(".day").text(int_day); 
		    $(".shi").text(int_hour); 
		    $(".fen").text(int_minute); 
		    $(".miao").text(int_second);
	    }else{
	    	$(".day").css('display','none');
	    	$(".tian").css('display','none');
	    	$(".shi").text(int_hour); 
		    $(".fen").text(int_minute); 
		    $(".miao").text(int_second);
	    }
	            
    }else{    
//  	alert(time_start);  
    	$.ajax({      
			type:"get",     
			url:apiRoot + "?m=Home&c=shangp&a=dingshi",
			data:{
				shij:time_start
			}, 
			dataType:'json',      
			success:function(data){
				if(data){
	//				console.log(JSON.stringify(data));
					plus.storage.setItem('time',data.cxtime + '');
					$('.xspic').attr('src',(data.lbpic?getuserPic(data.lbpic):"../public/img/34.png"));
					var time = plus.storage.getItem('time');
	//				console.log(data.cxtime+'---'+time);
				}       
			},          
			error:function(e){
//				plus.nativeUI.closeWaiting();
				plus.nativeUI.toast( "连接失败，请重试。");
			}    
		});
    }
    
         
  
}