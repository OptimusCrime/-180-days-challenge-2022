import React, {useState} from 'react';
import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

import nbLocale from 'date-fns/locale/nb';
import {format} from "date-fns";

import {
  toggleShowEntryModal
} from "../store/reducers/globalReducer";
import {useAppDispatch} from "../store/hooks";
import {ActuallyUsefulModal} from "../components/ActuallyUsefulModal";
import {httpOk, withAuth} from "../api";
import {getEntries} from "../actions";

export const EntryModalContainer = () => {
  const dispatch = useAppDispatch();

  const [comment, setComment] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addEntry = async (currentComment: string, currentDate: Date, callback: () => void) => {
    try {
      const response =
        await httpOk(
          '/entries',
          await withAuth({
            method: "POST",
            body: JSON.stringify({
              comment: currentComment.length > 0 ? currentComment : null,
              date: format(currentDate, 'yyyy-LL-dd'),
            }),
          })
        );

      if (response) {
        callback();
      }
      else {
        setError(true);
        setIsLoading(false);
      }
    } catch (ex) {
      setError(true);
      setIsLoading(false);
    }
  }

  return (
    <ActuallyUsefulModal
      onClose={() => dispatch(toggleShowEntryModal())}
      title="Add entry"
    >
      <DialogContent>
        <TextField
          autoFocus
          label="Comment"
          margin="dense"
          variant="standard"
          type="text"
          fullWidth
          onChange={e => setComment(e.target.value)}
        />
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          locale={nbLocale}
        >
          <DatePicker
            label="Date"
            value={date}
            onChange={(newValue) => {
              if (newValue !== null) {
                setDate(newValue);
              }
            }}
            views={["day"]}
            mask="__.__.____"
            renderInput={(params) =>
              <TextField
                margin="dense"
                sx={{
                  mt: '1rem'
                }}
                variant="standard"
                type="text"
                fullWidth
                {...params}
              />
            }
          />
        </LocalizationProvider>
        {error && (
          <Alert
            severity="warning"
            sx={{
              mt: '1rem'
            }}
          >
            Failed to add entry
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        {!isLoading && (
          <Button
            onClick={() => dispatch(toggleShowEntryModal())}
          >
            Close
          </Button>
        )}
        <Button
          onClick={() => {
            setIsLoading(true);

            addEntry(comment, date, () => {
              getEntries(dispatch);
              dispatch(toggleShowEntryModal())
              setIsLoading(false);
            });
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Please wait' : 'Add'}
        </Button>
      </DialogActions>
    </ActuallyUsefulModal>
  );
};
