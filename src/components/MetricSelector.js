
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Select, MenuItem, FormControl, InputLabel } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import Chart from './Chart';
const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,

    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));
const metricArray = [
    {
        value: "tubingPressure",
        label: "Tubing Pressure",
    },
    {
        value: "casingPressure",
        label: "Casing Pressure"
    },
    {
        value: "oilTemp",
        label: "Oil Temp"
    },
    {
        value: "flareTemp",
        label: "Flare Temp"
    },
    {
        value: "waterTemp",
        label: "Water Temp"
    },
    {
        value: "injValveOpen",
        label: "Inj Valve Open"
    }
];
function MetricSelector() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const selectedMetric = useSelector(state => state.selectedMetrics.selectedMetric);
    return (
        < div >
            <FormControl variant="filled" className={classes.formControl}>
                {console.log({ selectedMetric })}
                <InputLabel id="demo-simple-select-filled-label">--Select Metrics--</InputLabel>
                <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    name="oilTemp"
                    onChange={(event) =>
                        dispatch({
                            type: "SELECT_METRIC",
                            payload: event.target.value
                        })
                    }
                >
                    {
                        metricArray.map((val, index) =>
                            <MenuItem value={val.value}>{val.label}</MenuItem>)
                    }
                </Select>
            </FormControl>
            {selectedMetric !== '' ? <Chart /> : ""}
        </div >
    );
}
export default MetricSelector;