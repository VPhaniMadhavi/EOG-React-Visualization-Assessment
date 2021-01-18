import { GET_MEASUREMENTS } from "../actions";

const initialState = {
    tubingPressure: [],
    casingPressure: [],
    oilTemp: [],
    flareTemp: [],
    waterTemp: [],
    injValveOpen: [],
    lastestMetricValue: ''
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_MEASUREMENTS:
            let measurements = action.payload
            return measurements;
        default:
            return state;
    }
};