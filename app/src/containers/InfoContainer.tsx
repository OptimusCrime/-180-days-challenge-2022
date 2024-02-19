import React, {useState} from 'react';
import ReactTimeAgo from "react-time-ago";
import {Alert, Box, Button, Divider, TextField, Typography} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import {format} from "date-fns";

import {useAppDispatch, useAppSelector} from "../store/hooks";
import {calculateChallengeData} from "../calculateProgression";
import {CenteredLoading} from "../components/CenteredLoading";
import {CenteredBox} from "../components/CenteredBox";
import {TARGET_WORKOUTS} from "../config";
import {formatNumber} from "../utilities";
import {ContainerWrapper} from "../components/ContainerWrapper";
import {getEntries} from "../actions";
import {toggleShowDeleteModal, toggleShowEntryModal} from "../store/reducers/globalReducer";
import {httpOk, withAuth} from "../api";
import {workoutsFetchStart} from "../store/reducers/workoutsReducer";

// This is pretty stupid, but here goes. Using `now={}` or `timeOffset={}` combined with a future Date in ReactTimeAgo
// causes an endless loop that completely crashes the application. To work around this problem, I match up the hours
// of the target Date with the current time. This should be the same as using the now or timeOffset attributes to offset
// the calculations.
const getDateAtMidnight = (date: Date) => {
  const currentDate = new Date();
  const midnightDate = new Date(date);
  midnightDate.setHours(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());
  return midnightDate.getTime();
}

interface EditState {
  id: number | null;
  comment: string;
  updateStarted: boolean;
  updateError: boolean;
}

const initialState: EditState = {
  id: null,
  comment: "",
  updateStarted: false,
  updateError: false,
}

export const InfoContainer = () => {
  const dispatch = useAppDispatch();
  const {loading, error, workouts} = useAppSelector(state => state.workouts);

  const [editState, setEditState] = useState<EditState>(initialState);

  const editEntry = async (id: number, currentComment: string, callback: () => void) => {
    try {
      const response =
        await httpOk(
          `/entry/${id}`,
          await withAuth({
            method: "PUT",
            body: JSON.stringify({
              comment: currentComment.length > 0 ? currentComment : null,
            }),
          })
        );

      if (response) {
        callback();
      }
      else {
        setEditState(prevState => ({
          ...prevState,
          updateStarted: false,
          updateError: true,
        }))
      }
    } catch (ex) {
      setEditState(prevState => ({
        ...prevState,
        updateStarted: false,
        updateError: true,
      }));
    }
  }


  if (loading) {
    return (
      <ContainerWrapper>
        <CenteredLoading/>
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
              <ReactTimeAgo
                date={getDateAtMidnight(data.dateStart)}
              />
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
                {`${formatNumber(data.donationsRequired)},- NOK donation required`}
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
          Number of workouts
          {' '}
          {`${data.onSchedule ? 'ahead' : 'behind'}`}
          {': '}
          {data.behindOrAhead}
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
          <>
          <Box
            key={workout.id}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography paragraph={true}>
                <>
                  {format(workout.added, 'eee, MMMM d @ HH:mm')}
                </>
              </Typography>
              {editState.id === workout.id ? (
                  <Box sx={{ pb: 2 }}>
                  <TextField
                    autoFocus
                    label="Comment"
                    margin="dense"
                    variant="standard"
                    type="text"
                    defaultValue={editState.comment}
                    fullWidth
                    onChange={e => setEditState(prevState => ({...prevState, comment: e.target.value}))}
                  />

                  <Button
                    sx={{ mt: 1 }}
                    onClick={() => {
                      setEditState(prevState => ({
                        ...prevState,
                        updateStarted: true,
                      }));

                      editEntry(editState.id as number, editState.comment, () => {
                        getEntries(dispatch);
                        setEditState({
                          id: null,
                          comment: "",
                          updateStarted: false,
                          updateError: false,
                        });
                      });
                    }}
                    disabled={editState.updateStarted}
                  >
                    {editState.updateStarted ? 'Please wait' : 'Update'}
                  </Button>

                    {editState.updateError && (
                      <Alert
                        severity="warning"
                        sx={{
                          mt: '1rem'
                        }}
                      >
                        Failed to update entry
                      </Alert>
                    )}
                  </Box>
                ) : (
                <Typography paragraph={true}>
                  <>
                    <strong>Comment</strong>
                    {": "}
                    {workout.comment ? workout.comment : <i>No comment</i>}
                  </>
                </Typography>
              )}
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
            }}>
              <Button
                sx={{m: 0, p: 0, display: 'block'}}
                onClick={() => setEditState({
                  id: workout.id,
                  comment: workout.comment ?? "",
                  updateStarted: false,
                  updateError: false,
                })}
              >
                <EditIcon/>
              </Button>

              <Button
                sx={{m: 0, p: 0, display: 'block'}}
                onClick={() => {
                  dispatch(toggleShowDeleteModal(workout.id))
                }}
              >
                <DeleteIcon/>
              </Button>
            </Box>
          </Box>
          <Divider sx={{mb: '1rem'}}/>
          </>
        ))}
      </Box>
    </ContainerWrapper>
  )
}
