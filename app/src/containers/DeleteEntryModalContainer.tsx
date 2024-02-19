import React, {useState} from 'react';
import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";

import {
  toggleShowDeleteModal,
} from "../store/reducers/globalReducer";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {ActuallyUsefulModal} from "../components/ActuallyUsefulModal";
import {httpOk, withAuth} from "../api";
import {getEntries} from "../actions";

export const DeleteEntryModalContainer = () => {
  const { deleteId } = useAppSelector(state => state.global);
  const dispatch = useAppDispatch();

  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deleteEntry = async (callback: () => void) => {
    try {
      const response =
        await httpOk(
          `/entry/${deleteId as number}`,
          await withAuth({
            method: "DELETE",
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
      onClose={() => dispatch(toggleShowDeleteModal(null))}
      title="Delete entry"
    >
      <DialogContent>
        <Typography>
          Are you sure?
        </Typography>
        {error && (
          <Alert
            severity="warning"
            sx={{
              mt: '1rem'
            }}
          >
            Failed to delete entry
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        {!isLoading && (
          <Button
            onClick={() => dispatch(toggleShowDeleteModal(null))}
          >
            Close
          </Button>
        )}
        <Button
          onClick={() => {
            setIsLoading(true);

            deleteEntry(() => {
              getEntries(dispatch);
              dispatch(toggleShowDeleteModal(null))
              setIsLoading(false);
            });
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Please wait' : 'Delete'}
        </Button>
      </DialogActions>
    </ActuallyUsefulModal>
  );
};
