document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
   $('.strarimg').on('click',function(){ 
		type = $(this).attr('cname');//区分照片
		plus.nativeUI.actionSheet({cancel:"取消",buttons:[{title:"拍照添加"},{title:"相册添加"}]},function(e){
			if(e.index == 1){
				var cmr = plus.camera.getCamera();
		        cmr.captureImage(function(path){
			     path = plus.io.convertLocalFileSystemURL(path);
					$("img[cname='"+type+"']").attr('src',path);
					appendpic(path,type);
               })
			  }else if(e.index == 2){
				plus.gallery.pick(function(path){
					$("img[cname='"+type+"']").attr('src',path);
					appendpic(path,type);
				});
			  }
		});
	})
   $('.tijiao').on('click',function(){
   	  var userid = plus.storage.getItem('userid');
   	  var name  = $('#shenf').val();
   	  var haoma  = $('#haoma').val();
   	  var zhifu  = $('#zhifu').val();
   	  var strarpic = plus.storage.getItem('strarpic');
   	  if(!haoma.match(sfz)){
   	  	plus.nativeUI.toast('请输入正确的有效身份证号码');
   	  	return;
   	  }
   	  if(!userid || !name || !haoma || !zhifu || !strarpic){
   	  	alert('请填写完信息！！'); 
   	  	return;
   	  }
   	  //教练申请
   	  $.ajax({
   	  	type:"get",
   	  	url:apiRoot+"/home/Stars/coash",
   	  	data : {
   	  		userid : userid,
   	  		username : name,
   	  		shenfnumber :　haoma,
   	  		zhifubao : zhifu,
   	  		userpic : strarpic
   	  	},
   	  	dataType:'json', 
   	  	success:function(data){
   	  		console.log(JSON.stringify(data))
   	  		if(data > 0){
   	  			plus.nativeUI.toast('提交成功,等待审核!');
	   	  		setTimeout(function(){
					ws.close(); 
				},1000)
   	  		}else{
   	  			plus.nativeUI.toast('已经提交过审核!请等待审核');
   	  		}
   	  		
   	  	},error:function(e){ 
   	  		console.log(JSON.stringify(e))
   	  	}
   	    
   	  });
	})
   
})