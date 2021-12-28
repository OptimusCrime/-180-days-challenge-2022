import React, {useState} from 'react';
import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";
import {
  authenticationFailed,
  authenticationFinished,
  authenticationStarted,
  toggleShowAuthModal
} from "../store/reducers/globalReducer";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {ActuallyUsefulModal} from "../components/ActuallyUsefulModal";
import {http} from "../api";
import {setToken} from "../utilities/localStorage";
import {AuthApiResponse} from "../types";

export const AuthModalContainer = () => {
  const {authenticationStarted: started, authenticationFailed: failed } = useAppSelector(state => state.global);
  const dispatch = useAppDispatch();

  const [value, setValue] = useState("");

  const authenticate = async (password: string) => {
    dispatch(authenticationStarted());

    try {
      const response =
        await http<AuthApiResponse>('/auth', {
          method: "POST",
          body: JSON.stringify({
            pw: password,
          }),
        });

      setToken(response.token);
      dispatch(authenticationFinished());
    } catch (ex) {
      dispatch(authenticationFailed());
    }
  }

  return (
    <ActuallyUsefulModal
      onClose={() => dispatch(toggleShowAuthModal())}
      title="Log in"
    >
        <DialogContent>
          <TextField
            autoFocus
            label="Password"
            margin="dense"
            variant="standard"
            type="password"
            fullWidth
            onChange={e => setValue(e.target.value)}
            onKeyUp={e => {
              if (e.code.toLowerCase() === "enter") {
                authenticate(value);
              }
            }}
          />
          {failed && (
            <Alert
              severity="warning"
              sx={{
                mt: '1rem'
              }}
            >
              Failed to authenticate
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => dispatch(toggleShowAuthModal())}
            disabled={started}
          >
            Close
          </Button>
          <Button
            onClick={() => authenticate(value)}
            disabled={started}
          >
            Log in
          </Button>
        </DialogActions>
    </ActuallyUsefulModal>
  );
};
