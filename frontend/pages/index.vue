<template>
  <v-row justify="center" align="center">
    <v-col class="blue" cols="12" sm="8" md="10" lg="12">
      <About />
    </v-col>
    <v-col cols="12" sm="4" my-2>
      <StreamerSearchForm />
    </v-col>
  </v-row>
</template>

<script>
import StreamerSearchForm from '../components/StreamerSearchForm.vue'
export default {
  name: 'IndexPage',
  components: { StreamerSearchForm },
}
</script>
