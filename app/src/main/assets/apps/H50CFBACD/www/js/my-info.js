var ws ,sex ,userid;
document.addEventListener('plusready',function(){
	ws = plus.webview.currentWebview();
//  userid = ws.usersid;
	userid = plus.storage.getItem('userid');//用户id
  
   var html = "";
  	$.ajax({
    	type:"get",
    	url:apiRoot+"/home/user/usersdata",
    	data : {
    		userid : userid
    	},
    	dataType:'json',
    	success:function(data){
    		console.log(JSON.stringify(data));
    		if(!data.userspic){
    			html +='<img class="mui-media-object mui-pull-left" src="../public/img/4.jpeg" />';
    		}else{
    			html +='<img class="mui-media-object mui-pull-left" src="'+getAvatar(data.userspic)+'" />';
    		}
    		$('#userlogo').html(html);
    		$('.usersname').text(data.usersni); 
    		$('.sex').text(data.sex);  
    		$('.namez').text(data.namez); 
    		$('.birthday').text(data.birthday); 
    		$('.usersaddr').text(data.usersaddr); 
    		$('.usersphone').text(data.usersphone); 
    		$('.phone').text(data.phone); 
    		$('.zhiye').text(data.occupation); 
    		$('.usersemail').text(data.usersemil); 
    	},error:function(e){
    		console.log(JSON.stringify(e)); 
    	}
    	  
    });


})
function userdatadel(){

	plus.webview.create('./my-infor1.html','my-infor1.html',{},{usersid : userid ,wsid : ws.id}).show('pop-in',250); 

}