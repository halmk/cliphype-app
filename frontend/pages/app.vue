<template>
  <v-row align="center">
    <v-col class="blue" cols="12" sm="4">
      <v-container class="green">
        <StreamerSearchForm />
      </v-container>
    </v-col>
    <v-col class="blue" cols="12">
      <v-container class="green">
        <ClipList />
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
import StreamerSearchForm from '../components/StreamerSearchForm.vue';
import ClipList from '../components/ClipList.vue';
export default {
    name: "AppPage",
    components: { StreamerSearchForm, ClipList }
}
</script>
