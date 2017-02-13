var a = 0, b = 0, c = 0;//秒分时
var km = 0.0, qk = 0.0;//公里,千卡
var tt, gl, lul, uid, weight, coord, map, startcoord;//时间，公里，千卡，坐标
var _that,_prev = [], marker, polyline;
var points = [];//原始点信息数组  
var bPoints = [];//百度化坐标数组。用于更新显示范围。 
var pointss = marker = '';
var tim;
var ardata;
//地图操作开始  
var   map ;
ardata=new Array();
document.addEventListener('plusready',function(){
	var ws = plus.webview.currentWebview();
	var userid = plus.storage.getItem('userid');
	if(!userid){
		toast('您还未登录，请登录后再进行此操作');return;
	}
	
    map = new BMap.Map("allmap"); 
//  map.centerAndZoom(new BMap.Point(113.828389, 22.745981), 15); //初始显示中国。  
    map.enableScrollWheelZoom();//滚轮放大缩小  
	map.clearOverlays();   //清除标注，划线
	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
			console.log('您的位置：'+r.point.lng+','+r.point.lat);
			var jingdu = r.point.lng;
			var weidu = r.point.lat;
			var zuob = jingdu+','+weidu;
			plus.storage.setItem('coord', zuob);
			//显示地图
			var point = new BMap.Point(jingdu,weidu);
			_prev = [jingdu,weidu];
			map.centerAndZoom(point, 14);
			map.enableScrollWheelZoom(true);
			// 用经纬度设置地图中心点
			map.clearOverlays(); 
			marker = new BMap.Marker(point);  // 创建标注
			marker.setLabel('当前位置');
			var label = new BMap.Label('当前位置',{"offset":new BMap.Size(9,-15)}); 
			marker.setLabel(label);
			map.addOverlay(marker);  // 将标注添加到地图中
			map.panTo(point);
		}else {
			console.log('failed'+this.getStatus());  
		}        
	},{enableHighAccuracy: true})
//	当点击开始的时候
$('.btn1').click(function(){
//		map.removeOverlay(polyline);
//		startcoord = plus.storage.getItem('coord');//获取点击时的坐标
//		_prev = startcoord.split(',');
//		map.centerAndZoom(new BMap.Point(_prev[0],_prev[1]), 14);

		$('.kaishi').hide();
		$('.jieshu').show();
		$('.zongli').text('00:00:00');
		$('.gongli').text('0.0');
		$('.sudu').text('0.0');
		a = 0; b = 0; c = 0;km = 0.0; 
		tt=setInterval(setTime,1000);
//		gl=setInterval(getDistance,88000);//1.8分钟
//		;//1.8分钟
        tim=setInterval(function(){
        var geolocation = new BMap.Geolocation();
	    geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
		    var lng = r.point.lng;
			var lat = r.point.lat;
	    dynamicLine([{'longitude':lng,'latitude':lat}])
	    }else {
			console.log('failed'+this.getStatus());  
		}  
	    },{enableHighAccuracy: true})
         },2000);//动态生成新的点
//       gl=setInterval(getDistance,2000)
	})	
	//点击结束的时候
	$('.btn3').click(function(){
		console.log(ardata)
		ardata.length=0;
		 plus.storage.setItem('coord','')
		$('.btn3').hide();
		clearInterval(tt);
		clearInterval(gl);
		clearInterval(tim);
		wc = plus.webview.currentWebview();
		bitmap = new plus.nativeObj.Bitmap("test"); 
		// 将webview内容绘制到Bitmap对象中
		setTimeout(function () {
			wc.draw(bitmap,function(){
				console.log('绘制图片成功');
			},function(e){
				console.log('绘制图片失败：'+JSON.stringify(e)); 
			});	
		},200);
		
			setTimeout(function(){ 
				var name = (new Date()).valueOf();
				bitmap.save( "_doc/"+name+".jpg"
				,{}
				,function(i){
					console.log(i.target);
					//console.log('保存图片成功：'+JSON.stringify(i));
					clipImage(i.target);
					plus.storage.setItem('saveimg1',i.target);
					
				}
				,function(e){
					console.log('保存图片失败：'+JSON.stringify(e));
				});
				//var n = "_doc/"+name+".jpg";
				//	 var newImg = document.createElement("img");
				//	 newImg.src = bitmap.toBase64Data();
				//	 document.body.appendChild(newImg);
				
				
			},500); 
		})	
		//裁剪图片
		function clipImage(name){ 
			plus.zip.compressImage({
			src:name,
			dst:name,
			overwrite:true,
			clip:{top:"1%",left:"0.5%",width:"67%",height:"75%"}	 // 裁剪图片中心区域
			},
			function() {
				console.log("保存成功!");
				var jietu = plus.storage.getItem('saveimg1');
				appendpic(jietu);
				//setView2 (5);
			},function(error) {
				alert(name); 
			
			});
		}
		
		$('.btn5').on('click',function(){
			console.log(picc);
			var  lc=$('.gongli').text();
//			plus.webview.create('./record-road2.html','record-road2.html',{},{roadpic : picc}).show('pop-in',200);
			plus.webview.create('./perfect-infor.html','perfect-infor.html',{},{roadpic : picc,lc:lc}).show('pop-in',200);
       })
		
	
})	


//添加线  
function addLine(points){  
    
    var linePoints = [],pointsLen = points.length,i,polyline;  
    if(pointsLen == 0){  
        return;  
    }  
    // 创建标注对象并添加到地图     
    for(i = 0;i <pointsLen;i++){  
        linePoints.push(new BMap.Point(points[i].lng,points[i].lat));  
    }  
    polyline = new BMap.Polyline(linePoints, {strokeColor:"red", strokeWeight:2, strokeOpacity:0.5});   //创建折线  
    map.addOverlay(polyline);   //增加折线  
    
}  


//随机生成新的点，加入到轨迹中。  
function dynamicLine(lnglat){
//	 var obj = eval('(' + lnglat + ')');
    var  obj=lnglat;
	var lng=obj[0].longitude;
	var lat=obj[0].latitude;
	var cord=lng+","+lat;
	plus.storage.setItem('coord',cord)
//  var lng = '113.'+getRandom(828389);  
//  var lat = '22.'+getRandom(745981);  
    var id = getRandom(1000);  
    var point = {"lng":lng,"lat":lat,"status":1,"id":id}  
    var makerPoints = [];  
    var newLinePoints = [];  
    var len;  
    makerPoints.push(point);              
    addMarker(makerPoints);//增加对应该的轨迹点  
    points.push(point);  
    bPoints.push(new BMap.Point(lng,lat));  
    len = points.length;  
    newLinePoints = points.slice(len-2, len);//最后两个点用来画线。  
    
    addLine(newLinePoints);//增加轨迹线  
    setZoom(bPoints);  
    getDistance(lng,lat)
} 

// 获取随机数  
function getRandom(n){  
    return Math.floor(Math.random()*n+1)  
} 

 //在轨迹点上创建图标，并添加点击事件，显示轨迹点信息。points,数组。		
function addMarker ( points ){
   	var pointsLen = points . length ;			 
//	alert(pointsLen);
   	if (pointsLen == 0 ){
   		return ;				
   	}
   	var myIcon = new BMap.Icon ( " track.ico " , new BMap.Size ( 5 , 5 ), {			   
		offset :  new  BMap.Size ( 5 , 5 )
	});
//
// //创建标注对象并添加到地图   			
	for ( var i = 0 ;i < pointsLen;i ++ ){
		pointss = new BMap.Point(points[i]. lng ,points[i]. lat ); 
		marker = new BMap.Marker (pointss, {icon : myIcon});	
		map.addOverlay(marker);              // 将标注添加到地图中
	}
}    


//根据点信息实时更新地图显示范围，让轨迹完整显示。设置新的中心点和显示级别  
function setZoom(bPoints){  
    var view = map.getViewport(eval(bPoints));  
    var mapZoom = view.zoom;   
    var centerPoint = view.center;   
    map.centerAndZoom(centerPoint,mapZoom);  
}  
	
	
//时间	a:秒，b:分，c:时
//var xs;//过了多少小时
function setTime(){
	a += 1;
	if(a == 60){
		a = 0;
		b = b+1;
	}
	if(b == 60)c = c+1;
	if(c == 24){
		clearInterval(tt);
		clearInterval(gl);
	}
	$('.zongli').text((c < 10 ? '0' + c : c)+":"+(b < 10 ? '0' + b :b)+":"+(a < 10 ? '0' + a :a));
}

//获取当前坐标
function getcoord(){
	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
			// 用经纬度设置地图中心点
			map.panTo(r.point); 
			console.log('您的位置：'+r.point.lng+','+r.point.lat);
			var jingdu = r.point.lng;
			var weidu = r.point.lat;
			coord = jingdu+','+weidu;
			
			line(coord);
			//显示地图
			var point = new BMap.Point(jingdu,weidu);
			map.centerAndZoom(point, 14);
			map.enableScrollWheelZoom(true); 
		}else {
			console.log('failed'+this.getStatus()); 
		}        
	},{enableHighAccuracy: true})
}

//定时获取当前位置

function getDistance(lng,lat){

	if(ardata.length==0){
		ardata.push(lng+'|'+lat)
//		getcoord();
	}else{
		line(lng,lat);
	}
}

//var per = 0.01,per2 = 0.001;
function line(lng,lat){
	var dcoord;
	if(ardata.length>0){
		 dcoord = ardata[ardata.length-1].split('|');
	}
	console.log(dcoord[0]+','+dcoord[1])
	// 百度地图API功能
	var pointA = new BMap.Point(dcoord[0], dcoord[1]);  // 创建点坐标A--起始所在位置
	var pointB = new BMap.Point(lng,lat);  // 创建点坐标B--现在所在位置
	var distance = parseInt((map.getDistance(pointA,pointB)));//返回单位m米
	var gldistance = (distance / 1000).toFixed(1);
	console.log(gldistance)
	$('.gongli').text(gldistance); 
	var xs = ((c * 60 * 60) + (b * 60) + a) / (60*60);//过了多少小时
	//console.log(gldistance+" "+xs);
	var sd = parseFloat(gldistance) / parseFloat(xs);
		console.log(parseFloat(sd).toFixed(1))
	$('.sudu').text(parseFloat(sd).toFixed(1));
	ardata.push(lng+'|'+lat)
}


	
