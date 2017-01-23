var userid ;
document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
    userid = plus.storage.getItem('userid');
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
    
    $('#chuanbtn').on('click',function(){
    	 if(!userid){
    	 	toast('请先登入');
    	 	return;
    	 }
    	 var avatar = plus.storage.getItem('userpic');
    //	 console.log(avatar);alert(avatar)
    	 var name = $('#name').val();
    	 var info = $('#cityResult').val();
    	 var address = $('#clubtext').val();
    	// alert(avatar +"--"+ name +"=="+ info +"=="+ address)
    	 if(!avatar || !name || !info || !address){
    	 	plus.nativeUI.toast('请输入完整信息！');return;
    	 }
    	 plus.nativeUI.showWaiting('正在创建，请稍后...');
    	 $.ajax({
    	 	type:"get",
    	 	url:apiRoot+"/home/club/AddClub", 
    	 	data : {
    	 		avatar : avatar,
    	 		name : name,
    	 		info : info,
    	 		address : address,
    	 		userid : userid
    	 	},
    	 	dataType:'json',
    	 	success:function(data){
    	 		console.log(JSON.stringify(data))
    	 		if(data > 0){
//  	 			plus.nativeUI.toast('创建成功');
					plus.webview.getWebviewById('club.html').reload();
					plus.nativeUI.closeWaiting();
					toast('创建成功');
					setTimeout(function(){ 
						ws.close();
					} , 1500); 
    	 		}
    	 	},
    	 	error:function(e){
    	 		console.log(JSON.stringify(e));
    	 		toast('失去网络');
    	 	}
    	 });
    })
    
})