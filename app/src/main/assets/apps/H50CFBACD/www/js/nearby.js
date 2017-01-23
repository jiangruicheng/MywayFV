document.addEventListener('plusready',function(){
	var id = plus.storage.getItem('userid');
	var usersni = plus.storage.getItem('usersni');
	var userspic = plus.storage.getItem('userspic');
	console.log(usersni);
	$('.name').text(usersni);
	$('.userspic').attr('src',getAvatar(userspic));
	if(!id){  
		alert('你还没有登录');return;
	}
	$("#allmap").css({'width':$(window).width()})
		
	//地图
	var map = new BMap.Map("allmap");
	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){ 
			var jingdu = r.point.lng;
			var weidu = r.point.lat;
			console.log(jingdu+","+weidu);
			//显示地图
			var point = new BMap.Point(jingdu,weidu);
			map.centerAndZoom(point, 16);
			map.enableScrollWheelZoom(true);
			// 用经纬度设置地图中心点
			var myIcon = new BMap.Icon("http://app229.51edn.com/api/Public/images/map.png", new BMap.Size(12,22));
			var smarker = new BMap.Marker(point,{icon:myIcon});
			smarker.setLabel('当前位置');
			var label = new BMap.Label('当前位置',{"offset":new BMap.Size(9,-15)}); 
			smarker.setLabel(label);
			map.addOverlay(smarker);  // 将标注添加到地图中
		}
		else {  
			alert('failed'+this.getStatus());
		}        
	},{enableHighAccuracy: true})
	 
	plus.nativeUI.showWaiting();
	//console.log(apiRoot + "?m=home&c=Nearby&a=fujin&id="+id);
	var opts = {
					width : 200,     // 信息窗口宽度
					height: 75,     // 信息窗口高度
					title : '' , // 信息窗口标题
					enableMessage:true//设置允许信息窗发送短息
				   };
	$.ajax({
		type:"post",
		url:apiRoot + "?m=home&c=Nearby&a=fujin",
		data:{id:id},
		dataType:'json',
		success:function(data){
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data)); 
			data.other.sort(function(b, a) {//正序   
			    return b.juli - a.juli;
			});
			if(data.other.length > 0){
				var html = '';
				$.each(data.other, function(k,v) {
					var sex = v.sex == "男"?'&#xe614;':'&#xe615;';
					if (v.juli > 1000) {
						var juli = Math.round(v.juli / 1000, 1) + 'km';
					}else{
						var juli = v.juli+'m';
					} 
					html += '<ul class="mui-table-view">'+
								'<li class="mui-table-view-cell mui-media">'+
									'<img class="mui-media-object mui-pull-left dongtai" src="'+ (v.userspic?getuserPic(v.userspic):'') +'" data-id="'+ v.aid +'"/>'+
									'<div class="mui-media-body">'+
										'<span style="line-height: 25px;">'+ (v.namez ?v.namez :v.user) +'</span><span style="float: right;line-height: 55px;font-size: 14px;">'+ juli +'</span>'+
										'<p><i class="mui-icon iconfont" style="color: '+(v.sex == "男" ? '#54A1FF' : '#FFA2A2')+';">'+ sex +'</i> '+ (v.yuers ? v.yuers+'岁' : '0岁') +'</p>'+
									'</div>'+
								'</li>'+
							'</ul>';  
				});
				$('.mui-scroll').html(html);
				$('.dongtai').unbind('click');
				$('.dongtai').on('click',function(){
					var sid = $(this).attr('data-id');
					console.log(sid);
					var nwaiting = plus.nativeUI.showWaiting();//显示原生等待框
					var webviewContent= plus.webview.create('my-active.html','my-active.html',{},{sid:sid});//后台创建webview并打开show.html
					webviewContent.addEventListener("loaded", function() { //注册新webview的载入完成事件
				        nwaiting.close(); //新webview的载入完毕后关闭等待框
				        webviewContent.show("slide-in-right",20); //把新webview窗体显示出来，显示动画效果为速度200毫秒的右侧移入动画
			        }, false);
				})
				//地图
					console.log(JSON.stringify(data.other));
				$.each(data.other, function(k1,v1) {
//					$('#years').html('<p><i class="mui-icon iconfont" style="color: '+(v1.sex == "男" ? "#54A1FF" : "#FFA2A2")+';">'+(v1.sex == "男" ? "&#xe614;" : "&#xe615;")+'</i>'+ (v1.yuers ? v1.yuers+'岁' : '0岁') +'</p>')
					if(v1.zuobiao){ 
						var zuobiao = v1.zuobiao.split(',');
						var point = new BMap.Point(zuobiao[0],zuobiao[1]);
//						var mk = new BMap.Marker(point);
//						map.addOverlay(mk);
						var myIcon = new BMap.Icon("http://app229.51edn.com/api/Public/images/map.png", new BMap.Size(22,32));
						var smarker = new BMap.Marker(point,{icon:myIcon});
						smarker.setLabel('当前位置');
						var label = new BMap.Label((v1.namez ? v1.namez : v1.user),{"offset":new BMap.Size(9,-15)}); 
						smarker.setLabel(label);
						map.addOverlay(smarker); 
						addClickHandler(v1.namez,v1.juli,v1.user,v1.yuers,v1.aid,v1.userspic,smarker);
					}
				});
			}
		},
		error:function(e){
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(e));
		}
	});
},false)

function addClickHandler(name,juli,user,years,aid,pic,smarker){
		smarker.addEventListener("click",function(e){
			$('.userspic').attr('src',getAvatar(pic));
			$('.name').text(name ? name :  user);
			$('#juli').text(juli+'m');
			$('#dianji').attr('data-id',aid);
			$('#dianji').on('click',function(){
				var uid = $(this).attr('data-id');
				
				plus.webview.create('my-active.html','my-active.html',{},{sid:uid}).show('pop-in',200);//后台创建webview并打开show.html
			})
			 
//			$('#years').html('<p><i class="mui-icon iconfont" style="color: '+(v1.sex == "男" ? '#54A1FF' : '#FFA2A2')+';"></i> '+ (v1.yuers ? v1.yuers+'岁' : '0岁') +'</p>')
		});
	}