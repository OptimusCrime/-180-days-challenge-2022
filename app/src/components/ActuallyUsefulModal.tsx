import {Box, Dialog, DialogTitle, ModalUnstyled, styled} from "@mui/material";
import React from "react";

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled('div')`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  p: 2,
  px: 4,
  pb: 3,
};

export const ActuallyUsefulModal = ({ onClose, title, children }: { onClose: () => void, title: string; children: React.ReactElement | React.ReactElement[]}) => {
  return (
    <div
    >
      <Dialog
        open={true}
        onClose={onClose}
        PaperProps={{ sx: { width: "50%" } }}
      >
        <DialogTitle>{title}</DialogTitle>
        {children}
      </Dialog>
    </div>
  );
};
