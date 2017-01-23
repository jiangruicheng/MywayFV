document.addEventListener('plusready',function(){
	var ws = plus.webview.currentWebview();
	var userid = plus.storage.getItem('userid');
    var html="";
    $.ajax({
    	type:"get",
    	url:apiRoot+"/home/road/myroad",
    	data : {
    		userid : userid
    	},
    	dataType:'json',
    	success:function(data){ 
    	console.log(JSON.stringify(data))
    	$.each(data, function(k,v) {
    		html +='<ul class="mui-table-view">'+
			 	'<li class="mui-table-view-cell mui-media" onclick="roadcz('+v.id+')">'+
			 	'<img class="mui-media-object mui-pull-left" src="'+webRoot+v.roadpic+'" />'+
			 	'<div class="mui-media-body">'+
			 	'<span>'+v.origin+'</span><span style="float: right;color: gray;">'+v.time+'</span>'+
			 	'</div></li></ul>';
    	});
    	$('.m5').append(html);
    	},error:function(e){    
    		
    	}
    });

})
function roadcz(id){
	plus.webview.create('./road-cz.html','road-cz.html',{},{roadid : id}).show('pop-in',200);
}
