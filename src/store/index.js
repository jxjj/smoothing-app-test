import { createStore } from "vuex";
import simpleSmoothingSpline from "@umn-latis/simple-smoothing-spline";
import moarData from "../data/moarData";

const store = createStore({
  state: {
    dataSets: [
      {
        name: "moarData",
        points: moarData,
      },
    ],
    spline: {
      name: "smoothing spline",
      points: [],
    },
    lambda: 1,
  },
  mutations: {
    setSpline(state, { points }) {
      state.spline.points = points;
    },
    setLambda(state, lambda) {
      state.lambda = lambda;
    },
  },
  actions: {
    async updateSplineAsync({ commit, state }) {
      const allDataPoints = state.dataSets.flatMap((s) => s.points);
      const spline = await simpleSmoothingSpline(allDataPoints, {
        lambda: state.lambda,
      });
      commit("setSpline", spline);
    },
    setLambda({ commit, dispatch }, lambda) {
      commit("setLambda", lambda);
      dispatch("updateSplineAsync");
    },
  },
});

export default store;
