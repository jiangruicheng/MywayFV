document.addEventListener('plusready',function(){
	var html = "";
	$.ajax({
		type:"get",
		url:apiRoot+"/Home/other/problem",
		dataType:'json',
		success:function(data){
			//console.log(JSON.stringify(data));
			html = ''+data.body+'';
			$('.problem').html(html)
		},error:function(e){
			console.log(JSON.stringify(e));
			
		}
	});
	
})