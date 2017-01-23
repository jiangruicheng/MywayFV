document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
   var userid = plus.storage.getItem('userid');
   
   var html = "";
   var xhtml = "";
   var shpimoney = "";
   var shoumoney = "";
   $.ajax({
   	 type:'get',
   	 url:apiRoot+"/home/other/myred",
   	 data : {
   	 	userid : userid
   	 },
   	 dataType:'json',
   	 success:function(data){ 
   	 	console.log(JSON.stringify(data))
   	 	var famoney = 0;
   	 	var shoumoney = 0; 
   	 	$.each(data.reb, function(k,v) {
   	 		famoney += parseFloat(v.money);
   	 		xhtml +='<ul class="mui-table-view">'+
						'<li class="mui-table-view-cell">'+
							'拼手气抢红包<span class="mui-pull-right">'+v.money+'金币</span>'+
							'<p>'+v.tie+'<span class="mui-pull-right"></span></p>'+
						'</li>'+
				'</ul>';
				   
   	  });  
   	 	$('#famoney').text(famoney);
   	 	$.each(data.red, function(k1,v1) {
   	 		shoumoney  += parseFloat(v1.money);
   	 		html +='<ul class="mui-table-view">'+
								'<li class="mui-table-view-cell mui-media">'+
									'<img class="mui-media-object mui-pull-left" src="'+getAvatar(v1.user.userspic)+'" />'+
									'<div class="mui-media-body">'+
										'<span style="line-height: 25px;">'+v1.user.usersni+'</span><span style="float: right;line-height: 45px;">'+v1.money+'金币</span>'+
										'<p>'+v1.tim+'</p>'+
									'</div>'+
								'</li>'+
			'</ul>';
   	 	});
   	 	
		$('.fa').append(xhtml); 
		$('.shoudao').append(html);
		$('#shoumoney').text(shoumoney);  
		$('#fachu').text(data.rea);  
		$('#shou').text(data.rec);
		$('.userspic').attr('src',getAvatar(data.res.userspic));
		$('.usersni').text(data.res.usersni);
   	 },
   	 error:function(e){
   	 	console.log(JSON.stringify(e)); 
   	 }
   });


})