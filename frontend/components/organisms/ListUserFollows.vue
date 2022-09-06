<template>
  <div>
    <div class="mt-3 mb-3 ml-4">
      Follow channels
      <v-icon
        v-if="!filterFavorite"
        right
        color="grey lighten-1"
        @click.stop="filterFavorite = true"
      >
        mdi-star-outline
      </v-icon>
      <v-icon
        v-else
        right
        color="yellow darken-3"
        @click.stop="filterFavorite = false"
      >
        mdi-star
      </v-icon>
    </div>
    <v-virtual-scroll :items="filteredFollows" height="450" item-height="60">
      <template #default="{ item }">
        <v-list-item :key="item.to_login" :to="item.to" router exact nuxt>
          <v-list-item-avatar>
            <v-img :src="item.icon"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="text-subtitle-2" v-text="item.to_name" />
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon
              v-if="!item.isFavorite"
              color="grey lighten-1"
              @click.prevent="alterFavorite(item.to_login)"
            >
              mdi-star-outline
            </v-icon>
            <v-icon
              v-else
              color="yellow darken-3"
              @click.prevent="alterFavorite(item.to_login)"
            >
              mdi-star
            </v-icon>
          </v-list-item-icon>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ListUserFollows',
  data: () => ({
    filterFavorite: false,
    favFollowsNames: [],
  }),
  computed: {
    ...mapState({
      follows: (state) => state.user.follows,
    }),
    filteredFollows() {
      if (this.filterFavorite) {
        return this.follows.filter((follow) => {
          const fav = this.favFollowsNames.filter(
            (fav) => fav === follow.to_login
          )
          return fav.length === 1
        })
      } else {
        return this.follows
      }
    },
  },
  mounted() {
    this.fetchFavFollows()
    this.setFavFollows()
  },
  methods: {
    alterFavorite(name) {
      const index = this.follows.findIndex((follow) => follow.to_login === name)
      this.$store.commit('user/alterFavorite', index)
      if (this.follows[index].isFavorite) {
        this.favFollowsNames.push(name)
      } else {
        this.favFollowsNames = this.favFollowsNames.filter(
          (followName) => followName !== name
        )
      }
      this.saveFavFollows()
    },
    saveFavFollows() {
      this.uniqueFavFollows()
      localStorage.setItem('favFollows', JSON.stringify(this.favFollowsNames))
    },
    fetchFavFollows() {
      if (localStorage.getItem('favFollows')?.length) {
        this.favFollowsNames = JSON.parse(localStorage.getItem('favFollows'))
      }
    },
    setFavFollows() {
      this.favFollowsNames.forEach((followName) => {
        this.follows.forEach((follow, index) => {
          if (follow.to_login === followName)
            this.$store.commit('user/alterFavorite', index)
        })
      })
    },
    uniqueFavFollows() {
      const set = new Set(this.favFollowsNames)
      this.favFollowsNames = Array.from(set)
    },
  },
}
</script>

<style>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge add Firefox */
.scrollbar-hidden {
  -ms-overflow-style: none;
  scrollbar-width: none; /* Firefox */
}
</style>
