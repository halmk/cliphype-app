<template>
  <div>
    <h3>Select the range from calendar</h3>
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      :return-value.sync="dateRange"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template #activator="{ on, attrs }">
        <v-text-field
          v-model="dateRangeText"
          prepend-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="dateRange"
        no-title
        scrollable
        range
        @input="send"
      >
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
        <v-btn text color="primary" @click="$refs.menu.save(dateRange)">
          OK
        </v-btn>
      </v-date-picker>
    </v-menu>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'ClipDateRangePicker',
  props: {},
  data: () => ({
    dateRange: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
    menu: false,
  }),
  computed: {
    dateRangeText() {
      return this.dateRange.join(' ~ ')
    },
  },
  mounted() {
    this.send()
  },
  methods: {
    send() {
      const dates = [
        moment(`${this.dateRange[0]}T00:00:00`).toISOString(),
        moment(`${this.dateRange[1]}T23:59:59`).toISOString(),
      ]
      console.log(dates)
      this.$emit('input', dates)
    },
  },
}
</script>
