import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Provider, createClient, useQuery } from "urql";
import { makeStyles } from "@material-ui/core/styles";

import MetricSelector from './MetricSelector';


const useStyles = makeStyles({
    divDisplay: {
        margin: "3%",
        padding: "20px"
    }
});

const client = createClient({
    url: "https://react.eogresources.com/graphql"
});

const heartBeatQuery = `
query {
  heartBeat                                                                                                              
}
`;

export default () => {
    return (
        <Provider value={client}>
            <Container />
        </Provider>
    );
};

const Container = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [heartBeatRes] = useQuery({
        query: heartBeatQuery
    });

    const { data, error } = heartBeatRes;
    useEffect(
        () => {
            if (error) {
                console.log(error.message);
                return;
            }
            if (!data) return;
            console.log(data);
            dispatch({
                type: "GET_HEARTBEAT",
                payload: data.heartBeat
            })
        }
    );



    return (
        <div >
            <MetricSelector />
        </div>
    );
}
