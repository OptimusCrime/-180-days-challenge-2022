import React from 'react';
import {Alert, Box, Typography} from "@mui/material";

import {useAppSelector} from "../store/hooks";
import {CenteredLoading} from "../components/CenteredLoading";
import {ContainerWrapper} from "../components/ContainerWrapper";
import {calculateChallengeData} from "../calculateProgression";
import {CenteredBox} from "../components/CenteredBox";
import {DONATION_EACH, TARGET_WORKOUTS} from "../config";
import {formatNumber} from "../utilities";

export const DonationsContainer = () => {
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
            Challenge not yet started
          </Typography>
        </CenteredBox>
      </ContainerWrapper>
    );
  }

  if (data.hasStarted && data.hasFinished) {
    return (
      <ContainerWrapper>
        <CenteredBox>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {`Final donations: ${formatNumber(data.donationsRequired)} NOK`}
          </Typography>
        </CenteredBox>
      </ContainerWrapper>
    );
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
              You are on schedule, no donations (might) be required!
            </Typography>
            <Typography paragraph={true}>
              Good job!
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
              You are <strong>behind</strong>, donations (might) be required!
            </Typography>
            <Typography paragraph={true}>
              {`Current workouts: ${data.workouts}`}
            </Typography>
            <Typography paragraph={true}>
              {`Current target: ${data.targetWorkouts}`}
            </Typography>
            <Typography paragraph={true} sx={{ mb: 4 }}>
              {`Current behind: ${data.behindOrAhead}`}
            </Typography>
            <Typography paragraph={true}>
              {`Current donations at current pace: ${formatNumber(data.behindOrAhead * DONATION_EACH)} NOK`}
            </Typography>
            <Typography paragraph={true}>
              {`Donations at better pace: ${formatNumber(Math.round(data.behindOrAhead * 0.5) * DONATION_EACH)} NOK`}
            </Typography>
            <Typography paragraph={true}>
              {`Donations at worse pace: ${formatNumber(Math.round(data.behindOrAhead * 1.5) * DONATION_EACH)} NOK`}
            </Typography>
          </>
        )}
      </CenteredBox>
    </ContainerWrapper>
  );
}
