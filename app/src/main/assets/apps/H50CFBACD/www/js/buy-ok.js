var ws ,userid; 
document.addEventListener('plusready',function(){
   ws = plus.webview.currentWebview();
   userid = plus.storage.getItem('userid');
   var goodsid = ws.goodsid;
   var fenlei = ws.fenlei;
   var html = "";
   spage = ws.spage;
   $.ajax({
	   	type:"get",
	   	url:apiRoot+"/Home/Order/myorder",
	   	data : {
	   		userid : userid,
	   		goodsid : goodsid
	   	},
	   	dataType:'json', 
	   	success:function(data){ 
	   		 console.log(JSON.stringify(data)); 
	   	   if(data.req.username == ""){
	   	   		html+='<ul class="mui-table-view mui-grid-view" onclick=newaddr()><li class="mui-table-view-cell "><i class=" iconfont" style="margin-top: 35px;">还没有填写地址！！马上去填写&#xe661;</i></li></ul>';
	   	   }else{
	   	   		html+='<ul class="mui-table-view mui-grid-view" onclick="newaddr()"><li class="mui-table-view-cell mui-col-xs-1">'+
				'<i class="mui-icon iconfont" style="margin-top: 35px;">&#xe662;</i></li>'+
				'<li class="mui-table-view-cell mui-col-xs-10 mui-text-left"><span>收货人:'+data.req.username+'</span><span style="float: right;">'+data.req.phone+'</span>'+
				'<p class="back" style="margin-top: 8px;">收货地址:'+data.req.useraddr+'</p>'+
				'</li><li class="mui-table-view-cell mui-col-xs-1"><i class="mui-icon iconfont" style="margin-top: 35px;">&#xe661;</i></li></ul>'
	   	   }
	   	   
		 $('#useraddr').html(html);
   		 $('#goods > img').attr('src',webRoot+data.res.litpic);
   		 $('#goodsname').text(data.res.title);
   		 $('#money').text(data.res.price);
   		 $('#heji').text(data.res.price*1);
   		 plus.storage.setItem('addrid',data.req.id);
   		 plus.storage.setItem('addrname',data.req.username);
   		 plus.storage.setItem('goodsid',data.res.id);
	   	},
	   	error:function(e){
	   		console.log(JSON.stringify(e));
   		}
   });
   
   if(fenlei){
	   	$('.bnthh').on('click',function(){
	   		var addrname = plus.storage.getItem('addrname');
	   		var addrid = plus.storage.getItem('addrid');
		    if(!addrname){
		    	alert('没有地址，无法提交');
		    	return;
		    }
		    var goodsid = plus.storage.getItem('goodsid');
		    var numb = $('#number').val();
		    if(numb<1){
		    	plus.nativeUI.toast('数量不能少于1')
		    	return;
		    }
		    if(numb>1){
		    	plus.nativeUI.toast('同一个商品只能兑换一次')
		    	return;
		    }
		    var textwq = $('#textwq').val();
		    var yanse = $('#yanse').text();
		  	var heji = $('#heji').text();
		  	exchan(userid,$('#money').text(),userid,addrid,goodsid,numb,textwq,yanse,heji);

	   })
   }else{
   	  $('.bnthh').on('click',function(){
   	  	var addrname = plus.storage.getItem('addrname');
	    var addrid = plus.storage.getItem('addrid');
	    if(!addrname){
		    	plus.nativeUI.toast('没有地址，无法提交');
		    	return;
		 }
	    var goodsid = plus.storage.getItem('goodsid');
	    var numb = $('#number').val();
	    if(numb<1){
		    	plus.nativeUI.toast('数量不能少于1')
		    	return;
		    }
	    var textwq = $('#textwq').val();
	    var yanse = $('#yanse').text();
	  	var heji = $('#heji').text();
	  
	  	$.ajax({
        	type:"get",
        	url:apiRoot+"/home/order/orderdan",
        	data : {
        		userid : userid,
        		addrid : addrid,
        		goodsid : goodsid,
        		numbe : numb,
        		beitext : textwq,
        		yanse : yanse,
        		heji : heji,
        	},
        	dataType:'json',
        	success:function(data){
        		plus.nativeUI.toast('提交成功');
//	   				plus.webview.getWebviewById(spage).reload();
   				setTimeout(function(){ 
					ws.close();
				} , 1500); 
        	},error:function(e){
        		
        	}
        });
        
   })
   }
		 
   

   $('.mui-input-numbox').bind('input propertychange', function() { 
			shuliang = $('.mui-input-numbox').val();
			money = $('#money').text();
			heji = shuliang * money;
			$('#heji').text(heji);
	})
   $('.mui-input-numbox').on('change',function(){

		shuliang = $('.mui-input-numbox').val(); 
		money = $('#money').text();
		heji = shuliang * money;
		$('#heji').text(heji);
 
	})

})
function newaddr(id){
	plus.webview.create('./new-addr.html','new-addr.html',{}, {spage : ws.id}).show('pop-in',200);
}

function exchan(userid,goodspay, userid,addrid,goodsid,numb,textwq,yanse,heji){
	$.getJSON(apiRoot+"/home/shop/exchan",{mid:userid,pay:goodspay},function(data){
			if(data.code=='1001'){
			$.ajax({
	        	type:"get",
	        	url:apiRoot+"/home/order/orderdan",
	        	data : {
	        		userid : userid,
	        		addrid : addrid,
	        		goodsid : goodsid,
	        		fenlei : 1,
	        		numbe : numb,
	        		beitext : textwq,
	        		yanse : yanse,
	        		heji : heji,
	        	},
	        	dataType:'json',
	        	success:function(data){
	        		if(data.code==1002){
	        			plus.nativeUI.toast(data.content);
	        		}else if(data.code==1001){
	        			plus.nativeUI.toast('兑换成功');
	//	   				plus.webview.getWebviewById(spage).reload();
	   				setTimeout(function(){ 
						ws.close();
					} , 1500); 
	        		}
	        		
	        	},error:function(e){
	        		
	        	}
	            });
			}
			if(data.code=='1002'){
				plus.nativeUI.toast(data.content);
			}
			if(data.code=='1003'){
				plus.nativeUI.toast(data.content);
			}
		
	})
	
}
