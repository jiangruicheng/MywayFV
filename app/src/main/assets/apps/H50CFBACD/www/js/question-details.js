document.addEventListener('plusready',function(){
   var ws = plus.webview.currentWebview();
   var userid = plus.storage.getItem('userid');
   var question = ws.question;
   var reply = ws.reply;
   var status = ws .status;
   $('#question').text(question);
   if(reply == 'null'){
   	 $('#Reply').text('暂无回复');
   }else{
   	 $('#Reply').text(reply);
   }
  
})