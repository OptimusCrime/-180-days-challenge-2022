import React from 'react';
import {Alert, Box} from "@mui/material";
import * as Highcharts from 'highcharts';
import {addDays} from "date-fns";
import differenceInDays from 'date-fns/differenceInDays';
import HighchartsReact from "highcharts-react-official";

import {useAppSelector} from "../store/hooks";
import {CenteredLoading} from "../components/CenteredLoading";
import {ContainerWrapper} from "../components/ContainerWrapper";
import {CHALLENGE_DATE_END, CHALLENGE_DATE_START, TARGET_WORKOUTS} from "../config";
import {Entry} from "../types";
import {calculateTotalDays, parseDate} from "../utilities";

// Some rehashed code from the original challenge. I have no idea what is going on here...
const parseProgressDataSet = (params: {
  workouts: Entry[],
  startDate: Date,
  numberOfDays: number
}): number[][] => {
  const { workouts, startDate, numberOfDays } = params;
  const entriesDays = workouts.map(entry => differenceInDays(entry.added, startDate)).reverse();

  return new Array(numberOfDays)
    .fill(0)
    .map((_, index) => {
      return [
        addDays(startDate, index).getTime(),
        entriesDays.filter(entry => entry <= index).length
      ]
    });
}

const parseGrowthDataSet = (params: {
  startDate: Date,
  numberOfDays: number,
  targetWorkouts: number
}): number[][] => {
  const { startDate, numberOfDays, targetWorkouts } = params;

  return new Array(numberOfDays)
    .fill(0)
    .map((_, index) => {
      return [
        addDays(startDate, index).getTime(),
        Math.ceil((targetWorkouts / numberOfDays) * index)
      ];
    });
}

const parseArea = (params: {
  above: number[][],
  below: number[][]}
): number[][] => {
  const { above, below } = params;

  return new Array(above.length)
    .fill(0)
    .map((_, index) => {
      return [
        below[index][0],
        (above[index][1] > below[index][1] ? above[index][1] - below[index][1] : 0)
      ];
    });
}

const parseTransparent = (params: {
  first: number[][],
  second: number[][]
}): number[][] => {
  const { first, second } = params;

  return new Array(first.length)
    .fill(0)
    .map((_, index) => {
      return [
        first[index][0],
        (first[index][1] <= second[index][1] ? first[index][1] : second[index][1])
      ]
    });
}

export const GraphContainer = () => {
  const { loading, error, workouts } = useAppSelector(state => state.workouts);

  if (loading) {
    return (
      <ContainerWrapper>
        <CenteredLoading />
      </ContainerWrapper>
    )
  }

  if (error) {
    return (
      <ContainerWrapper>
        <Box>
          <Alert severity="warning">
            Failed to fetch entries.
          </Alert>
        </Box>
      </ContainerWrapper>
    );
  }

  const parsedDateStart = parseDate(CHALLENGE_DATE_START);

  const numberOfDays = calculateTotalDays({
    startDate: CHALLENGE_DATE_START,
    endDate: CHALLENGE_DATE_END
  });

  const progressDataSet = parseProgressDataSet({
    workouts: workouts,
    startDate: parsedDateStart,
    numberOfDays
  });

  const growthDataSet = parseGrowthDataSet({
    startDate: parsedDateStart,
    numberOfDays,
    targetWorkouts: TARGET_WORKOUTS
  });

  const config = {
    chart: {
      type: 'area',
    },
    time: {
      timezoneOffset: -60,
    },
    title: {
      text: ""
    },
    plotOptions: {
      area: {
        stacking: "normal",
        lineWidth: 0,
        shadow: false,
        marker: {
          enabled: false
        },
        enableMouseTracking: false,
        showInLegend: false
      },
      line: {
        zIndex: 5,
        marker: {
          enabled: false
        }
      }
    },
    yAxis: {
      title: {
        text: ""
      },
    },
    xAxis: {
      type: "datetime",
      labels: {
        format: "{value:%b %e}"
      },
    },
    series: [{
      showInLegend: false,
      type: 'line',
      color: '#555',
      data: progressDataSet,
    }, {
      showInLegend: false,
      type: 'line',
      color: '#55e',
      data: growthDataSet,
    }, {
      // Green section
      fillColor: '#5e5',
      data: parseArea({
        above: progressDataSet,
        below: growthDataSet
      })
    }, {
      // Red section
      fillColor: '#e55',
      data: parseArea({
        above: growthDataSet,
        below: progressDataSet
      })
    }, {
      // Weird transparency hack that removes excess green and red
      fillColor: 'rgba(255,255,255,0)',
      data: parseTransparent({
        first: progressDataSet,
        second: growthDataSet
      })
    }],
  };

  return (
    <ContainerWrapper>
      <HighchartsReact
        highcharts={Highcharts}
        options={config}
      />
    </ContainerWrapper>
  );
}
