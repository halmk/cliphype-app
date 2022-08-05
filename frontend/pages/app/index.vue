<template>
  <v-row align="center">
    <v-col class="grey lighten-3" cols="12" sm="4">
      <v-container class="grey lighten-5">
        <StreamerSearchForm />
      </v-container>
    </v-col>
    <v-col class="grey lighten-3" cols="12">
      <v-container class="grey lighten-5">
        <ClipListView />
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
export default {
    name: "AppPage",
}
</script>
