import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
//import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ChipCoponent from "./Chip";
import useAppStore from "../store/useAppStore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "61%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  color: "#000",
  borderRadius: "15px",
  overflowY: "auto", // Agrega scroll vertical
  maxHeight: "80vh", // Ajusta la altura máxima
};

interface PropModal {
  children: React.ReactNode;
  title: string;
  open: boolean;
}

export default function TransitionsModal({ children, title, open }: PropModal) {
  const { openModal, setOpenModal } = useAppStore();

  //const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  return (
    <div>
      <ChipCoponent handleClick={handleOpen} />
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              textAlign={"center"}
            >
              {title}
            </Typography>

            <div style={{ overflowY: "auto", maxHeight: "60vh" }}>
              {children}
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
