var ws ,userid; 
document.addEventListener('plusready',function(){
   ws = plus.webview.currentWebview();
   userid = plus.storage.getItem('userid');
   var html ="";
    $.ajax({
   	  type:"get",
   	  url:apiRoot+"/home/road/rodbai",
   	   data : {
   	   	 date:2,
   	   	 userid : userid
   	   },
   	   dataType:'json', 
   	   success:function(data){

   	   $.each(data, function(k,v) {
   	   	var on="mywoe('"+v.userid+"')";
   	   		
   	   	var cs
   	   	if(v.baimin<=3){
   	   		cs='style="line-height: 45px;margin-right: 6px;color: #E87D31;"';
   	   	}else{
   	   		cs='style="line-height: 45px;margin-right: 6px;"'
   	   	}
   	   	 if(v.userid==userid){		
   	   		html='<ul class="mui-table-view">'+
						'<li class="mui-table-view-cell">'+
							'<div class="bbs-pulish-img mui-text-center" onclick="'+on+'" >'+
								'<img src="'+getAvatar(v.userspic)+'" />'+
								'<p style="font-size: 14px;">'+v.usersni+'<i class="mui-icon iconfont mui-yellow" style="padding-left: 5px;">&#xe605;</i></p>'+
							    '<p>'+v.sun+'km<span style="color: #E87D31;padding-left: 12px;">排名：'+v.baimin+'</span></p>'+
								'<p>击败了全国'+v.cet+'的车手<span style="padding-left: 12px;">小米9号平衡车</span></p>'+
							'</div>'+
					'</li>'+
					+'</ul>'; 
   	   	 }else{
   	   	 	
   	   	 	html='<ul class="mui-table-view">'+
						'<li class="mui-table-view-cell mui-media"  onclick="'+on+'" >'+
							'<span class="mui-pull-left" '+cs+'>'+v.baimin+'</span>'+
							'<img class="mui-media-object mui-pull-left" src="'+getAvatar(v.userspic)+'" />'+
							'<div class="mui-media-body">'+
								'<span style="line-height: 25px;">'+v.usersni+'</span><i class="mui-icon iconfont mui-yellow" style="padding-left: 5px;">&#xe605;</i><span style="float: right;line-height: 45px;">'+v.sun+'km</span>'+
								'<p>小米9号平衡车</p>'+
							'</div>'+
						'</li>'+
					'</ul>';
   	   	 }
   	   	  	 $(html).appendTo($('#item2'));
   	   });
   	 
   	   }
   	});
   	var xhtml;
   	 $.ajax({
   	  type:"get",
   	  url:apiRoot+"/home/road/rodbai",
   	   data : {
   	   	 date:1
   	   },
   	   dataType:'json', 
   	   success:function(data){

   	   $.each(data, function(k,v) {
   	   			
   	   	var on="mywoe('"+v.userid+"')";
   	   	var cs
   	   	if(v.baimin<=3){
   	   		cs='style="line-height: 45px;margin-right: 6px;color: #E87D31;"';
   	   	}else{
   	   		cs='style="line-height: 45px;margin-right: 6px;"'
   	   	}
   	   	 if(v.userid==userid){		
   	   		xhtml='<ul class="mui-table-view">'+
						'<li class="mui-table-view-cell" >'+
							'<div class="bbs-pulish-img mui-text-center"  onclick="'+on+'" >'+
								'<img src="'+getAvatar(v.userspic)+'" />'+
								'<p style="font-size: 14px;">'+v.usersni+'<i class="mui-icon iconfont mui-yellow" style="padding-left: 5px;">&#xe605;</i></p>'+
							    '<p>'+v.sun+'km<span style="color: #E87D31;padding-left: 12px;">排名：'+v.baimin+'</span></p>'+
								'<p>击败了全国'+v.cet+'的车手<span style="padding-left: 12px;">小米9号平衡车</span></p>'+
							'</div>'+
					'</li>'+
					+'</ul>'; 
   	   	 }else{
   	   	 	
   	   	 	xhtml='<ul class="mui-table-view">'+
						'<li class="mui-table-view-cell mui-media"  onclick="'+on+'" >'+
							'<span class="mui-pull-left" '+cs+'>'+v.baimin+'</span>'+
							'<img class="mui-media-object mui-pull-left" src="'+getAvatar(v.userspic)+'"  />'+
							'<div class="mui-media-body">'+
								'<span style="line-height: 25px;">'+v.usersni+'</span><i class="mui-icon iconfont mui-yellow" style="padding-left: 5px;">&#xe605;</i><span style="float: right;line-height: 45px;">'+v.sun+'km</span>'+
								'<p>小米9号平衡车</p>'+
							'</div>'+
						'</li>'+
					'</ul>';
   	   	 }
   	   	  	 $(xhtml).appendTo($('#item'));
   	   });
   	 
   	   }
   	});
   	
   	
   	
   	
})

function mywoe(id){
	 plus.webview.create('./my-active1.html','my-active1.html',{},{sid : id}).show('pop-in',200)
}
