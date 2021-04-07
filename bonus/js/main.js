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
			tmdbGenreUrl		: 'http://api.themoviedb.org/3/genre',
			tmdbMovieUrl		: 'https://api.themoviedb.org/3/movie',
			tmdbTvUrl			: 'https://api.themoviedb.org/3/tv',
			tmdbPosterFullUrl	: 'https://image.tmdb.org/t/p/original',
			tmdbPosterThumbUrl	: 'https://image.tmdb.org/t/p/w342',
			tmdbApiKey			: '9527ee72ac0381373914837a93bbd7d4',
			tmdbLang			: 'it-IT',
			tmdbList			: [],
			tmdbGenreList		: [[],[]], // movie,tv genres
			tmdbListIsReady		: false,
			tmdbCastIsReady		: false,
			overCard			: false,
			castLength			: 5
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
				 *   	MOVIE				TV
				 * !	title				name				!
				 * 	 	genre_name			genre_name			new
				 * 	 	cast5				cast5				new
				 * ! 	original_title		original_name		!
				 * ! 	release_date		first_air_date		!
				 *   	original_language	original_language
				 *   	overview			overview
				 *   	vote_average		vote_average
				 */
				const movieData = axios.get(this.tmdbSearchUrl+'/movie', this.getParams('api_key','language','query'));
				const tvData    = axios.get(this.tmdbSearchUrl+'/tv',    this.getParams('api_key','language','query'));
				axios
					.all([movieData,tvData])
					.then(
						axios.spread((...resps)=>{
							let mov = resps[0].data.results;
							let tvs = resps[1].data.results;
							this.addGenreNames(mov,this.tmdbGenreList[0]); 
							this.addCastNames(mov,'mov');
							this.addGenreNames(tvs,this.tmdbGenreList[1]); 
							this.addCastNames(tvs,'tvs');
							this.tmdbList = [...mov,...tvs];
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
			addGenreNames(itemList,genreList) {
				itemList.forEach((el)=>{ 
					let gen = [];
					genreList.forEach((g)=>{ 
						if (el.genre_ids.includes(g.id) && !gen.includes(g.id)) gen.push(g.name);
					}); 
					el.genre_names = gen;
				}); 
			},
			addCastNames(itemList,product){
				switch (product) {
					case 'mov': url = this.tmdbMovieUrl; break;
					case 'tvs': url = this.tmdbTvUrl;    break;
				}
				itemList.forEach((el)=>{
					axios
						.get(url+'/'+el.id+'/credits', this.getParams('api_key','language'))
						.then((resp)=>{
							let c = resp.data.cast, list5 = [], i=0;
							let len = (c.length >= this.castLength) ? this.castLength : c.length; 
							while (list5.length < len-1) {
								if (c[i].name && c[i].known_for_department=='Acting' && !list5.includes(c[i].name)) 
									list5.push(c[i].name);
								i++;
							};
							el.cast5 = list5;
							this.tmdbCastIsReady = true;
						});
				});
			},
			getPosterSrc(item) {
				if (item.poster_path) return this.tmdbPosterThumbUrl+'/'+item.poster_path;
				else return 'img/poster-holder.jpg';
			},
			getTitles(item) {
				let title = 'title', originalTitle = '';
				if (!item.title) title = 'name';
				if (item['original_'+title] != item[title]) originalTitle = item['original_'+title];
				return {'title': item[title], originalTitle };
			},
			getListFromArray(array) {
				let str = '';
				array.forEach((el,index)=>{
					str += el + ((index == array.length-1) ? '' : ', ');
				});
				return str;
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
			},
			getGenres() {
				const movieData = axios.get(this.tmdbGenreUrl+'/movie/list',this.getParams('api_key','language'));
				const tvData    = axios.get(this.tmdbGenreUrl+'/tv/list',   this.getParams('api_key','language'));
				axios
					.all([movieData,tvData])
					.then(
						axios.spread((...resps)=>{
							this.tmdbGenreList[0] = resps[0].data.genres;
							// console.log(this.tmdbGenreList[0]);
							this.tmdbGenreList[1] = resps[1].data.genres;
							// console.log(this.tmdbGenreList[1]);
						})
					);
			}
		},
		computed: {
		},
		created() {
			this.getGenres();
		},
		mounted() {
			this.$refs.search1.focus();
		},
		updated() {
		}
	}
);
// Vue.config.devtools = true;
