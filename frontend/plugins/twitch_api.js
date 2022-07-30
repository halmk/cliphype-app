var TwitchAPI = {
	apiUrl: "http://localhost:8000/twitchapi",
	clientId: '',
	token: '',
	is_token: false,

	getRequest: async function(url, params) {
		if (this.is_token) {
			return await axios.get(url, {
				headers: {
					'Client-ID': this.clientId,
					'Authorization': `Bearer ${this.token}`
				},
				params: params
			});
		} else {
			return await axios.get(this.apiUrl, {
				params: {
					'url': url,
					'params': params
				}
			});
		}
	},

	/* 名前からIDを取得する */
	getUserId: async function(name) {
		let url = 'https://api.twitch.tv/helix/users';
		let params = {
			'login': name
		};

		return await this.getRequest(url, params);
	},

	/* ユーザがフォローしている配信者を取得する */
	getFollows: async function(clientId) {
		let url = 'https://api.twitch.tv/helix/users/follows';
		let params = {
			'from_id': clientId,
			'first': 100
		};

		return await this.getRequest(url, params);
	},

	/* ユーザがフォローしている配信者を取得する */
	getAfterFollows: async function(clientId, after) {
		let url = 'https://api.twitch.tv/helix/users/follows';
		let params = {
			'from_id': clientId,
			'first': 100,
			'after': after
		};

		return await this.getRequest(url, params);
	},

	/* ユーザIDからユーザの情報を取得する */
	getUsers: async function(userIds) {
		let url = 'https://api.twitch.tv/helix/users';
		let params = {
			'id': userIds
		}

		return await this.getRequest(url, params);
	},

	/* 配信者のIDを指定して、その配信のクリップを取得する */
	getClips: async function(streamerId, datepickerStartedAt, datepickerEndedAt) {
		let url = 'https://api.twitch.tv/helix/clips';
		let params = {
			'broadcaster_id': streamerId,
			'started_at': datepickerStartedAt, // RFC3339 format (ex:'2019-08-31T00:00:00Z')
			'ended_at': datepickerEndedAt,     // RFC3339 format
			'first': 27,
		};

		return await this.getRequest(url, params);
	},

	/* クリップのIDを指定してクリップを取得する */
	getClipById: async function(clip_id) {
		let url = 'https://api.twitch.tv/helix/clips';
		let params = {
			'id': clip_id,
		};

		return await this.getRequest(url, params);
	},

	/* カテゴリのIDを指定してクリップを取得する */
	getClipsByGameId: async function(category_id, datepickerStartedAt, datepickerEndedAt) {
		let url = 'https://api.twitch.tv/helix/clips';
		let params = {
			'game_id': category_id,
			'started_at': datepickerStartedAt, // RFC3339 format (ex:'2019-08-31T00:00:00Z')
			'ended_at': datepickerEndedAt,     // RFC3339 format
			'first': 27,
		};

		return await this.getRequest(url, params);
	},

	/* afterで指定されているクリップデータを追加で読み込む */
	getAfterClips: async function(streamerId, datepickerStartedAt, datepickerEndedAt, clipsAfter) {
		let url = 'https://api.twitch.tv/helix/clips';
		let params = {
			'broadcaster_id': streamerId,
			'started_at': datepickerStartedAt, // RFC3339 format (ex:'2019-08-31T00:00:00Z')
			'ended_at': datepickerEndedAt,     // RFC3339 format
			'first': 27,
			'after': clipsAfter,
		};

		return await this.getRequest(url, params);
	},

	/* afterで指定されているクリップデータを追加で読み込む */
	getAfterClipsByGameId: async function(category_id, datepickerStartedAt, datepickerEndedAt, clipsAfter) {
		let url = 'https://api.twitch.tv/helix/clips';
		let params = {
			'game_id': category_id,
			'started_at': datepickerStartedAt, // RFC3339 format (ex:'2019-08-31T00:00:00Z')
			'ended_at': datepickerEndedAt,     // RFC3339 format
			'first': 27,
			'after': clipsAfter,
		};

		return await this.getRequest(url, params);
	},


	/* 配信アーカイブを取得する */
	getVideos: async function(streamerId) {
		let url = 'https://api.twitch.tv/helix/videos';
		let params = {
			'user_id': streamerId,
			'type': 'archive',
			'first': 100,
		};

		return await this.getRequest(url, params);
	},

	/* 配信者のIDを指定して、その配信のクリップを取得する */
	getArchiveClips: async function(streamerId, archiveStartDate, archiveEndDate) {
		let url = 'https://api.twitch.tv/helix/clips';
		let params = {
			'broadcaster_id': streamerId,
			'started_at': archiveStartDate, // RFC3339 format (ex:'2019-08-31T00:00:00Z')
			'ended_at': archiveEndDate,     // RFC3339 format
			'first': 27,
		};

		return await this.getRequest(url, params);
	},

	/* カテゴリの検索クエリを指定して、カテゴリを検索する */
	searchCategories: async function(categoryNameQuery) {
		let url = 'https://api.twitch.tv/helix/search/categories';
		let params = {
			'query': categoryNameQuery,
		};

		return await this.getRequest(url, params);
	}
}