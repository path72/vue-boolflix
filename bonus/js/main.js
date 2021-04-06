// ###################################################### 
// # Vue.js - MAIN INSTANCE                             # 
// ###################################################### 

var app = new Vue(
	{
		el: '#app',
		data: {
			searchInput   : '',
			tmdbSearchUrl : 'https://api.themoviedb.org/3/search/',
			tmdbLangUrl   : 'https://api.themoviedb.org/3/configuration/languages',
			tmdbPosterUrl : 'https://image.tmdb.org/t/p/original/',
			tmdbApiKey    : '9527ee72ac0381373914837a93bbd7d4',
			tmdbLang      : 'it-IT',
			tmdbLangList  : [],
			tmdbList      : [],
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
				/**
				 *   MOVIE				TV
				 * ! title				name
				 * ! original_title		original_name
				 * ! release_date		first_air_date
				 *   original_language	original_language
				 *   vote_average		vote_average
				 */
				const movieData = axios.get(this.tmdbSearchRequest('movie')+'&query='+query);
				const tvData    = axios.get(this.tmdbSearchRequest('tv')   +'&query='+query);
				const langData  = axios.get(this.tmdbLangUrl+'?api_key='+this.tmdbApiKey);
				axios
					.all([movieData,tvData,langData])
					.then(
						axios.spread((...resps)=>{
							this.tmdbList = resps[0].data.results.concat(resps[1].data.results);
							this.tmdbList.forEach((el)=>{
								resps[2].data.forEach((l)=>{
									if (l.iso_639_1 == el.original_language) el.original_language = l.english_name;
								});
							});
							// console.log(this.tmdbList);
							this.tmdbListIsReady = true;
						})
					);
			},
			tmdbSearchRequest(scope) { // scope = movie,tv
				return this.tmdbSearchUrl+scope+'?api_key='+this.tmdbApiKey+'&language='+this.tmdbLang;
			},
			getPosterSrc(item) {
				if (item.poster_path) return this.tmdbPosterUrl+item.poster_path;
				else return 'img/poster-holder.jpg';
			},
			getYear(release_date){
				if (release_date && release_date.includes('-')) return release_date.split('-')[0];
				else return '';
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
		},
		mounted() {
			this.$refs.search1.focus();
		},
		updated() {
		}
	}
);
// Vue.config.devtools = true;
