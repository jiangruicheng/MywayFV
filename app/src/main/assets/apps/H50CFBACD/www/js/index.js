document.addEventListener('plusready',function(){
	var map = new BMap.Map("allmap");
	var geolocation = new BMap.Geolocation();
	 geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
//			var cur_city = r.address.city;//获取当前城市
			var jingdu = r.point.lng;//经度
			var weidu = r.point.lat;//纬度
			var id = plus.storage.getItem('userid');
			//console.log(id+'---'+jingdu +'---'+ weidu);
			var coord = jingdu+','+weidu;
			plus.storage.setItem('coord');
			
				var point = new BMap.Point(coord);
				map.centerAndZoom(point,12);
				var geoc = new BMap.Geocoder();    
			
				map.addEventListener("click", function(e){         
					var pt = e.point;
					geoc.getLocation(pt, function(rs){
						var addComp = rs.addressComponents;
						alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
					});        
				});
			if(!jingdu && !weidu){
				return;
			}
			$.ajax({
				type:"get",
				url:apiRoot +"?m=Home&c=user&a=weizhi",
				data:{
					id:id,
					jingdu:jingdu,
					weidu:weidu
				},
				dataType:'json',
				success:function(data){
//					console.log(JSON.stringify(data));
					
				},
				error:function(e){
					console.log(JSON.stringify(e));
				}
			});
		}else {
			console.log('failed'+this.getStatus()); 
		}        
	},{enableHighAccuracy: true})
})