import React from 'react';
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import {Alert, Box, CircularProgress, Container, Divider, Typography} from "@mui/material";

import {useAppSelector} from "../store/hooks";
import {calculateChallengeData} from "../calculateProgression";
import {CenteredLoading} from "../components/CenteredLoading";
import {CenteredBox} from "../components/CenteredBox";
import {TARGET_WORKOUTS} from "../config";
import {formatNumber} from "../utilities";
import {ContainerWrapper} from "../components/ContainerWrapper";
import {format} from "date-fns";

TimeAgo.addDefaultLocale(en);

export const InfoContainer = () => {
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

  const data = calculateChallengeData(workouts);

  if (!data.hasStarted && !data.hasFinished) {
    return (
      <ContainerWrapper>
        <CenteredBox>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <>
              Challenge starts
              {" "}
              <ReactTimeAgo date={data.dateStart} />
              !
            </>
          </Typography>
        </CenteredBox>
      </ContainerWrapper>
    )
  }

  if (data.hasStarted && data.hasFinished) {
    return (
      <ContainerWrapper>
        <CenteredBox>
          {data.successful ? (
            <>
              <Typography
                variant="h6"
                component="h2"
                sx={{
                  color: '#388e3c',
                  mb: '2rem'
                }}
              >
                Challenge was successful!
              </Typography>
              <Typography paragraph={true}>
                {`${data.workouts} of ${TARGET_WORKOUTS} workouts recorded`}
              </Typography>
              <Typography paragraph={true}>
                No donation required
              </Typography>
            </>
          ) : (
            <>
              <Typography
                variant="h6"
                component="h2"
                sx={{
                  color: '#d32f2f',
                  mb: '2rem'
                }}
              >
                Challenge was <strong>not</strong> successful
              </Typography>
              <Typography paragraph={true}>
                {`${data.workouts} of ${TARGET_WORKOUTS} workouts recorded`}
              </Typography>
              <Typography paragraph={true}>
                {`${formatNumber(data.donationsRequired.toString())},- NOK donation required`}
              </Typography>
            </>
          )}
        </CenteredBox>
      </ContainerWrapper>
    )
  }

  return (
    <ContainerWrapper>
      <CenteredBox minHeight="calc(50vh - 3rem)">
        {data.onSchedule ? (
          <>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                color: '#388e3c',
                mb: '2rem'
              }}
            >
              You are on schedule!
            </Typography>
          </>
        ) : (
          <>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                color: '#d32f2f',
                mb: '2rem'
              }}
            >
              You are <strong>behind</strong>!
            </Typography>
          </>
          )}
        <Typography paragraph={true}>
          {`${data.workouts} of ${TARGET_WORKOUTS} workouts recorded`}
        </Typography>
        <Typography paragraph={true}>
          {`Days elapsed: ${data.daysInChallenge}`}
        </Typography>
        <Typography paragraph={true}>
          {`Days remaining: ${data.daysInChallengeRemaining}`}
        </Typography>
      </CenteredBox>
      <Divider sx={{mb: '1rem'}}/>
      <Box>
        {workouts.map(workout => (
          <Box
            key={workout.id}
          >
            <Typography paragraph={true}>
              <>
                {format(workout.added, 'eee, MMMM d HH:mm, yyyy')}
                {" ("}
                <ReactTimeAgo date={workout.added}/>
                {")"}
              </>
            </Typography>
            {workout.comment && (
              <Typography paragraph={true}>
                <>
                  <strong>Comment</strong>
                  {": "}
                  {workout.comment}
                </>
              </Typography>
            )}
            <Divider sx={{mb: '1rem'}}/>
          </Box>
        ))}
      </Box>
    </ContainerWrapper>
  )
}
