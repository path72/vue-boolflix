// ###################################################### 
// # Vue.js - MAIN INSTANCE                             # 
// ###################################################### 

var app = new Vue(
	{
		el: '#app',
		data: {
			searchInput       : '',
			tmdbApiUrl        : 'https://api.themoviedb.org/3/search/movie?api_key=9527ee72ac0381373914837a93bbd7d4',
			tmdbLangApiUrl    : 'https://api.themoviedb.org/3/configuration/languages?api_key=9527ee72ac0381373914837a93bbd7d4',
			tmdbLangList      : [],
			tmdbPosterBaseUrl : 'https://image.tmdb.org/t/p/original',
			tmdbLangQuery     : 'it-IT',
			tmdbList          : [],
			tmdbListIsReady   : false
		},
		methods: {
			getResponse() {
				if (this.searchInput && this.searchInput.trim()) {
					this.searchInput = this.searchInput.trim().replace(/\s+/g,'+');
					// console.log(this.searchInput);
					this.getTmdbData(this.searchInput);
					this.searchInput = '';
				}
			},
			getTmdbData(query) {
				axios
					.get(this.tmdbApiUrl+'&language='+this.tmdbLangQuery+'&query='+query)
					.then((resp)=>{
						this.tmdbList = resp.data.results;
						this.tmdbListIsReady = true;
						console.log(this.tmdbList);
					});
			},
			getLang(original_language) {
				let lang = '';
				this.tmdbLangList.forEach((el)=>{
					if (el.iso_639_1 == original_language) lang = el.english_name;
				});
				return lang;
			},
			getLangList() {
				axios
					.get(this.tmdbLangApiUrl)
					.then((resp)=>{
						this.tmdbLangList = resp.data;
					});
			},
			getYear(release_date){
				return release_date.split('-')[0];

			},
			getRatingStyle(vote_average) {
				return '--rating: '+vote_average+';';
			},
			isViewable(item) {
				return true;
			},
			isSelected(title) {
				return false;
			},
			isSorted(title) {
				return false;
			}
		},
		computed: {
		},
		created() {
			this.getLangList();
		},
		mounted() {
			this.$refs.search1.focus();
		},
		updated() {
		}
	}
);
// Vue.config.devtools = true;
