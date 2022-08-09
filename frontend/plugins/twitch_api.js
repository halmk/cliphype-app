import axios from 'axios'

const TwitchAPI = {
  apiURL: '',
  clientId: '',
  token: '',
  hasToken: false,

  getRequest: async (url, params) => {
    if (TwitchAPI.hasToken) {
      return await axios.get(url, {
        headers: {
          'Client-ID': TwitchAPI.clientId,
          Authorization: `Bearer ${TwitchAPI.token}`,
        },
        params,
      })
    } else {
      params.url = url
      console.log(params, TwitchAPI.apiURL)
      return await axios.get(TwitchAPI.apiURL, {
        params,
      })
    }
  },

  /* 名前からIDを取得する */
  getUserId: async (name) => {
    const url = 'https://api.twitch.tv/helix/users'
    const params = {
      login: name,
    }

    return await TwitchAPI.getRequest(url, params)
  },

  /* ユーザがフォローしている配信者を取得する */
  getFollows: async (clientId) => {
    const url = 'https://api.twitch.tv/helix/users/follows'
    const params = {
      from_id: clientId,
      first: 100,
    }

    return await TwitchAPI.getRequest(url, params)
  },

  /* ユーザがフォローしている配信者を取得する */
  getAfterFollows: async (clientId, after) => {
    const url = 'https://api.twitch.tv/helix/users/follows'
    const params = {
      from_id: clientId,
      first: 100,
      after,
    }

    return await TwitchAPI.getRequest(url, params)
  },

  /* ユーザIDからユーザの情報を取得する */
  getUsers: async (userIds) => {
    const url = 'https://api.twitch.tv/helix/users'
    const params = {
      id: userIds,
    }

    return await TwitchAPI.getRequest(url, params)
  },

  /* 配信者のIDを指定して、その配信のクリップを取得する */
  getClips: async (streamerId, datepickerStartedAt, datepickerEndedAt) => {
    const url = 'https://api.twitch.tv/helix/clips'
    const params = {
      broadcaster_id: streamerId,
      started_at: datepickerStartedAt, // RFC3339 format (ex:'2019-08-31T00:00:00Z')
      ended_at: datepickerEndedAt, // RFC3339 format
      first: 27,
    }

    return await TwitchAPI.getRequest(url, params)
  },

  /* クリップのIDを指定してクリップを取得する */
  getClipById: async (clipId) => {
    const url = 'https://api.twitch.tv/helix/clips'
    const params = {
      id: clipId,
    }

    return await TwitchAPI.getRequest(url, params)
  },

  /* カテゴリのIDを指定してクリップを取得する */
  getClipsByGameId: async (
    categoryId,
    datepickerStartedAt,
    datepickerEndedAt
  ) => {
    const url = 'https://api.twitch.tv/helix/clips'
    const params = {
      game_id: categoryId,
      started_at: datepickerStartedAt, // RFC3339 format (ex:'2019-08-31T00:00:00Z')
      ended_at: datepickerEndedAt, // RFC3339 format
      first: 27,
    }

    return await TwitchAPI.getRequest(url, params)
  },

  /* afterで指定されているクリップデータを追加で読み込む */
  getAfterClips: async (
    streamerId,
    datepickerStartedAt,
    datepickerEndedAt,
    clipsAfter
  ) => {
    const url = 'https://api.twitch.tv/helix/clips'
    const params = {
      broadcaster_id: streamerId,
      started_at: datepickerStartedAt, // RFC3339 format (ex:'2019-08-31T00:00:00Z')
      ended_at: datepickerEndedAt, // RFC3339 format
      first: 27,
      after: clipsAfter,
    }

    return await TwitchAPI.getRequest(url, params)
  },

  /* afterで指定されているクリップデータを追加で読み込む */
  getAfterClipsByGameId: async (
    categoryId,
    datepickerStartedAt,
    datepickerEndedAt,
    clipsAfter
  ) => {
    const url = 'https://api.twitch.tv/helix/clips'
    const params = {
      game_id: categoryId,
      started_at: datepickerStartedAt, // RFC3339 format (ex:'2019-08-31T00:00:00Z')
      ended_at: datepickerEndedAt, // RFC3339 format
      first: 27,
      after: clipsAfter,
    }

    return await TwitchAPI.getRequest(url, params)
  },

  /* 配信アーカイブを取得する */
  getVideos: async (streamerId) => {
    const url = 'https://api.twitch.tv/helix/videos'
    const params = {
      user_id: streamerId,
      type: 'archive',
      first: 100,
    }

    return await TwitchAPI.getRequest(url, params)
  },

  /* 配信者のIDを指定して、その配信のクリップを取得する */
  getArchiveClips: async (streamerId, archiveStartDate, archiveEndDate) => {
    const url = 'https://api.twitch.tv/helix/clips'
    const params = {
      broadcaster_id: streamerId,
      started_at: archiveStartDate, // RFC3339 format (ex:'2019-08-31T00:00:00Z')
      ended_at: archiveEndDate, // RFC3339 format
      first: 27,
    }

    return await TwitchAPI.getRequest(url, params)
  },

  /* カテゴリの検索クエリを指定して、カテゴリを検索する */
  searchCategories: async (categoryNameQuery) => {
    const url = 'https://api.twitch.tv/helix/search/categories'
    const params = {
      query: categoryNameQuery,
    }

    return await TwitchAPI.getRequest(url, params)
  },
}

export default ({ app }, inject) => {
  inject('twitch', TwitchAPI)
}
