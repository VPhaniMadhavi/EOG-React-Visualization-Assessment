import { GET_MULTI_MEASUREMENTS, GET_MEASUREMENTS } from "../actions";

const initialState = {

    getMultipleMeasurements: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_MEASUREMENTS:
            let measurements = action.payload
            return measurements;
        case GET_MULTI_MEASUREMENTS:
            let getMultipleMeasurements = action.payload
            return getMultipleMeasurements;
        default:
            return state;
    }
};