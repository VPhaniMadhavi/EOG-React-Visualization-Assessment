import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Provider, createClient, useQuery } from "urql";
import { makeStyles } from "@material-ui/core/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,

  Legend
} from "recharts";

import { Tooltip } from "@material-ui/core";
const client = createClient({
  url: "https://react.eogresources.com/graphql"
});
/*const measurementQuery = `
query($input: MeasurementQuery) {
  getMeasurements(input: $input) {
    metric,
    at,
    value,
    unit
  }                                                                                       
}
`;*/

const query_multiple_measurements = `
query($input: [MeasurementQuery] )
{
  getMultipleMeasurements(input: $input) {
    metric
    measurements {
     at
     value
     metric
     unit
    }
  }
}`;


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


var moment = require("moment");
function formatXAxis(tickItem) {
  tickItem = moment(parseInt(tickItem)).format("LT");
  return tickItem;
}


export default () => {
  return (
    <Provider value={client}>
      <Chart />
    </Provider>
  );
};

const measurementDataToChartFormat = (selectedMetric, getMultipleMeasurements) => {
  let data_chart_format = [];
  if (getMultipleMeasurements.getMultipleMeasurements !== undefined) {
    var data = getMultipleMeasurements.getMultipleMeasurements;
    var mlength = 0;
    Object.values(data).map((ob) => mlength = ob["measurements"].length);

    for (let index = 0; index < mlength; index++) {
      let obj = {};
      for (let j = 0; j < data.length; j++) {
        obj[data[j].measurements[index].metric] =
          data[j].measurements[index].value;
        obj["at"] = data[j].measurements[index].at;
      }
      data_chart_format.push(obj);
    }

    return data_chart_format;
  }
}




const Chart = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const heartBeat = useSelector(state => state.heartBeat);
  const selectedMetric = useSelector(state => state.selectedMetrics.selectedMetric);
  const [state, setState] = React.useState({
    tooltip: [],
  });

  let variables = [];
  if (selectedMetric != null) {

    for (let i = 0; i < selectedMetric.length; i++) {
      if (selectedMetric[i] !== "") {
        variables.push({ "metricName": selectedMetric[i], "after": heartBeat.after - 1800000 })
      }
    }
  } else {

  }
  let [result] = useQuery({
    query: query_multiple_measurements,
    variables: {
      input:
        variables
    }
  }
  );
  const { data, error, fetching } = result;
  useEffect(() => {
    if (!data) {
      return;
    }
    if (fetching) {
      return;
    }
    if (!data) {
      return;
    } else {
      let getMultipleMeasurements = [];
      getMultipleMeasurements = data;
      //console.log("Mult", getMultipleMeasurements);

      dispatch({
        type: "GET_MULTI_MEASUREMENTS",
        payload: getMultipleMeasurements
      });

    }

  }, [dispatch, data, error, fetching]);

  const multi_measurements = useSelector(state => state.getMultipleMeasurements);
  var data_list = [];
  data_list = measurementDataToChartFormat(data_list, multi_measurements);

  const metricColors = {
    tubingPressure: 'green',
    casingPressure: 'blue',
    oilTemp: 'purple',
    flareTemp: 'red',
    waterTemp: 'teal',
    injValveOpen: 'orange',
  }

  const displayTooltip = name => e => {
    setState({ ...state, [name]: e });
  };
  const hideTooltip = name => e => {
    setState({ ...state, [name]: [] })
  }

  return (
    <div className={classes.root}>
      {data_list !== undefined ?
        <ResponsiveContainer width="95%" height={400}>
          <LineChart
            width={500}
            height={300}
            data={data_list}
            onMouseMove={displayTooltip("tooltip")}
            onMouseLeave={hideTooltip("tooltip")}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="at"
              allowDataOverflow={true}
              tickFormatter={formatXAxis}

            />
            <YAxis
              domain={["auto", "auto"]}
              scale="linear"
              padding={{ top: 10, bottom: 50 }}
              tickCount={10}

            />
            <Tooltip />

            <Legend />

            {selectedMetric
              ? selectedMetric.map(a => {
                return (
                  <Line
                    type="monotone"
                    key={`${a}`}
                    dataKey={`${a}`}
                    strokeOpacity="3"
                    stroke={metricColors[a]}
                    activeDot={{ r: 8 }}
                    isAnimationActive={false}
                    dot={false}
                  />
                );
              })
              : null}
          </LineChart>


        </ResponsiveContainer>
        : null}
    </div>);
}

