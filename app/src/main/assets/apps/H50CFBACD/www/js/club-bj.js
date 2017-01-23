document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
   var userid = plus.storage.getItem('userid');
   var cludid = ws.cludid;
   var spage = ws.spage;
   $.ajax({
	   	type:"get",
	   	url:apiRoot+"/home/club/clubxinxi",
	   	data :{
	   		cludid : cludid
	   	},
	   	dataType:'json',
	   	success:function(data){
	   		$('#clubimg >img').attr('src',webRoot+data.avatar);
			$('#clubname').val(data.name);
			$('#cityResult').val(data.info);
			$('#clubtext').val(data.address);
	   	},error:function(e){
	   		
	   	}
   });
   
   $('.userimg').on('click',function(){ 
		type = $(this).attr('cname');//区分照片
		plus.nativeUI.actionSheet({cancel:"取消",buttons:[{title:"拍照添加"},{title:"相册添加"}]},function(e){
			if(e.index == 1){
				var car =plus.camera.getCamera();
				car.captureImage(function(path){
					//展示图片
				console.log(plus.io.convertLocalFileSystemURL(path));
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
   
   $('#wanc').on('click',function(){
   	
	   	var clubname = $('#clubname').val();
		var cityResult = $('#cityResult').val();
		var clubtext =$('#clubtext').val();
   		var avatar = plus.storage.getItem('userpic');
   		//console.log(apiRoot+"/home/club/clubbj/aid/"+cludid+"/name/"+clubname+"/info/"+cityResult+"/address/"+clubtext+"/avatar/"+avatar)
   	    
   	    $.ajax({
   	    	type:"get",
   	    	url:apiRoot+"/home/club/clubbj",
   	    	data : {
   	    		aid : cludid,
   	    		name : clubname,
   	    		info : cityResult,
   	    		address : clubtext,
   	    		avatar : avatar
   	    	},
   	    	dataType:'json',
   	    	success:function(data){
   	    		plus.webview.getWebviewById('club-message.html').reload();
					plus.nativeUI.closeWaiting();
					toast('修改成功');
					setTimeout(function(){ 
						ws.close();
				} , 1500); 
   	    	},error:function(e){
   	    		console.log(JSON.stringify(e));
   	    	}
   	    	
   	    });
   	
   })
   
   

})