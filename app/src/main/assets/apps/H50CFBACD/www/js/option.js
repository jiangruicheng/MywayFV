document.addEventListener('plusready',function(){
	var userid = plus.storage.getItem('userid');//用户id
	$('#bth').on('click',function(){
		var opty = $('#option').val();
		$.ajax({
			type:"get",
			url:apiRoot+"/home/other/option",
			data : { 
			   userid : userid,
			   body : opty
			},
			dataType:'json',
			success:function(data){
				if(data){
					plus.nativeUI.toast('感谢反馈，我们将尽快处理！！');
					plus.webview.create('./after-sale.html','after-sale.html').show('pop-in',200);
				}
			},error:function(e){
				console.log(JSON.stringify(e));
			}
		});
	})
})