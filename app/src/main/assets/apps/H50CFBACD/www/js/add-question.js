document.addEventListener('plusready',function(){
var userid = plus.storage.getItem('userid');//用户id
var ws = plus.webview.currentWebview();
  $('#bth').on('click',function(){
	  var carxhao = $('#carxhao').val();
	  var question = $('#question').val();
	  if(!userid){
	  	toast('请先登入！')
	  	return;
	  }
    if(!carxhao||!question){
    	 toast('请输入完整的数据!');
    	 return;
    }
  	//console.log(apiRoot+"/home/other/question/userid/"+userid+'/carxhao/'+carxhao+'/question/'+question);
	$.ajax({
		type:"get",
		url:apiRoot+"/home/other/question",
		data : {
			userid : userid,
			carxhao : carxhao,
			question : question
		},
		dataType:'json',
		success:function(data){
			console.log(JSON.stringify(data));
			if(data>0){
				alert('上传成功！');
				setTimeout(function(){ 
						ws.close();
					} , 1500); 
			}
		},error:function(e){
			console.log(JSON.stringify(e));
		}
	});
  })
  
})