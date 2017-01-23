document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
   var orderid  = ws.goodsid;
   console.log(orderid)
  	$('.topimg').on('click',function(){
		// 弹出系统选择按钮框
		plus.nativeUI.actionSheet( {cancel:"取消",buttons:[{title:"拍照添加"},{title:"相册添加"}]}, function(e){
			if(e.index==1){
				getImage();
			}else if(e.index==2){
				appendByGalleryMul(); 
			}
		} );
	})
	//拍照
	function getImage(){    
		var cmr = plus.camera.getCamera();
		cmr.captureImage(function(path) {
			path = plus.io.convertLocalFileSystemURL(path);
			appendPic(path);
			$('#showimg').append('<img src="file://'+path+'"/>');
//			setWH();//调整图片宽高
		}, function(err) {
			console.log(JSON.stringify(e));
		});
	}
	// 从相册添加文件  多选图片
	var del_index = 0;
	function appendByGalleryMul() {
		plus.gallery.pick(function (e){
			var html = ''; 
		    for(var i in e.files){
		    	appendPic(e.files[i]);  
		    	html+='<img src="'+e.files[i]+'"/>';
	    	}
			$('#showimg').append(html);
//			setWH();//调整图片宽高
		}, function(e){
			console.log(JSON.stringify(e));
		},{multiple:true});
	}
	// 添加照片        
	var upload_pic=[];		// 照片数组
	var pic_index = 1;
	function appendPic(p) {
		upload_pic.push({name:"uploadkey"+pic_index,path:p});
		pic_index++;
	}
	
	$('#fabiao').on('click',function(){
		var userid = plus.storage.getItem('userid');//用户id
		var content = $('.content').val();
		
		if(!content.trim() && upload_pic.length < 1){
			$("#content").val('');
			toast('没有信息无法发表！');return;
		}
		
		plus.nativeUI.showWaiting('正在上传，请稍后...');
		//console.log(JSON.stringify(upload_pic));
		if(upload_pic.length >= 1){
			
			var server = apiRoot +'/home/front/uploadPicture';
			
			var task = plus.uploader.createUpload(server,{method: "POST"},function(t, status) { 
				if (status == 200) {
					plus.nativeUI.closeWaiting();
					pic = t.responseText;
					if(pic.msg){
						errortoast(pic.msg);
						console.log(pic);
						return;
					}
					console.log(pic);
					if(pic != '-1'){
						//console.log(apiRoot +'/Home/order/orderrate/userid/'+userid+"/pintext/"+content+"/pinlimg/"+pic+"/orderid/"+orderid)
						//保存到数据库
						$.ajax({
							type :"get",
							url:apiRoot +"/Home/order/orderrate",
							data :{
								userid : userid,
								orderid : orderid,
								pintext : content,
								pinlimg : pic
							},
							dataType :'json',   
							success :function(data){
								console.log(JSON.stringify(data));
								if(data){
									plus.webview.getWebviewById('my-order.html').reload();
									plus.nativeUI.closeWaiting();
									toast('发表成功');
									setTimeout(function(){ 
										ws.close();
									} , 1500); 
									
								}
							},
							error :function(e){
								console.log(JSON.stringify(e));
								errortoast();
							}
						});
					}else{
						
						toast('操作成功');
					}
				} else {
					plus.nativeUI.closeWaiting();
					toast('上传图片失败！');
					return;
				}
			})
			for(var i in upload_pic){
				var f=upload_pic[i];
				task.addFile(f.path,{key:f.name});
			}
			task.start();
		}else{
			$.ajax({
				type :"get",
				url:apiRoot +'/Home/order/orderrate',
				data :{
					userid : userid,
					orderid : orderid,
					pintext : content
					
				},
				dataType :'json',
				success :function(data){
					console.log(JSON.stringify(data));
					if(data > 0){
						plus.webview.getWebviewById('my-order.html').reload();
						//if(spage)plus.webview.getWebviewById(spage).reload();
						plus.nativeUI.closeWaiting();
						toast('发布成功');
						setTimeout(function(){ 
							ws.close();
						} , 1500); 
					}
				},
				error :function(e){
					console.log(JSON.stringify(e));
					errortoast();
				}
			});
		}
	
	})
  

})