var v;
var server;
var ss;
var userid;
var content;
var ws;
document.addEventListener('plusready', function() {
	ws = plus.webview.currentWebview();
	$('.topimg').on('click', function() {
			// 弹出系统选择按钮框
			plus.nativeUI.actionSheet({
				cancel: "取消",
				buttons: [{
					title: "拍照添加"
				}, {
					title: "相册添加"
				}, {
					title: "从本地上传视频"
				}]
			}, function(e) {
				if(e.index == 1) {
					ss = 1;
					getImage();
				} else if(e.index == 2) {
					appendByGalleryMul();
					ss = 1;
				} else if(e.index == 3) {
					ss = 2;
					getVideo()
				}
			});
		})
		//拍照
	function getImage() {
		var cmr = plus.camera.getCamera();
		cmr.captureImage(function(path) {
			path = plus.io.convertLocalFileSystemURL(path);
			appendPic(path);
			$('#showimg').append('<img class="imgs" src="file://' + path + '"/>');
			v = true;
			simg();
			//    
		}, function(err) {
			console.log(JSON.stringify(e));
		},{filter:"image"});

	}

	function getVideo() {
		plus.gallery.pick(function(path) {
			console.log(JSON.stringify(path));
			appendPic(path);
			$('#showimg').append('<video class="imgs" width="100px" height="100px" autoplay="autoplay" src="file://' + path + '"></video>');
			//			setWH();//调整图片宽高<video width="100px" height="100px" autoplay="autoplay" src="file://'+path+'"  poster="file://'+path+'"></video>
			v = true;
			simg()

		}, function(err) {
			//			console.log(JSON.stringify(err));
		},{filter:"video"});
	}
	// 从相册添加文件  多选图片
	var del_index = 0;

	function appendByGalleryMul() {
		plus.gallery.pick(function(e) {
			var html = '';
			console.log(JSON.stringify(e));
			for(var i in e.files) {
				appendPic(e.files[i]);
				html += '<img class="imgs"  src="file://' + plus.io.convertLocalFileSystemURL(e.files[i]) + '" data-preview-src="" data-preview-group="1"/>';

			}
			$('#showimg').append(html);

			v = true;
			simg()

			//			setWH();//调整图片宽高
		}, function(e) {
			//			console.log(JSON.stringify(e));
		}, {
			multiple: true,
			system: false,
			maximum: 9,
			onmaxed: function() {
				toast('最多只能选择9张图片')
			}
		});

	}

	// 添加照片        
	var upload_pic = []; // 照片数组
	var pic_index = 1;

	function appendPic(p) {
		upload_pic.push({
			name: "uploadkey" + pic_index,
			path: p
		});
		//		console.log(JSON.stringify(upload_pic));
		pic_index++;
		console.log(JSON.stringify(upload_pic));
	}
	var timeout;

	function simg() {
		$('.imgs').mousedown(function() {

				if(v) {
					if(confirm('是否确认删除！')) {
						var imgsrc = $(this).attr('src')
						v = false;
						upload_pic.length = 0;
						var len = $('.imgs').length;
						for(var i = 0; i < len; i++) {
							var fpic = $('.imgs').eq(i).attr('src');
							if(imgsrc != fpic) {
								appendPic(fpic)
							}
						}
						setTimeout(function() {
							v = true;
						}, 1000);
						$(this).detach()

					}
				}
			})
			//		$("#mydiv").mouseup(function() { 
			//       clearTimeout(timeout); 
			//      });  
	}

	$('#fabiao').on('click', function() {
		userid = plus.storage.getItem('userid'); //用户id
		content = $('.content').val();
		if(userid == null) {
			toast('请先登录！');
			return;
		}
		if(!content.trim() && upload_pic.length < 1) {
			$("#content").val('');
			toast('没有信息无法发表！');
			return;
		}
		if(ss == 1) {
			if(upload_pic.length > 9) {
				//			plus.uploader.clear(0)
				upload_pic.length = 0;
				toast('图片不能超过九张！');
				return;
			}
		}
		if(ss == 2) {
			if(upload_pic.length > 1) {
				//			plus.uploader.clear(0)
				upload_pic.length = 0;
				toast('上传视频要小于10M！');
				return;
			}
		}
		plus.nativeUI.showWaiting('正在上传，请稍后...');
		console.log(JSON.stringify(upload_pic));
		if(upload_pic.length >= 1) {
			if(ss == 1) {
				tp(upload_pic)
			}
			if(ss == 2) {
				vo(upload_pic)
			}

		} else {
			$.ajax({
				type: "get",
				url: apiRoot + '/Home/Active/introactive',
				data: {
					userid: userid,
					body: content

				},
				dataType: 'json',
				success: function(data) {
					console.log(JSON.stringify(data));
					if(data > 0) {
						plus.webview.getWebviewById('active.html').reload();
						//if(spage)plus.webview.getWebviewById(spage).reload();
						plus.nativeUI.closeWaiting();
						toast('发布成功');
						setTimeout(function() {
							ws.close();
						}, 1500);
					}
				},
				error: function(e) {
					console.log(JSON.stringify(e));
					errortoast();
				}
			});
		}

	})

})

function checkTv(tv) {
	var tv_id = tv;
	var index = tv_id.indexOf("."); //得到"."在第几位
	tv_id = tv_id.substring(index); //截断"."之前的，得到后缀
	if(tv_id != ".jpg" && tv_id != ".png" && tv_id != ".git" && tv_id != ".jpeg"&&tv_id != ".JPG" && tv_id != ".PNG" && tv_id != ".GIF" && tv_id != ".JPEG") { //根据后缀，判断是否符合视频格式

		return '<video width="100%" height="200" controls="controls" preload="auto" poster="http://app229.51edn.com/uploads/2017/01/11/5875d3aa3ac6a.jpg">' +
			'<source src="http://app229.51edn.com' + tv + '" type="video/mp4"></source></video>';
	} else {
		return '<img src="http://app229.51edn.com' + tv + '"/>';
	}
}

function tp(upload_pic) {
	server = apiRoot + '/home/front/uploadPicture';
	var task = plus.uploader.createUpload(server, {
		method: "POST"
	}, function(t, status) {
		if(status == 200) {
			plus.nativeUI.closeWaiting();
			pic = t.responseText;
			//					console.log(pic);
			if(pic.msg) {
				errortoast(pic.msg);
				console.log(pic);
				return;
			}
			if(pic != '-1') {
				console.log(apiRoot + '/Home/Active/introactive/user' + userid + "/body/" + content + "/imagess/" + pic)
					//保存到数据库
				$.ajax({
					type: "get",
					url: apiRoot + "/Home/Active/introactive",
					data: {
						userid: userid,
						body: content,
						imagess: pic
					},
					dataType: 'json',
					success: function(data) {
						console.log(JSON.stringify(data));
						if(data) {
							plus.webview.getWebviewById('active.html').reload();
							plus.nativeUI.closeWaiting();
							toast('发表成功');
							setTimeout(function() {
								ws.close();
							}, 1500);

						}
					},
					error: function(e) {
						console.log(JSON.stringify(e));
						errortoast();
					}
				});
			} else {
				toast('操作成功');
			}
		} else {
			plus.nativeUI.closeWaiting();
			toast('上传图片失败！');
			return;
		}
	})
	for(var i in upload_pic) {
		var f = upload_pic[i];
		task.addFile(f.path, {
			key: f.name
		});
	}
	task.start();
}

function vo(upload_pic) {
	server = apiRoot + '/Home/Chat/uploadVideo';
	var task = plus.uploader.createUpload(server, {
		method: "POST"
	}, function(t, status) {
		if(status == 200) {
			plus.nativeUI.closeWaiting();
			pic = t.responseText;
			//					console.log(pic);
			var data = $.parseJSON(pic)
			var cont = data.videos + ':' + data.slpic;
			var index = data.videos.indexOf("."); //得到"."在第几位
			var tv_id = data.videos.substring(index); //截断"."之前的，得到后缀
			if(tv_id != ".avi" && tv_id != ".mp4" && tv_id != ".MOV" && tv_id != ".wmv") {
				toast('视频格式不对！');
				return;
			}
			if(pic != '-1') {
				//保存到数据库
				$.ajax({
					type: "get",
					url: apiRoot + "/Home/Active/introactive",
					data: {
						userid: userid,
						body: content,
						imagess: cont
					},
					dataType: 'json',
					success: function(data) {
						console.log(JSON.stringify(data));
						if(data) {
							plus.webview.getWebviewById('active.html').reload();
							plus.nativeUI.closeWaiting();
							toast('发表成功');
							setTimeout(function() {
								ws.close();
							}, 1500);

						}
					},
					error: function(e) {
						console.log(JSON.stringify(e));
						errortoast();
					}
				});
			} else {
				toast('操作成功');
			}
		} else {
			plus.nativeUI.closeWaiting();
			toast('上传失败!视频要小于10M！');
			return;
		}
	})
	for(var i in upload_pic) {
		var f = upload_pic[i];
		task.addFile(f.path, {
			key: f.name
		});
	}
	task.start();
}