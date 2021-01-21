import { GET_HEARTBEAT } from "../actions";

const initialState = {

    after: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_HEARTBEAT:
            return {
                ...state,
                after: action.payload
            };
        default:
            return state;
    }
};
