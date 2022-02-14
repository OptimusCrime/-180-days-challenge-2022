import React from 'react';
import {Alert, Box} from "@mui/material";
import * as Highcharts from 'highcharts';
import {addDays, addHours, format} from "date-fns";
import differenceInDays from 'date-fns/differenceInDays';
import HighchartsReact from "highcharts-react-official";

import {useAppSelector} from "../store/hooks";
import {CenteredLoading} from "../components/CenteredLoading";
import {ContainerWrapper} from "../components/ContainerWrapper";
import {CHALLENGE_DATE_END, CHALLENGE_DATE_START, TARGET_WORKOUTS} from "../config";
import {Entry} from "../types";
import {calculateTotalDays, parseDate} from "../utilities";
import {calculateChallengeData} from "../calculateProgression";

// Some rehashed code from the original challenge. I have no idea what is going on here...
const createXAxisValues = (params: {
  startDate: Date,
  numberOfDays: number
}): number[] => {
  const { startDate, numberOfDays } = params;

   return new Array(numberOfDays)
    .fill(0)
    .map((_, index) => addHours(addDays(startDate, index), 3).getTime());
};

const parseProgressDataSet = (params: {
  workouts: Entry[],
  startDate: Date,
  xAxisValues: number[]
}): number[][] => {
  const { workouts, startDate, xAxisValues } = params;
  const entriesDays = workouts.map(entry => differenceInDays(entry.added, startDate)).reverse();

  return new Array(xAxisValues.length)
    .fill(0)
    .map((_, index) => {
      return [
        xAxisValues[index],
        entriesDays.filter(entry => entry <= index).length
      ]
    });
}

const parseGrowthDataSet = (params: {
  numberOfDays: number,
  targetWorkouts: number,
  xAxisValues: number[],
}): number[][] => {
  const { numberOfDays, targetWorkouts, xAxisValues } = params;

  return new Array(xAxisValues.length)
    .fill(0)
    .map((_, index) => {
      return [
        xAxisValues[index],
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

  const xAxisValues = createXAxisValues({
    startDate: parsedDateStart,
    numberOfDays,
  })

  const progressDataSet = parseProgressDataSet({
    workouts: workouts,
    startDate: parsedDateStart,
    xAxisValues,
  });

  const growthDataSet = parseGrowthDataSet({
    numberOfDays,
    targetWorkouts: TARGET_WORKOUTS,
    xAxisValues,
  });

  const data = calculateChallengeData(workouts);

  // Jikes
  const verticalPlotColor = (data.hasStarted && !data.hasFinished) ? (data.onSchedule ? '#5e5' : '#e55') : '#000';

  const config = {
    chart: {
      type: 'area',
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
    tooltip: {
      formatter: function () {
        let output = '';

        let target = 0;
        let progress = 0;

        // @ts-ignore
        this.points.forEach(point => {
          output += `<br/>${point.series.name}: ${point.y}`;

          if (point.series.name === "Target") {
            target = point.y;
          }
          if (point.series.name === "Progress") {
            progress = point.y;
          }
        });

        const difference = `<br /><br />${target > progress ? 'Behind' : 'Ahead'}: ${Math.abs(target-progress)}`;

        // @ts-ignore
        return `<b>${format(this.x, 'MMM d')}</b><br />${output}${difference}`;
      },
      shared: true,
      followCursor: true,
      followTouchMove: true,
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
      plotLines: [{
        color: verticalPlotColor,
        width: 2,
        value: Date.now(),
        zIndex: 9999,
      }],
      crosshair: {
        enabled: true,
        zIndex: 99999,
        width: 2,
      }
    },
    series: [{
      name: "Progress",
      showInLegend: false,
      type: 'line',
      color: '#555',
      data: progressDataSet,
    }, {
      name: "Target",
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
      <div style={{ userSelect: 'none'}}>
        <HighchartsReact
          highcharts={Highcharts}
          options={config}
        />
      </div>
    </ContainerWrapper>
  );
}
