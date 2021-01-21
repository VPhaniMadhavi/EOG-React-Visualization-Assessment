import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { combineReducers } from 'redux-starter-kit';
import sagas from './sagas';
import reducers from './reducers';
import weatherReducer from "./reducers/Weather";
import metricReducer from "./reducers/MetricSelector";
import heartBeatReducer from "./reducers/HeartBeat";
import measurementsReducer from "./reducers/Measurements";


const reducer = combineReducers(reducers);
export type IState = ReturnType<typeof reducer>;
export default () => {
  const rootReducer = combineReducers({
    weather: weatherReducer,
    selectedMetrics: metricReducer,
    heartBeat: heartBeatReducer,
    measurements: measurementsReducer,
    getMultipleMeasurements: measurementsReducer
  });

  const composeEnhancers = composeWithDevTools({});
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = applyMiddleware(sagaMiddleware);
  const store = createStore(rootReducer, composeEnhancers(middlewares));
  sagaMiddleware.run(sagas);
  return store;
};
