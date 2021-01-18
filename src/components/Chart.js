import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Provider, createClient, useQuery } from "urql";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label
} from "recharts";
const client = createClient({
  url: "https://react.eogresources.com/graphql"
});
const measurementQuery = `
query($input: MeasurementQuery) {
  getMeasurements(input: $input) {
    metric,
    at,
    value,
    unit
  }                                                                                       
}
`;



const useStyles = makeStyles({
  chartBox: {
    padding: "5px 0"
  },
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});
const getLabel = metricName => {
  switch (metricName) {
    case "tubingPressure":
    case "casingPressure":
      return "PSI";
    case "oilTemp":
    case "flareTemp":
    case "waterTemp":
      return "F";
    case "injValveOpen":
      return "%";
    default:
      return;
  }
};

export default () => {
  return (
    <Provider value={client}>
      <Chart />
    </Provider>
  );
};

const Chart = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const heartBeat = useSelector(state => state.heartBeat);
  const selectedMetric = useSelector(state => state.selectedMetrics.selectedMetric);
  const measurements = useSelector(state => state.measurements);
  const [measurementRes] = useQuery({
    query: measurementQuery,
    variables: {
      input: {
        metricName: selectedMetric,
        before: heartBeat,
        after: heartBeat.after - 1800000
      }
    }
  });


  const { fetching, data, error } = measurementRes;
  useEffect(() => {
    if (error) {
      console.log(error.message);
      return;
    }
    if (!data) {
      return;
    } else {
      console.log("mesasurement", data);
      console.log("heartbeat", heartBeat);
      const { getMeasurements } = data;
      dispatch({
        type: "GET_MEASUREMENTS",
        payload: getMeasurements
      });
    }
  });

  if (fetching) return <LinearProgress />;
  const metricColors = {
    tubingPressure: 'green',
    casingPressure: 'blue',
    oilTemp: 'purple',
    flareTemp: 'red',
    waterTemp: 'teal',
    injValveOpen: 'black',
  }
  const label = getLabel(selectedMetric);
  return (
    <div className={classes.root}>

      <ResponsiveContainer width="100%" minWidth={400} aspect={25.0 / 9.0}>
        <LineChart
          height={300}
          data={measurements}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis domain={["auto", "auto"]} />
          <YAxis domain={["auto", "dataMax + 1"]}>
            <Label value={label} position='insideLeft' offset='-2' />
          </YAxis>
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={metricColors[selectedMetric]}
            activeDot={{ r: 6 }}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>


  );
};
