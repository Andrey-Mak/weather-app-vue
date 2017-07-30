	var apiUrl = 'http://api.openweathermap.org/data/2.5/forecast';
	var apiId = '&appid=412a5eaeb20d769901d086e53c8ade71';
	var keys = '&units=metric&lang=ru';
	var coordinates = {
		lat: 30,
		lng: 50
	};
	function formatDate(num){
		return (num < 10) ? '0' + num : num;
	}

	var vm = new Vue({
		el: '#app',
		data: {
			search_city: '',
			showMap: false,
			viewed: [],
			info: '',
			show: false,
			latitude: coordinates.lat,
			longitude: coordinates.lng,
			activeTab: "0",
			loaded: false
		},
		methods: {
			getWeatherForCity: function(){
				var that = this;
				this.loaded = true;
				$.getJSON(apiUrl + '?q=' + that.search_city + apiId + keys, function (data) {
					that.loaded =  false;
					that.info = data;
				});
			},
			getCoordinates: function(){
				this.latitude = coordinates.lat.toFixed(2);
				this.longitude = coordinates.lng.toFixed(2);
				var that = this;
				this.loaded = true;
				$.getJSON(apiUrl + '?lat=' + that.latitude + '&lon=' + that.longitude + apiId + keys, function (data) {
					console.log(data);
					that.loaded =  false;
					that.info = data;
					that.search_city = that.info.city.name;
					that.viewed.push(that.info);
					that.show = true;
				});
			},
			getWatherForTheDay: function(){
				var prevItem = "";
				var weatherForOneDay = [];
				for (var i = 0, k = -1; i < this.info.list.length; i++) {
					var currentDay = this.info.list[i]["dt_txt"].split(" ");
					if(currentDay[0] !== prevItem){
						k++;
						weatherForOneDay[k] = [];
					}
					weatherForOneDay[k].push(this.info.list[i]);
					prevItem = currentDay[0];
				}
				console.log(weatherForOneDay);
				return weatherForOneDay;
			}
		},
		filters: {
			formatDay: function(value){
				var date = new Date(value);
				return formatDate(date.getDate()) + "." + formatDate(date.getMonth() + 1);
			},
			formatTime: function(value) {
				var date = new Date(value);
				return formatDate(date.getHours()) + "." + formatDate(date.getMinutes());
			}
		}
	});
