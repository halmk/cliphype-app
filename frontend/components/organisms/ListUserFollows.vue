<template>
  <v-list
    style="max-height: 480px"
    class="overflow-y-auto scrollbar-hidden"
    dense
  >
    <v-list-item
      v-for="(follow, i) in follows"
      :key="i"
      :to="follow.to"
      router
      exact
      dense
    >
      <v-list-item-avatar>
        <v-img :src="follow.icon"></v-img>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-text="follow.to_name" />
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ListUserFollows',
  data: () => ({}),
  computed: {
    ...mapState({
      follows: (state) => state.user.follows,
    }),
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
