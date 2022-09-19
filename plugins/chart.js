import Vue from 'vue'
import { Line } from 'vue-chartjs'
import ChartStreaming from 'chartjs-plugin-streaming'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  TimeScale,
  ChartStreaming
)

Vue.component('LineChart', {
  extends: Line,
})
