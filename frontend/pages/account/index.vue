<template>
  <div>
    <v-row justify="center" align="center">
      <v-col class="" cols="12">
        <AccountInfo />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'AccountIndexPage',
  middleware: ['auth', 'user'],
  head() {
    return {
      title: 'Home',
    }
  },
}
</script>
