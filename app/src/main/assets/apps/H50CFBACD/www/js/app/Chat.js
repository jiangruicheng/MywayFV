/**
 * Chat.js
 * Chat.html文件的专属js文件
 * 
 * 模板对应的js文件，为对应文件的所有js代码部分
 * 
 * @package  js
 * @author  aying
 * @version   Chat.js  add by aying 2016-10-13 19:00
 * 
 */
var ws = null; //当前窗口对象
var uid = null; //用户ID
var fid = null; //好友id
var ftype = 0; //好友类型  0=好友；1=群组
var readtime = 0; //上一次阅读时间
var first = 0;
var page = 1; //页码
var maxid = 0;
var name = null;
var imageViewer = null;
var noreads = null;
var uploading = 0;
var pics = "";
//var first2 = null;

var prevTime=0, avatar, comein=1, minid=0, doc;//上一条消息的时间
var isstart = 1;
var content,pic,video,videopic;	//图片/视频/视频缩略图
document.addEventListener('plusready', function() {
	
	
	imageViewer = new mui.ImageViewer('.msg-content-image', {
		dbl: false
	});
	//	plus.storage.removeItem('ids');
	//	var ids = plus.storage.getItem('ids');
	//	console.log(ids);
	ws = plus.webview.currentWebview();
	uid = plus.storage.getItem('userid');
	avatar = plus.storage.getItem('userspic');console.log(avatar);
	//alert(uid);alert(avatar)
	avatar = getAvatar(avatar);
	fid = ws.fid;
	console.log(fid);
	ftype = ws.ftype;
	name = ws.fname;
	console.log(JSON.stringify(name)); 
	//noreads = ws.noreads;
	if(!name){
		name = plus.storage.getItem('companyname');//公司群
		ftype = 1;
	}
	console.log('fid:'+fid+','+'ftype:'+ftype+','+'name:'+name+','+'maxid:'+maxid);
	$('#name').text(name);
	$("#fname").html(name);
	$("#loadHistory").show();
	findChatsByfid();
	//findChatHistory();
	doc = document.getElementById('msg-list');
	doc.addEventListener('scroll', function() {
		var scrollTop = doc.scrollTop;
		var hh = $('#msg-list').height();
		if(scrollTop == 0 && (hh > $(document).height() -44)) {
			plus.nativeUI.showWaiting('loading...');
			findChatHistory();
		}
	})
	
	/*发文字*/
	$('#send').on('tap',function () {
		var msg = $('#msg-text').val();
		if(!msg){
			return;
		}
		sendMessage(msg);
	})	

		/*发图片*/
	$('#sendimg').on('tap',function () {
		picc = '';
		type = $(this).attr('cname');//区分照片
		plus.nativeUI.actionSheet({cancel:"取消",buttons:[{title:"拍照添加"},{title:"相册添加"}]},function(e){
			if(e.index == 1){
				var car =plus.camera.getCamera();
				car.captureImage(function(path){
					//展示图片
				//console.log(plus.io.convertLocalFileSystemURL(path));
//					$("img[cname='"+type+"']").attr('src','file://' + plus.io.convertLocalFileSystemURL(path));
					appendpic(path,type);
//					files ={path:path};
                     
				},function(err){});
				
			}else if(e.index == 2){
				plus.gallery.pick(function(path){
//					$("img[cname='"+type+"']").attr('src',path);
					appendpic(path,type);
//				files ={path:path};
});
			}
		});
		tt = setInterval(function(){
			if(picc != '')sendPicture(1);
		}, 1500);

		})
	
	/*发视频*/
	$('.uploadvideo').on('click', function(){
//  	if(video){
//  		toast('您已上传视频');return;
//  	}
     	$('#file').click();
    })
	
    	//上传视频
   $('#file').change(function(){
    	plus.nativeUI.showWaiting('处理中');
    	var fileName = $('#file').val();
    	console.log(fileName);
		if(fileName){	//视频操作  
			var ldot = fileName.lastIndexOf("."); 
	        var type = fileName.substring(ldot + 1);  
	        if(type == "avi"|| type == "wmv"|| type == "rm"|| type == "rmvb"|| type == "mpeg"|| type == "mp4"|| type == "MOV"|| type == "asf") {
			      //通过表单对象创建 FormData    
			      var fd = new FormData();
			      fd.append("file", document.getElementById("file").files[0]);
			      //XMLHttpRequest 原生方式发送请求 
			      var xhr = new XMLHttpRequest(); 
			   
			      xhr.open("POST" ,apiRoot+'?m=Home&c=Chat&a=uploadVideo', true);  
			      xhr.send(fd);
			      xhr.onload = function(e) { 
			      	if (this.status == 200) { 
			        	var data = $.parseJSON(this.responseText);
						
						if(data){
				        	video = data.videos;
				        	videopic = data.slpic;
				        	console.log(video+" "+videopic);
		        			plus.nativeUI.closeWaiting();
		        			videoadd(video,videopic)
//		        			$('.vedio').show();
//				        	$('.vedio').attr('display', 'block');
//				        	$('.vedio').attr('src',webRoot + video);
//					        $('.vedio').attr('poster',webRoot + videopic);
						}
			        }else{
			        	plus.nativeUI.closeWaiting(); 
			        	toast('上传失败!视频要小于10M');
			        	console.log(this.status);
			        }
		         };
	        }else{
	        	plus.nativeUI.closeWaiting();
	        	console.log('不支持该格式文件');
	        	return;
	        }
		}
    })
	/*发红包*/
	$('#red').on('tap',function () {
		setTimeout(function () {
			goNewPage('club-red1.html',{webpage:ws.id,ftype:ftype});
		},50);
	})	
	
	$('#sendred').on('tap',sendRed);/*发出红包*/
	
	
}, false);
var tt ;
/**
 * 读取用户与好友的聊天内容；
 *
 * @param int uid  //用户id 
 * @return 无 
 * [example]
 *   findChatsByfid();
 * [/example]
 **/
function findChatsByfid() {
	if(!uid || !fid) {
		$("#loadHistory").hide();
		return;
	}
	$.ajax({
		type:"post",
		url:apiRoot+'?m=Home&c=Chat&a=findChatsByfid',
		async:true,
		dataType:"json",
		data:{
			uid:uid,
			fid:fid,
			minid:minid,
			page:1,
			ftype:ftype,
			isstart:isstart
		},
		success: function(data) {
				$("#loadHistory").hide();
				isstart = 2;
			if(data.status == 1){
	//			var indexPage = plus.webview.getLaunchWebview();
				var indexPage = '../index.html';
					indexPage = plus.webview.getWebviewById(indexPage);
				var messagePage = 'view/Message.html';
					messagePage = plus.webview.getWebviewById(messagePage);
				if(comein !=1) {
					indexPage.evalJS('changeNoReads(' + data.new + ');');
					messagePage.evalJS('removeNumber("' + fid + '","'+ ftype +'");');
				}
					comein = 0;
				//	 plus.nativeUI.closeWaiting();
				//	 console.log(JSON.stringify(data)); 
				if(data.info) {
					bindHtml(data.info);
				}
			}
			setTimeout(function() {
				findChatsByfid();
			}, 1500);
		},
		error: function(e) {
			$("#loadHistory").hide();
			//errortoast();
			setTimeout(function() {
				findChatsByfid();
			}, 10000);
		}
	});
}
/**
 * 前往聊天页面
 **/
function goChat(fid, name, ftype) {
	var w_f = plus.webview.create('Chat.html', 'Chat.html', {}, {
		fid: fid,
		fname: name,
		ftype: ftype
	});
	w_f.show('pop-in');
}
/**
 * 将聊天内容记载显示在页面
 *
 * @param object data  //用户id 
 * "id":"3","uid":"18","friendid":"20","addtime":"2015-12-23 17:31:07","message":"！","isReading":"1","type":"0","sendAvatar":"/uploads/2015/12/5678e7f6a075a.jpg"
 * @return 无 
 * [example]
 *   bindHtml(data);
 * [/example]
 **/
var msgTypeArr = new Array('text', 'image', 'sound', 'red');

function bindHtml(data) {
	//	console.log(JSON.stringify(data));
	if(!data) {
		return;
	}
	var html = '';
		minid = data[0].aid;console.log(minid);//用于更新
		maxid = data[data.length-1].aid;console.log(maxid);//用于往上轮询
		//$.each(data, function(key,vo) { 
	for(var i = data.length - 1; i >= 0; i--) {
		var vo = data[i];
		
		readtime = vo.createtime;
		var sendAvatar = "";
		sendAvatar = getAvatar(vo.userspic);
//		console.log(avatar);
//		if(!vo.sendAvatar) {
//			sendAvatar = 'img/default-avatar.png';
//		} else {
//			sendAvatar = getuserPic(vo.sendAvatar);
//		} 
		if(vo.createtime && (parseInt(vo.createtime) - prevTime)>600){
			html += '<div class="time">' + turnChatTime(vo.createtime)+'</div>';/*两条消息间隙超过10m*/
		} 
		prevTime = vo.createtime;
		
		html += '<div class="msg-item ' + (vo.uid == uid ? 'chat-me-hear' : 'chat-ta-hear') + '" msg-type="' + msgTypeArr[vo.type] + '" msg-content="' + vo.message + '">';
		html += '<img ';
		if(vo.uid != uid && ftype == 1) {
			html += ' onclick="goChat(' + vo.uid + ',\'' + vo.usersni + '\',0);" ';
		}
		html += ' class="frien_img' + (vo.uid == uid ? ' imgme' : ' imgher') + '" src="' + (vo.uid == uid ? avatar : sendAvatar) + '" alt="" style="width:45px;" />';
		html += '<div class="'+ (vo.uid == uid ? 'chat-me' : 'chat-ta') + '" msgid="' + vo.aid + '">';
		if(msgTypeArr[vo.type] == 'text') {
			html += '' + vo.message;
		} else if(msgTypeArr[vo.type] == 'image') {
			var pic = '';
			if(vo.message) {
				pic = getuserPic(vo.message);
			}
			html += '<img class="msg-content-image" src="' + pic + '" style="max-width: 100px;" />';
		} else if(msgTypeArr[vo.type] == 'sound') {
			html += '<div onclick="player(' + vo['aid'] + ',\'' + getuserPic(vo.message) + '\')"><span class="mui-icon mui-icon-mic" style="font-size: 18px;font-weight: bold;"></span><span class="play-state" id="sound' + vo['aid'] + '">Click play</span><audio id="audio' + vo['aid'] + '" style="display:none" controls preload="none"><source src="' + getuserPic(vo.message) + '" controls></source></audio></div>';
			//	  	html += '<span class="mui-icon mui-icon-mic" style="font-size: 18px;font-weight: bold;"></span><span class="play-state" id="sound'+vo['id']+'" onclick="player('+vo['id']+',\''+getuserPic(vo.message)+'\')">点击播放</span>';
		} else if(msgTypeArr[vo.type] == 'red') {
			html += '<ul class="mui-table-view" onclick="openRed('+ vo.redid +')">'+
						'<li class="mui-table-view-cell mui-media confirmBtn" style="background: #FA9D3B;">'+
							'<img class="mui-media-object mui-pull-left" src="../public/img/43.jpg" style="max-width: 30px;height: 35px;margin-top: 5px;" />'+
							'<div class="mui-media-body" style="padding: 0;">'+
								'<span class="font-14 white" style="text-align: left;">'+ vo.message +'</span>'+
								'<p class="font-12 white" style="text-align: left;">查看礼包</p>'+
							'</div>'+
						'</li>'+
						'<li class="mui-table-view-cell">'+
							'<p style="font-size: 12px;line-height: 0px;">金币礼包</p>'+
						'</li>'+
					'</ul>';
		}else{
			html += '<video width="175" height="" controls="controls" poster="'+ getuserPic(vo.video) +'">'+
				     	'<source src="'+ getuserPic(vo.message) +'" type="video/mp4"></source>'+
//				     '<img src="'+ getuserPic(vo.video) +'"/>'+
				     '</video>';
		} 
		html += '</div></div>';
		//	 console.log(maxid) 
	}
	$("#msg-list").append(html);
	
	imageViewer.findAllImage();
	doc.scrollTop = doc.scrollHeight + doc.offsetHeight;
	first = 1;

//	$('.msg-content').on('longtap', function() {
//		var msgid = $(this).attr('msgid');
//		addCollect(msgid);
//	});
}

/**
 * 发送文字消息
 *
 * @param int uid  //用户id
 * @param int fid  //好友id
 * @param int message  //发送消息
 * @return 无 
 **/
function sendMessage(message) {
	//console.log('222');
	if(!uid || !fid) {
		return;
	}
	if(!message.trim() || message.trim() == '') {
		toast('Send content can not be empty');
		return;
	}
	if(readtime <= 0) {
		readtime = 1;
	}
//	var nowtime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
	$.ajax({
		type: "post",
		url: apiRoot+'?m=Home&c=Chat&a=sendMessage',
		dataType: 'json',
		data: {
			uid:uid,
			fid:fid,
			message:message,
			type:0,
			ftype:ftype
		},/*'m=chat&a=sendMessage&uid=' + uid + '&fid=' + fid + '&message=' + message + '&ftype=' + ftype,*/
		success: function(data) {
			plus.nativeUI.closeWaiting();
			//	 console.log(JSON.stringify(data));
			if(data > 0) {
				var html = 	'<div class="chat-me-hear">'+
				'<div class="frien_img">'+
					'<img src="'+ avatar +'"/>'+
				'</div>'+
				'<div class="chat-me">'+ message +'</div>'	+
			'</div>';
//				var html = '<div class="msg-item msg-item-self " msg-type="text" msg-content="' + message + '">';/*<div class="time">' + nowtime + '</div>*/
//				html += '<img class="msg-user-img-self" src="' + avatar + '" alt="" />';
//				html += '<div class="msg-content"><div class="msg-content-inner">' + message + '</div><div class="msg-content-arrow"></div></div><div class="mui-item-clear"></div></div>';
				$("#msg-list").append(html);
				$("#msg-text").val('');
				scrolls();
				//	 var doc = document.getElementById('msg-list');
				//	 doc.scrollTop = doc.scrollHeight + doc.offsetHeight;
			}
		},
		error: function(e) {
			errortoast();
		}
	});

}
/**
 * 发送视频消息
 *
 * @param int uid  //用户id
 * @param int fid  //好友id
 * @param int message  //发送消息
 * @return 无 
 **/
function videoadd(video,videopic) {
	//console.log('222');
	if(!uid || !fid) {
		return;
	}
	if(!video.trim() || video.trim() == '') {
		toast('视频不能为空');
		return;
	}

//	var nowtime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
	$.ajax({
		type: "post",
		url: apiRoot+'?m=Home&c=Chat&a=sendMessage',
		dataType: 'json',
		data: {
			uid:uid,
			fid:fid,
			message:video,
			video : videopic,
			type:4,
			ftype:ftype
		},/*'m=chat&a=sendMessage&uid=' + uid + '&fid=' + fid + '&message=' + message + '&ftype=' + ftype,*/
		success: function(data) {
			plus.nativeUI.closeWaiting();
			//	 console.log(JSON.stringify(data));
			if(data > 0) {
				var html = 	'<div class="chat-me-hear">'+
				'<div class="frien_img">'+
					'<img src="'+ avatar +'"/>'+
				'</div>'+
				'<div class="chat-me"><video width="100px" height="100px" autoplay="autoplay" src="'+getuserPic(video)+'" poster="'+getuserPic(videopic)+'"></video></div>'	+
			'</div>';
//				var html = '<div class="msg-item msg-item-self " msg-type="text" msg-content="' + message + '">';/*<div class="time">' + nowtime + '</div>*/
//				html += '<img class="msg-user-img-self" src="' + avatar + '" alt="" />';
//				html += '<div class="msg-content"><div class="msg-content-inner">' + message + '</div><div class="msg-content-arrow"></div></div><div class="mui-item-clear"></div></div>';
				$("#msg-list").append(html);
				$("#msg-text").val('');console.log(getuserPic(video));
				scrolls();
				//	 var doc = document.getElementById('msg-list');
				//	 doc.scrollTop = doc.scrollHeight + doc.offsetHeight;
			}
		},
		error: function(e) {
			errortoast();
		}
	});

}
/**
 * 发送图片消息
 *
 * @param int uid  //用户id
 * @param int fid  //好友id
 * @param int message  //发送消息
 * @return 无 
 **/
var soundNum = -1;
//var uploading = 0;
var files = [];
function sendPicture(type) {
//		alert(type);
	clearInterval(tt);
	if(!uid || !fid) {
		return;
	}
//	if(uploading == 1) {
//		toast('Is being uploaded. Please try again later');
//		return;
//	}
//	uploading = 1;
//	if(files.length <= 0) {
//		plus.nativeUI.alert( "No file！", function(){
//			}, official, "OK" );
//		return;
//	}
//	if(readtime <= 0) {
//		readtime = 1;
//	}
	var nowtime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();

	//	showWaiting('上传中...',10000);
//	var localPath = "file://" + plus.io.convertLocalFileSystemURL('path');
	var localPath =  picc;

	var pic = ''; 
	var server = apiRoot+'?m=Home&c=Chat&a=uploadPic&sound=' + localPath+ '&type=' + type;
	var task = plus.uploader.createUpload(server, {
			method: "POST"
	});
	 //上传完成
			pic = picc;
			console.log(pic);
//			if(status == 200) {
//				//	 toast('上传成功');
//				$(".loadPic").hide();
//				files = [];
//				uploading = 0;
//				pic = t.responseText; 
//				//console.log(pic);
//			} else {
//				files = [];
//				toast("Upload failed：" + status);
//			}
			
			$.ajax({
				type: "post",
				url: apiRoot+'?m=Home&c=Chat&a=sendMessage',
				dataType: 'json',
				data: { 
					uid:uid,
					fid:fid,
					message:pic,
					type:type,
					ftype:ftype
				}
			});			
//		}

 //  console.log(pics);
	if(type == 1) {
			var html = 	'<div class="chat-me-hear">'+
			'<div class="frien_img">'+ 
				'<img src="'+ avatar +'"/>'+
			'</div>'+   
			'<div class="chat-me"><img class="msg-content-image" src="' +webRoot+localPath+ '" style="max-width: 100px;" /></div>'+
		'</div>';		 
		$("#msg-list").append(html);
		scrolls();
		//	 var doc = document.getElementById('msg-list');
		//	 doc.scrollTop = doc.scrollHeight + doc.offsetHeight;
		//	 var imageViewer = new mui.ImageViewer('.msg-content-image', {
		//	 dbl: false
		//	 });
		imageViewer.findAllImage();
	} else if(type == 2) {
		var html = '<div class="msg-item msg-item-self " msg-type="sound" msg-content="' + files[0]['path'] + '">';
		html += '<img class="msg-user-img-self" src="' + avatar + '" alt="" />';
		html += '<div class="msg-content"><div class="msg-content-inner">';
		html += '<span class="mui-icon mui-icon-mic" style="font-size: 18px;font-weight: bold;"></span><span class="play-state" id="sound' + soundNum + '" onclick="player(' + soundNum + ',\'' + files[0]['path'] + '\')">Click play</span>'
		html += '</div><div class="msg-content-arrow"></div></div><div class="mui-item-clear"></div></div>';
		$("#msg-list").append(html);
		scrolls(); 
		soundNum--;
		//	 var doc = document.getElementById('msg-list');
		//	 doc.scrollTop = doc.scrollHeight + doc.offsetHeight;
	}
	
	for(var i = 0; i < files.length; i++) {
		var f = files[i];
		task.addFile(f.path, {
			key: f.name
		});
	}
	task.start();

}
/**
 * 播放语音
 *  
 * @param int uid  //用户id
 * @param int fid  //好友id
 * @param int message  //发送消息
 * @return 无 
 **/
function player(soundNum, path) {
	var player = plus.audio.createPlayer(path);
	var playState = $("#sound" + soundNum);
	//	alert(player)
	playState.text('Being played...');
	player.play(function() {
		playState.text('Click play');
	}, function(e) {
		var audio = document.getElementById('audio' + soundNum);
		if(audio.paused) {
			audio.play();
		}
		console.log(JSON.stringify(e));
		playState.text('Click play');
	});

	//	var path1 = plus.storage.getItem('path');
	//	var soundNum1 = plus.storage.getItem('soundNum');
	//	if(path1 != path){
	//	 var player = plus.audio.createPlayer(path1);
	//	 player.stop();
	//	 var playState = $("#sound"+soundNum1);
	//	 var audio = document.getElementById('audio'+soundNum);
	//	 audio.pause();
	//	 playState.text('点击播放');
	//	}
	//	plus.storage.setItem('path' , path+'');
	//	plus.storage.setItem('soundNum' , soundNum+'');
	//	var player = plus.audio.createPlayer(path);
	//	var playState = $("#sound"+soundNum);
	//	playState.text('正在播放...');
	//	player.play(function() {
	//	 playState.text('点击播放');
	//	}, function(e) {
	//	 var audio = document.getElementById('audio'+soundNum);
	//	 if(audio.paused){
	//	 audio.play(); 
	//	 }
	//	 console.log(JSON.stringify(e));
	//	 playState.text('点击播放');
	//	});
}
/**
 * 下旬历史信息 
 *
 * @param int uid  //用户id
 * @param int fid  //好友id
 * @param int message  //发送消息
 * @return 无 
 **/
function findChatHistory() {
	if(!uid || !fid) {
		return;
	}
	//	showWaiting('加载中...');
	$("#loadHistory").show();
	$.ajax({
		type:"post",
		url:apiRoot+'?m=Home&c=Chat&a=findChatHistory',
		async:true,
		dataType:"json",
		data:{
			uid:uid,
			fid:fid,
			maxid:maxid,
			page:page,
			ftype:ftype
		},
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data));
			$("#loadHistory").hide();
			if(data.status ==1) {
				bindHtmlBefore(data.info);
			} else {
				toast('There is no more news！');
				//	 var doc = document.getElementById('msg-list');
				//	 doc.scrollTop = 0;
				//	 plus.webview.currentWebview().reload(false);
			}
		},
		error: function(e) {
			$("#loadHistory").hide();
			errortoast(JSON.stringify(e));
			console.log('fid:'+fid+','+'ftype:'+ftype+','+'uid:'+uid+','+'maxid:'+maxid+','+'page:'+page);
		}
	});
}

/**
 * 将聊天内容记载显示在页面
 *
 * @param object data  //用户id 
 * "id":"3","uid":"18","friendid":"20","addtime":"2015-12-23 17:31:07","message":"！","isReading":"1","type":"0","sendAvatar":"/uploads/2015/12/5678e7f6a075a.jpg"
 * @return 无 
 * [example]
 *   bindHtml(data);
 * [/example]
 **/
function bindHtmlBefore(data) {
	if(!data) {
		return;
	}
	var html = '';
	maxid = data[data.length -1].aid;console.log(maxid);
//		$.each(data, function(key,vo) { 
	for(var i = data.length - 1; i >= 0; i--) {
		var vo = data[i];
		readtime = vo.createtime;
		var sendAvatar = "";
		sendAvatar = getAvatar(vo.userspic);
		if(vo.createtime && (parseInt(vo.createtime) - prevTime)>600){
			html += '<div class="time">' + turnChatTime(vo.createtime)+'</div>';/*两条消息间隙超过10m*/
		}
		prevTime = vo.createtime;
		
		html += '<div class="msg-item ' + (vo.uid == uid ? 'chat-me-hear' : 'chat-ta-hear') + '" msg-type="' + msgTypeArr[vo.type] + '" msg-content="' + vo.message + '">';
		html += '<img ';
		if(vo.uid != uid && ftype == 1) {
			html += ' onclick="goChat(' + vo.uid + ',\'' + vo.nickname + '\',0);" ';
		}
		html += ' class="frien_img' + (vo.uid == uid ? ' imgme' : ' imgher') + '" src="' + (vo.uid == uid ? avatar : sendAvatar) + '" alt="" />';
		html += '<div class="msg-content '+ (vo.uid == uid ? 'chat-me' : 'chat-ta') + '" msgid="' + vo.aid + '">';
		if(msgTypeArr[vo.type] == 'text') {
			html += '' + vo.message;
		} else if(msgTypeArr[vo.type] == 'image') {
			var pic = '';
			if(vo.message) {
				pic = getuserPic(vo.message);
			}
			html += '<img class="msg-content-image" src="' + pic + '" style="max-width: 100px;" />';
		} else if(msgTypeArr[vo.type] == 'sound') {
			html += '<div onclick="player(' + vo['aid'] + ',\'' + getuserPic(vo.message) + '\')"><span class="mui-icon mui-icon-mic" style="font-size: 18px;font-weight: bold;"></span><span class="play-state" id="sound' + vo['aid'] + '">Click play</span><audio id="audio' + vo['aid'] + '" style="display:none" controls preload="none"><source src="' + getuserPic(vo.message) + '" controls></source></audio></div>';
			//	  	html += '<span class="mui-icon mui-icon-mic" style="font-size: 18px;font-weight: bold;"></span><span class="play-state"  id="sound'+vo['id']+'" onclick="player('+vo['id']+',\''+getuserPic(vo.message)+'\')">点击播放</span>';
		} else if(msgTypeArr[vo.type] == 'red') {
			html += '<ul class="mui-table-view" onclick="openRed('+ vo.redid +')">'+
						'<li class="mui-table-view-cell mui-media confirmBtn" style="background: #FA9D3B;">'+
							'<img class="mui-media-object mui-pull-left" src="../public/img/43.jpg" style="max-width: 30px;height: 35px;margin-top: 5px;" />'+
							'<div class="mui-media-body" style="padding: 0;">'+
								'<span class="font-14 white" style="text-align: left;">'+ vo.message +'</span>'+
								'<p class="font-12 white" style="text-align: left;">查看礼包</p>'+
							'</div>'+
						'</li>'+
						'<li class="mui-table-view-cell">'+
							'<p style="font-size: 12px;line-height: 0px;">金币礼包</p>'+
						'</li>'+
					'</ul>';
		}
		html += '</div></div>';
	}
	$("#msg-list").prepend(html);
	//	setTimeout(function(){
	//	 $("#loadHistory").hide();	
	//	},500);
	page++;
	imageViewer.findAllImage();
	//	var doc = document.getElementById('msg-list');
	//	doc.scrollTop = 0;
	first = 1;
}
function scrolls () {
	doc.scrollTop = doc.scrollHeight + doc.offsetHeight;
}




/*进入红包界面*/
function openRed (redid) {
	goNewPage('club-red.html',{pid:redid});/*红包界面*/
}


/**
 * 发红包
 *
 * @param int uid  //用户id
 * @param int fid  //好友id
 * @param int message  //祝福语
 * @param int type 消息类型[0文本,1图片,2语音,3红包]
 * @return 无 
 **/
function sendRed() {
	var message = $('#sendred').attr('data-message');
	var redid = $('#sendred').attr('data-redid');
	
	if(!uid || !fid || !message || !redid) {
		return;
	}
	$('#sendred').removeAttr('data-message');
	$('#sendred').removeAttr('data-redid');
	if(message == '' || !message.trim()) {
		message = '恭喜发财，大吉大利！';
	}
	if(readtime <= 0) {
		readtime = 1;
	}
	$.ajax({
		type: "post",
		url: apiRoot+'?m=Home&c=Chat&a=sendMessage',
		dataType: 'json',
		data: {
			uid:uid,
			fid:fid,
			message:message,
			type:3,
			ftype:ftype,
			redid:redid
		},
		success: function(data) {console.log(data);
			plus.nativeUI.closeWaiting();
			if(data > 0) {
				var html = 	'<div class="chat-me-hear">'+
				'<div class="frien_img">'+
					'<img src="'+ avatar +'"/>'+
				'</div>'+
				'<div class="chat-me me openred" style="padding: 0px;border-radius: 5px;">'+
					'<ul class="mui-table-view">'+
						'<li class="mui-table-view-cell mui-media confirmBtn" style="background: #FA9D3B;">'+
							'<img class="mui-media-object mui-pull-left" src="../public/img/43.jpg" style="max-width: 30px;height: 35px;margin-top: 5px;" />'+
							'<div class="mui-media-body" style="padding: 0;">'+
								'<span class="font-14 white">'+ message +'</span>'+
								'<p class="font-12 white">查看礼包</p>'+
							'</div>'+
						'</li>'+
						'<li class="mui-table-view-cell">'+
							'<p style="font-size: 12px;line-height: 0px;">金币礼包</p>'+
						'</li>'+
					'</ul>'+
				'</div>'+		
			'</div>';
				
				
//				
//				var html = '<div class="msg-item msg-item-self" onclick="openRed('+ redid +')" msg-type="text" msg-content="' + message + '">'+
//					'<img class="msg-user-img-self" src="' + avatar + '" alt="" />'+
//					'<div class="msg-content" msgid="' + data + '" style="background: #D8271C;border-color: #D8271C;min-width: 205px;">'+
//						'<div class="msg-content-inner">'+
//							'<div class="mui-table-view-cell mui-media confirmBtn" style="background: #D8271C;padding: 5px 0px 5px 10px;">'+
//								'<img class="mui-media-object mui-pull-left" src="../public/img/1.png" style="max-width: 35px;height: 35px;" />'+
//								'<div class="mui-media-body">'+
//									'<span class="font-14" style="color: #F7970E;line-height: 35px;">'+ message +'</span>'+
//								'</div>'+
//							'</div>'+
//						'</div>'+
//						'<div class="msg-content-arrow" style="background: #D8271C;border-color: #D8271C;"></div>'+
//					'</div>'+
//					'<div class="mui-item-clear"></div>'+
//				'</div>';
				$("#msg-list").append(html);
				$('.openred').unbind('tap');
				$('.openred').on('tap',function () {
					openRed(data);
				});
				scrolls();
			}
		},
		error: function(e) {console.log(JSON.stringify(e));
			errortoast();
		}
	});
}




//获取从send-red.html页面返回的发红包状态
window.addEventListener('changeVal',function(event){
	var redid = event.detail.redid;
	var message = event.detail.message;console.log(redid+' '+message);
	if(redid){
		$('#sendred').attr('data-message',message);
		$('#sendred').attr('data-redid',redid+'');
		$('#sendred').trigger('tap');
		//sendRed(message,redid);/*发红包*/
	}
});