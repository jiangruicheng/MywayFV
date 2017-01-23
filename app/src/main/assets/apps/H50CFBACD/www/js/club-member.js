
document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
   var userid = plus.storage.getItem('userid');
   var cludid = ws.cludid;
   var cuserid = ws.cuserid;
   var html = "";
   $.ajax({
   	type:"get",
   	url:apiRoot+"/home/club/clubqun",
    data : {
    	cludid : cludid,
    	cuserid : cuserid
    },
    dataType:'json', 
    success:function(data){
    	$('#cuserpic').attr('src',getAvatar(data.rew.userspic));
    	$('#usersni').text(data.rew.usersni);
    	$('#sui').text(data.rew.yuers ? data.rew.yuers : 0);
    	$.each(data.req, function(k,v) {
    		//console.log(JSON.stringify(v));
    		html += '<ul class="mui-table-view" onclick = xiangq("'+v.userid+'")>'+
					'<li class="mui-table-view-cell mui-media">'+
						'<img class="mui-media-object mui-pull-left" src="'+getAvatar(v.req.userspic)+'" />'+
						'<div class="mui-media-body">'+
							'<span>'+v.req.usersni+'</span>'+
							'<p><i class="mui-icon iconfont" style="color: #54A1FF;">&#xe614;</i> '+ (v.req.yuers ? v.req.yuers : 0)+'岁</p>'+
						'</div></li></ul>';
    	});
    	$('#userlist').append(html);
    },error:function(e){
    	
    }
   });


})
function xiangq(sid){
	plus.webview.create('my-active.html','my_active.html',{},{sid : sid}).show('pop-in',200);
    
}
