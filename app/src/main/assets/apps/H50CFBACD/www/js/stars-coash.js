document.addEventListener('plusready',function(){
	var st=$('#stars').val();
	$.ajax({
		type:"get",
		url:apiRoot+'/home/active/stars/s/'+st,
		dataType:'json',
		success:function(data){
        if(data!=1){
        	$('.my').html(data[0].body)
        }
		},error:function(e){
		console.log(JSON.stringify(e))	
		}
	});
	
})
