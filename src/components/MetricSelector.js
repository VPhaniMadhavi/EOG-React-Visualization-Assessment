

import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from "react-redux";
import Chart from './Chart';
//import _without from "lodash/without";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import CancelIcon from "@material-ui/icons/Cancel";
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { Grid } from '@material-ui/core/'
import { SubscriptionClient } from "subscriptions-transport-ws";
import {
    Provider,
    createClient,
    useSubscription,
    defaultExchanges,
    subscriptionExchange
} from "urql";


const client = createClient({
    url: "https://react.eogresources.com/graphql",
    exchanges: [...defaultExchanges, subscriptionExchange({
        forwardSubscription: operation => subscriptionClient.request(operation)
    })]
});

const measurementSubscriptionQuery = `
subscription{
    newMeasurement{
        metric
        value
        unit
        at
    }
}
`;

const handleSubscription = (measurements = [], response) => {
    return [response.newMeasurement, ...measurements];
};

const subscriptionClient = new SubscriptionClient("ws://react.eogresources.com/graphql", {});

const allMetrics = ["oilTemp", "tubingPressure", "injValveOpen", "flareTemp", "waterTemp", "casingPressure"];

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300

    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    root: {
        flexGrow: 1
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary
    },
    whiteBackground: {
        backgroundColor: "#FFF"
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
        maxWidth: 600
    },
    chips: {
        display: "flex",
        flexWrap: "wrap",
    },
    chip: {
        margin: 5,
        backgroundColor: "#FFF",

    },

}
));
const initialSelected = ["oilTemp"];


export default () => {
    return (
        <Provider value={client}>
            <MetricSelector />
        </Provider>
    );
};

function MetricSelector() {
    const classes = useStyles();
    const dispatch = useDispatch();
    var selectedMetric = useSelector(state => state.selectedMetrics.selectedMetric);
    const [metriic, setMetric] = React.useState(initialSelected);
    const [res] = useSubscription({ query: measurementSubscriptionQuery }, handleSubscription);


    if (!res.data) {
        return <p></p>;
    }

    const filteredTubingP = res.data.filter(measurement => measurement.metric === "tubingPressure")
    const tpData = filteredTubingP.slice(0, 1).map(measurement => measurement.value)
    const filteredCasingP = res.data.filter(measurement => measurement.metric === "casingPressure")
    const cpData = filteredCasingP.slice(0, 1).map(measurement => measurement.value)
    const filteredOilT = res.data.filter(measurement => measurement.metric === "oilTemp")
    const otData = filteredOilT.slice(0, 1).map(measurement => measurement.value)
    const filteredFlareT = res.data.filter(measurement => measurement.metric === "flareTemp")
    const ftData = filteredFlareT.slice(0, 1).map(measurement => measurement.value)
    const filteredWaterT = res.data.filter(measurement => measurement.metric === "waterTemp")
    const wtData = filteredWaterT.slice(0, 1).map(measurement => measurement.value)
    const filteredInjValve = res.data.filter(measurement => measurement.metric === "injValveOpen")
    const injValveData = filteredInjValve.slice(0, 1).map(measurement => measurement.value)

    const metricNewMeasurements = {
        tubingPressure: tpData,
        casingPressure: cpData,
        oilTemp: otData,
        flareTemp: ftData,
        waterTemp: wtData,
        injValveOpen: injValveData,
    }
    const handleChange = (event) => {
        setMetric(event.target.value);
        dispatch({
            type: "SELECT_METRIC",
            payload: event.target.value
        })

    };
    /*const handleDelete = (event, value) => {
         console.log("clicked delete", value);
         setMetric((current) => _without(current, value));
         dispatch({
             type: "SELECT_METRIC",
             payload: _without(value)
         })
     };*/
    return (
        < div >
            <div style={{ display: "inline-block" }}>
                <InputLabel id="demo-mutiple-chip-checkbox-label">
                    <h4>Select--</h4>
                </InputLabel>
                <FormControl className={classes.formControl}>
                    <Select
                        labelId="demo-mutiple-chip-checkbox-label"
                        multiple
                        defaultValue="select"
                        value={metriic}
                        onChange={handleChange}
                        onOpen={() => console.log("select opened")}
                        renderValue={(selected) => (
                            <div className={classes.chips}>
                                {(selected).map((value) => (
                                    <Chip
                                        key={value}
                                        label={value}
                                        clickable
                                        deleteIcon={
                                            <CancelIcon
                                                onMouseDown={(event) => event.stopPropagation()}
                                            />
                                        }
                                        className={classes.chip}

                                        onClick={() => console.log(" ")}
                                    />
                                ))}
                            </div>
                        )}
                    >
                        {allMetrics.map((name) => (
                            <MenuItem key={name} value={name}>
                                <Checkbox checked={metriic.includes(name)} />
                                <ListItemText primary={name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <div className={classes.chips}>

                <Grid container justify="space-around" spacing={4}>
                    <Grid item xs={6}>
                        <Grid container direction="column" spacing={2}>
                            <Grid item>

                                <Typography component={'span'}>
                                    {metriic.map((value) => (

                                        <Chip

                                            key={value}
                                            defaultValue=""
                                            label={value !== "" ? value + "    " + metricNewMeasurements[value] : "Data"}
                                            className={classes.chip}
                                        />
                                    ))}

                                </Typography>

                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <div style={{ margin: '30px' }}>
                {selectedMetric.length !== 0 ? <Chart /> : ""}
            </div>
        </ div>



    );
}
