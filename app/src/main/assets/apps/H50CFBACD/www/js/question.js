document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
   var userid = plus.storage.getItem('userid');
   PullToRefresh(ws)
   var html = "";
   $.ajax({
   	type:"get",
   	url:apiRoot+"/home/other/questionlist",
   	data :{
   		userid : userid,
   	},
    dataType:'json',
    success:function(data){
    	$.each(data,function(k,v){
    	console.log(JSON.stringify(v))
    		html +='<ul class="mui-table-view"><li class="mui-table-view-cell" onclick=questiondetails('+v.aid+',"'+v.question+'","'+v.status+'","'+v.reply+'")>'+
				'<span>'+v.question+'</span><p style="margin-top: 6px;color: #000000;">'+v.time+'</p></li></ul>';
    	})
    	$('#queslist').html(html); 
    },error:function(e){ 
    	console.log(JSON.stringify(e))
    }
   });

})
function questiondetails(id , question ,status, reply){
	plus.webview.create('./question-details.html','question-details.html',{},{id : id,question : question,status : status,reply: reply }).show('pop-in',200);
}
