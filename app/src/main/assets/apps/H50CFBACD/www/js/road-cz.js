var roadid;
document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
    roadid = ws.roadid;
   var html="";
   var xhtml="";
    var chtml="";
    var userid=plus.storage.getItem('userid');
    
    $.ajax({
    	type:"get",
    	url:apiRoot+"/home/Road/roadcz", 
    	data : {
    		roadid : roadid
    	},   
    	dataType:'json',
    	success:function(data){
	 	 console.log(JSON.stringify(data));
	    		$('#title').text(data.res.title);
	    		$('#username').text(data.userxin.usersni);
	    		$('#userspic').attr('src',getAvatar(data.userxin.userspic));
	    	    $('#userlike').text(data.numb);
	    	   switch(data.res.fengjing){ 
					case '1':
					html +=	'&#xe610;';
					break;
					case '2':
					html +=	'&#xe610; &#xe610;';
					break;
					case '3':
					html +=	'&#xe610; &#xe610; &#xe610;';
					break;
					case '4':
					html +=	'&#xe610; &#xe610; &#xe610; &#xe610;';
					break;
					default:
					html +=	'&#xe610; &#xe610; &#xe610; &#xe610; &#xe610;';
					break;
				}
	    	   $('#fengjin').html(html);
	    	   switch(data.res.nandu){ 
					case '1':
					xhtml +=	'&#xe610;';
					break;
					case '2':
					xhtml +=	'&#xe610; &#xe610;';
					break;
					case '3':
					xhtml +=	'&#xe610; &#xe610; &#xe610;';
					break;
					case '4':
					xhtml +=	'&#xe610; &#xe610; &#xe610; &#xe610;';
					break;
					default:
					xhtml +=	'&#xe610; &#xe610; &#xe610; &#xe610; &#xe610;';
					break;
				}
	    	   $('#nandu').html(xhtml);
	    	   $('#mileage').text(data.res.mileage);
	    	   $('#xuhang').text(data.res.xuhang);
	    	   $('#body').text(data.res.body)
	    	   $('#roadpic > img').attr('src',webRoot+data.res.roadpic);
	    	   $('#origin').val(data.res.origin);
	    	   $('#end').val(data.res.end);
	    	   $.each(data.rew, function(k,v) {
	    	   	 chtml +='<img src="'+webRoot+v+'" />';
	    	   	
	    	   });
	    	     $('#beipic').attr('src',webRoot+data.rew[0]);
	    	   $('#roadimgs').html(chtml);
      },error:function(e){
      	console.log(JSON.stringify(e)); 
      }
     });
     
     $('#wanye').on('tap',function(){
     	if(!userid){
     		plus.nativeUI.toast('请登录在操作')
     		return;
     	}
     	 $.ajax({
     	 	type:"get",
     	 	url:apiRoot+"/home/Road/roadcode", 
     	 	dataTpye:'json',
     	 	data:{
     	 		roadid:roadid,
     	 		userid:userid
     	 	},
     	 	success:function(data){
     	 		if(data!=2){
     	 		var tda=eval("("+data+")");
	          plus.webview.create('./club-chat.html','club-chat.html',{},{fid:tda[0].id,ftype:1,cludid :tda[0].id,fname:tda[0].name, cuseid : userid}).show('pop-in',200);
         }
     	 	},error:function(e){
     	 	 console.log(JSON.stringify(e))	
     	 	}
     	 });
     	
     	
     	
     	
     	
     })
     $('#xh').on('tap',function(){
     	 	console.log(roadid)
     	   $.getJSON(apiRoot+"/home/Road/roadxh",{lid:roadid,userid:userid},function(data){
     	   	     $('#userlike').text(data);
     	   })
     	
     	
     })
     plusReady();
})

function plusReady(){ 
	$('#weixin').on('tap',function(){shareChange(1);})     //微信
	$('#wxsline').on('tap',function(){shareChange(2);})		//朋友圈
	$('#qq').on('tap',function(){shareChange(0);})			//qq
	$('#kone').on('tap',function(){shareChange(0);})        //qq空间
	updateSerivces();
	if(plus.os.name=="Android"){
		Intent = plus.android.importClass("android.content.Intent");
		File = plus.android.importClass("java.io.File");
		Uri = plus.android.importClass("android.net.Uri");
		main = plus.android.runtimeMainActivity();
	}
}
/**
 * 更新分享服务
 */
function updateSerivces(){
	plus.share.getServices( function(s){
		shares={};
		for(var i in s){
			var t=s[i];
			shares[t.id]=t;
		}
	}, function(e){
		plus.nativeUI.toast( "获取分享服务列表失败："+e.message );
	} );
}
/**
 * 弹出分享平台选择
 */ 
function shareChange(i){
//	alert(i);
//	var uid = plus.storage.getItem('phone');
//	uid = uid?uid:'';
	var ids=[{id:"qq"},{id:"weixin",ex:"WXSceneSession"},{id:"weixin",ex:"WXSceneTimeline"},{id:"sinaweibo"}];
 	var s = shares[ids[i].id];
 	console.log(JSON.stringify(s))
	if ( s.authenticated ) {
		shareMessage(shares[ids[i].id],ids[i].ex); 
	} else {
		s.authorize( function(){
				shareMessage(shares[ids[i].id],ids[i].ex);
			},function(e){
			plus.nativeUI.alert( "认证授权失败"+e.message,null,'提示' );
		});
	}
}  
	/**
   * 发送分享消息
   * @param {plus.share.ShareService} s
   */
function shareMessage(s,ex){
//	console.log(goodsid + "," + title);
$('.mui-backdrop').remove();
	var sid = plus.storage.getItem('sid'); 
	sid = sid?sid:'';
//	alert(uid);
	var msg={title : 'Myway' , extra : {scene:ex}  , content:"亲，您的好友向你推荐好玩的地方！",href:apiRoot+'/home/Index/cludxl/id/'+roadid,thumbs:['/images/17.png']};
	s.send( msg, function(){
		plus.nativeUI.toast( "分享成功");
	}, function(e){ 
//		console.log(JSON.stringify(e));
		plus.nativeUI.toast( "分享失败" ); 

	});
}