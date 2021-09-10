<script setup>
import Plotly from "plotly.js-dist";
import { onMounted, computed, watchEffect, watch } from "@vue/runtime-core";
import { useStore } from "vuex";

const PLOT_ID = "plot";

const getProps = (prop) => (arr) => arr.map((item) => item[prop]);
const getXs = getProps("x");
const getYs = getProps("y");

const store = useStore();
const allDataPoints = computed(() =>
  store.state.dataSets.flatMap((set) => set.points)
);
const spline = computed(() => store.state.spline);
const lambda = computed(() => store.state.lambda);
const sliderValue = computed(() => convertToSliderValue(lambda.value));

function convertToLambda(sliderValue) {
  return 0.00001 * 2 ** sliderValue;
}

function convertToSliderValue(lambda) {
  return Math.round(Math.log(lambda / 0.00001) / Math.log(2));
}

const pointsToTrace = (points = [], opts = {}) => ({
  x: getXs(points),
  y: getYs(points),
  mode: "markers",
  type: "scatter",
  ...opts,
});

const getTraces = () => [
  pointsToTrace(allDataPoints.value),
  pointsToTrace(spline.value.points, { mode: "lines", line: { width: 5 } }),
];

const updatePlot = () => Plotly.react(PLOT_ID, getTraces());

const handleLambdaChange = (event) => {
  const sliderValue = event.target.value;
  store.dispatch("setLambda", convertToLambda(sliderValue));
};

onMounted(async () => {
  Plotly.newPlot(PLOT_ID, getTraces());
  store.dispatch("setLambda", convertToLambda(50));

  watchEffect(() => {
    updatePlot();
  });
});
</script>

<template>
  <h1>Simple Smoothing Spline Test App</h1>

  <div>
    <label for="smoothness">Smoothness</label>
    <input
      type="range"
      id="smoothness"
      name="smoothness"
      min="0"
      max="80"
      step="1"
      :value="convertToSliderValue(lambda)"
      @change="handleLambdaChange"
    />
    <p>λ: {{ lambda }}</p>
    <p>sliderValue: {{ sliderValue }}</p>
  </div>
  <div :id="PLOT_ID"></div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
