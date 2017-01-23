document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
   var userid = plus.storage.getItem('userid');
   var cludid = ws.fid;
   var cuserid = ws.cuseid;
   var other=ws.ftype;
   var html = "";
  console.log(cludid)  
    console.log(other) 
 //console.log(apiRoot+"/home/Club/addclubqun");
   $.ajax({
	   	type:"get",
	   	url:apiRoot+"/home/Club/addclubqun",
	   	data : {
	   		clubid : cludid,
	   		userid : userid,
	   		other:other
	   	},
	   	dataType:'json',
	   	success:function(data){
	   		//alert(JSON.stringify(data))
	   	},error:function(e){
	   		// alert(JSON.stringify(e))
	   	}
   
   });
   if(cludid > 0){
   	 html +='<a class="mui-pull-right" ><i class="mui-icon iconfont" style="font-size: 17px;margin-top: 4px;">&#xe628;</i></a>'
   }
   $('#clubnx').html(html);
   
   $('#clubnx').on('click',function(){
   	  plus.webview.create('./club-message.html','club-message.html',{},{fid:cludid , cuserid : cuserid}).show('pop-in',200);
   })
})