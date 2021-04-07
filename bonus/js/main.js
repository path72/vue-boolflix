// ###################################################### 
// # Vue.js - MAIN INSTANCE                             # 
// ###################################################### 

var app = new Vue(
	{
		el: '#app',
		data: {
			searchInput			: '',
			tmdbSearchUrl		: 'https://api.themoviedb.org/3/search',
			tmdbLangUrl			: 'https://api.themoviedb.org/3/configuration/languages',
			tmdbPosterFullUrl	: 'https://image.tmdb.org/t/p/original',
			tmdbPosterThumbUrl	: 'https://image.tmdb.org/t/p/w342',
			tmdbApiKey			: '9527ee72ac0381373914837a93bbd7d4',
			tmdbLang			: 'it-IT',
			tmdbList			: [],
			tmdbListIsReady		: false,
			overCard: false
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
				 * ! title				name			!
				 * ! original_title		original_name	!
				 * ! release_date		first_air_date	!
				 *   original_language	original_language
				 *   overview			overview
				 *   vote_average		vote_average
				 */
				const movieData = axios.get(this.tmdbSearchUrl+'/movie', this.getParams('api_key','language','query'));
				const tvData    = axios.get(this.tmdbSearchUrl+'/tv',    this.getParams('api_key','language','query'));
				axios
					.all([movieData,tvData])
					.then(
						axios.spread((...resps)=>{
							this.tmdbList = resps[0].data.results.concat(resps[1].data.results);
							// console.log(this.tmdbList);
							this.tmdbListIsReady = true;
						})
					);
			},
			getParams(...params) {
				let obj = {params: {}};
				params.forEach((el)=>{
					if (el == 'api_key')  obj.params[el] = this.tmdbApiKey;
					if (el == 'language') obj.params[el] = this.tmdbLang;
					if (el == 'query')    obj.params[el] = this.searchInput;
				});
				return obj;
			},
			getPosterSrc(item) {
				if (item.poster_path) return this.tmdbPosterThumbUrl+'/'+item.poster_path;
				else return 'img/poster-holder.jpg';
			},
			getTitles(item) {
				let title = 'title', originalTitle = '';
				if (!item.title) title = 'name';
				if (item['original_'+title] != item[title]) originalTitle = item['original_'+title];
				return {'title': item[title], originalTitle }
			},
			getYear(item){
				let release = 'release_date';
				if (!item.release_date) release = 'first_air_date';   
				if (item[release] && item[release].includes('-'))
					 return item[release].split('-')[0];
				else return '';
			},
			getFlagSrc(item) {
				return 'https://www.unknown.nu/flags/images/'+item.original_language+'-100';
			},
			getRatingStyle(vote_average) {
				return '--rating: '+vote_average+';';
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
