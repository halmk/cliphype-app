<template>
  <div>
    <v-row justify="center" align="center">
      <v-col class="" cols="12" sm="10" lg="8">
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
  name: 'AppIndexPage',
  head() {
    return {
      title: 'Home',
    }
  },
}
</script>
