var userid;
document.addEventListener('plusready',function(){
	 userid = plus.storage.getItem('userid');//用户id
	var ws = plus.webview.currentWebview();
	$('.userimg').on('click',function(){ 
		type = $(this).attr('cname');//区分照片
		plus.nativeUI.actionSheet({cancel:"取消",buttons:[{title:"拍照添加"},{title:"相册添加"}]},function(e){
			if(e.index == 1){
				console.log(23)
				var car =plus.camera.getCamera();
				car.captureImage(function(path){
					//展示图片
//				console.log(plus.io.convertLocalFileSystemURL(path));
					$("img[cname='"+type+"']").attr('src','file://' + plus.io.convertLocalFileSystemURL(path));
					appendpic(path,type);
				},function(err){});
				
			}else if(e.index == 2){
				plus.gallery.pick(function(path){
					$("img[cname='"+type+"']").attr('src',path);
					appendpic(path,type);
				});
			}
		});
	})
	
	$('#fabu').on('click',function(){
		var acticityimg = plus.storage.getItem('type');
		var activityname = $('#activityname').val();
		var activityaddr = $('#activityaddr').val();
		var kstime = $('#kstime').val();
		var overtime = $('#overtime').val();
		var activityress = $('#activityress').val();
		if(!userid){
			toast('请先登录！');return;
		}
		if(!acticityimg||!activityname||!activityaddr||!activityress){
		 toast('请完善内容！');return;	
		}
		if(kstime > overtime) {
			toast('请输入正确的时间');return;
		}
		 plus.nativeUI.showWaiting('正在创建，请稍后...');
		$.ajax({
			type:"get",
			url:apiRoot+"/home/activity/addactivity",
			data : {
				userid : userid,
				articleimg : acticityimg,
				article : activityname,
				articleaddr : activityaddr,
				articletime : kstime,
				overtime : overtime,
				articletext : activityress
			},
			dataType:'json',
			success:function(data){
				plus.nativeUI.closeWaiting();
				plus.storage.setItem('type','');
				toast('发布成功');
				setTimeout(function(){ 
					ws.close();
				} , 1500);
				plus.webview.open('activity.html');
//				plus.webview.getWebviewById('activity.html').reload();
			},error:function(e){
				
			}
		})
	})
	

})