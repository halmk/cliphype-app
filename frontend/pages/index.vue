<template>
  <div>
    <v-row justify="center" align="center">
      <v-col class="grey lighten-3" cols="12" sm="8" md="10" lg="12">
        <About />
      </v-col>
    </v-row>
    <v-row justify="center" align="center" class="my-5">
      <v-col cols="12" sm="4">
        <StreamerSearchForm />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  head () {
    return {
      title: 'Home'
    }
  },
  name: 'AppIndexPage',
}
</script>
