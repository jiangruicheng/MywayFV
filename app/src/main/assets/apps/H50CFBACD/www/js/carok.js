var userid
document.addEventListener('plusready',function(){
	 userid = plus.storage.getItem('userid');
	 PullToRefresh(plus.webview.currentWebview())
	var html="";
	$.ajax({
		type:"get",
		url:apiRoot+"/home/user/carlist",
		data : {
			aid  : userid
		},
		dataType:'json',
		success:function(data){
			$.each(data, function(k,v) {
				//console.log(JSON.stringify(v));
				html += '<ul class="mui-table-view"><li class="mui-table-view-cell">'+
					    '<span>'+v.usercar+'</span></li></ul>';
			
			});
			$('.carlist').append(html);
		},error:function(e){
			console.log(JSON.stringify(e));
		}
	});
	
	$('#subtn').on('click',function(){
		var serialnumber = $('#serialnumber').val();
		if(!userid){
			plus.nativeUI.toast('请先登录在操作')
			return;
		}
		if(!serialnumber){
			plus.nativeUI.toast('没有车辆相关信息')
			return;
		}
		if(serialnumber.length!=12&&xlh.match(serialnumber)){
			plus.nativeUI.toast('请输入正确的12位系列号')
			return;
		}
		
		$.ajax({
			type:"get",
			url:apiRoot+"/home/user/caradd",
			data : {
				aid : userid,
				usercar : serialnumber
			},
			dataType:'json',
			success:function(data){
				if(data==1){
					plus.nativeUI.toast('系列号已绑定过')
				}else{
				if(data > 0){
					plus.webview.create('./car-ok.html','car-ok.html',{},{}).show('pop-in',200); 
				}
				}
			},error:function(e){
				
			}
		});
	})
	
})
function carok(){
	if(!userid){
			plus.nativeUI.toast('请先登录在操作')
			return;
		}
	openNewPage('barcode_scan.html')
}
