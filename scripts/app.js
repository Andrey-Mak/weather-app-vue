	var apiUrl = 'http://api.openweathermap.org/data/2.5/forecast';
	var apiId = '&appid=412a5eaeb20d769901d086e53c8ade71';
	var keys = '&units=metric&lang=ru';

	var maxHistorySize = 10;

	function formatDate(num){
		return (num < 10) ? '0' + num : num;
	}

	var vm = new Vue({
		el: '#app',
		data: {
			search_city: '',
			coordinates: {
				lat: 30,
				lng: 50
			},
			viewed: localStorage.getItem("weather") ? JSON.parse(localStorage.getItem("weather")) : [],
			weatherInCity: '',
			showWeather: false,
			activeTab: "0",
			weatherForOneDay: "",
			loaded: false
		},
		methods: {
			getWeatherForCity: function(){
				var that = this;
				this.loaded = true;
				$.getJSON(apiUrl + '?q=' + that.search_city + apiId + keys, function (data) {
					that.updateWeatherInfo(data);
					that.showSavedInfo(data);
				});
			},
			getCoordinates: function(){
				var that = this;
				this.loaded = true;
				$.getJSON(apiUrl + '?lat=' + that.coordinates.lat.toFixed(2) + '&lon=' + that.coordinates.lng.toFixed(2) + apiId + keys, function (data) {
					that.updateWeatherInfo(data);
				});
			},
			getWatherForTheDay: function(){
				var prevItem = "";
				this.weatherForOneDay = [];
				for (var i = 0, k = -1; i < this.weatherInCity.list.length; i++) {
					var currentDay = this.weatherInCity.list[i]["dt_txt"].split(" ");
					if(currentDay[0] !== prevItem){
						k++;
						this.weatherForOneDay[k] = [];
					}
					this.weatherForOneDay[k].push(this.weatherInCity.list[i]);
					prevItem = currentDay[0];
				}
				return this.weatherForOneDay;
			},
			updateWeatherInfo: function(data){
				this.updateStorage(data);
				this.weatherInCity = data;
				this.getWatherForTheDay();
				this.search_city = this.weatherInCity.city.name;
				this.viewed.push(this.weatherInCity);
				this.showWeather = true;
				localStorage.setItem("weather", JSON.stringify(this.viewed));
				this.loaded =  false;
			},
			updateStorage: function(data){
				if(this.viewed.length > maxHistorySize){
					this.viewed.splice(0, 1);
				}
				this.viewed.forEach(function(cityWeather, index, arr){
					if(cityWeather.city.id == data.city.id){
						arr.splice(index, 1);
					}
				})
			},
			showSavedInfo: function(savedCity){
				this.coordinates = {
					lat: savedCity.city.coord.lat,
					lng: savedCity.city.coord.lon
				};
				placeMarkerAndPanTo(this.coordinates);
				this.weatherInCity = savedCity;
				this.getWatherForTheDay();
				this.search_city = savedCity.city.name;
			},
			deleteViewedCity: function(index){
				if(this.viewed.length - 1 == index && this.viewed[this.viewed.length - 2]){
					this.showSavedInfo(this.viewed[this.viewed.length - 2]);
				}
				this.viewed.splice(index, 1);
			}
		},
		watch: {
			viewed: function(){
				localStorage.setItem("weather", JSON.stringify(this.viewed));
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
