	var index = 1;
	var files = [];
	var picc = "";
document.addEventListener('plusready',function(){
	var aaa = 123;
//	//数据
//	$('.btn').on('click',function(){
//
//		var url = $('.shangchuan').attr('src');
//		var name = $('.name').val();
//		var sex = $('.sex').val();
//		var url = url.substr((url.indexOf('com') + 3));
////		alert(name + ' '+ sex + ' ' + url); 
//
////		console.log(typeof(url)+' '+JSON.stringify(url));
//		plus.storage.setItem('pic',url);
//		plus.storage.setItem('name',name);
//		plus.storage.setItem('sex',sex);
//		if(name && sex && url){
//			plus.webview.create('./person3.html','person3.html').show('slide-in-right');
//		}  
//	}) 
},false)
//添加图片
function appendpic(p,type){
	plus.nativeUI.showWaiting('图片处理中...');
	//创建新的路径
//				var newpath = p.replace(/\./g , new Date().gettime() + '.');
	var newpath = p.replace(/\./g , new Date().getTime()+'.');
	
	plus.zip.compressImage({
			src : p,
			dst : newpath,
			quality : 20
		},
		function(){//毁掉成功
			files.push({name : "uploadkey" + index,path:p});
			index++;
			upload(type);
		},
		function(error){
		alert('压缩图片失败');
	})
}

//处理
function upload(type){
	 
	if(files.length <= 0){
		toast("请上传头像！");
	}
	 
	var server = apiRoot + "/home/Front/uploadOnePic"; 
	console.log(server);
	var task = plus.uploader.createUpload(server,
	    {method:"post"},
		function(t,status){ //上传完成
			plus.nativeUI.closeWaiting();
			if(status == 200){
				picc = t.responseText;
				console.log(webRoot+t.responseText);
				$(".shangchuan").attr('src',webRoot+t.responseText);
				plus.storage.setItem(type,t.responseText)
//				console.log(type+" "+plus.storage.getItem('type'))
//					plus.nativeUI.toast('处理完成' + t.responseText);
			}else{
				plus.nativeUI.alert('上传失败：' + status);
				
			}
			
		},function () {
			plus.nativeUI.closeWaiting();
		}
		
	);
	for(var i = 0;i　<　files.length ; i++){
		var f =files[i];
		task.addFile(f.path,{key:f.name});
	}
	task.start();
}
