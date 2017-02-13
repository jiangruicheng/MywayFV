var cludid
document.addEventListener('plusready', function() {
	var ws = plus.webview.currentWebview();
	var userid = plus.storage.getItem('userid');
	cludid = ws.fid;
	var cuserid = ws.cuserid;
	var name;
	var html = "";
	var xhtml = "";
	var bhtml = "";
	console.log(cludid)
	if(userid == cuserid) {
		html = '<a class="mui-pull-right" onclick=clubbj("' + cludid + '")>' +
			'<h5 style="line-height: 33px;">编辑</h5></a>';
		$('#bianji').html(html);
		xhtml = '<button class="mui-btn mui-btn-block" onclick=jies("' + cludid + '")>解散俱乐部</button>';
		$('.btn').html(xhtml);
	}
	$.ajax({
		type: "get",
		url: apiRoot + "/home/club/clubxinxi",
		data: {
			cludid: cludid
		},
		dataType: 'json',
		success: function(data) {
			console.log(JSON.stringify(data))
			$('#clubxq >img').attr('src', getAvatar(data.res.avatar));
			$('#clubname').text(data.res.name);
			$('#clubaddr').text(data.res.info);
			$('#address').text(data.res.address);
			$('#count').text(data.rew)
			$.each(data.req, function(k, v) {
				console.log(JSON.stringify(v))
				if(k < 7) {
					bhtml = '<img src="' + getAvatar(v.req.userspic) + '" />';
				}
			});
			$('#piclist').html(bhtml);
		},
		error: function(e) {

		}
	});

	$('#piclist').on('click', function() {
		plus.webview.create('./club-member.html', 'club-member.html', {}, {
			cludid: cludid,
			cuserid: cuserid
		}).show('pop-in', 200);

	})

})

function clubbj(id) {
	plus.webview.create('./club-bj.html', 'club-bj.html', {}, {
		cludid: id,
		spage: 1
	}).show('pop-in', 200);
}

function jies(id) {
	console.log(id)
	plus.nativeUI.showWaiting('正在解散，请稍后...');
	$.ajax({
		type: "get",
		url: apiRoot + "/home/club/clubover",
		data: {
			id: id
		},
		dataType: 'json',
		success: function(data) {
			if(data.code == 1001) {
				toast('解散成功');
				plus.webview.getWebviewById('club.html').reload();
				plus.webview.open('club.html');
			}
			if(data.code == 1002) {
				toast('解散失敗');
			}
			plus.nativeUI.closeWaiting();

			//			setTimeout(function(){ 
			//				ws.close();
			//			} , 1500); 
		},
		error: function(e) {
			console.log(e)
		}
	});
}