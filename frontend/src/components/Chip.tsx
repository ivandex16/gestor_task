import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import DoneIcon from "@mui/icons-material/Done";
import AddIcon from "@mui/icons-material/Add";

interface PropsType {
  handleClick: () => void;
}

export default function ChipCoponent({ handleClick }: PropsType) {
  //   const handleClick = () => {
  //     console.info("You clicked the Chip.");
  //   };

  const handleDelete = () => {
    console.info("You clicked the delete icon.");
  };

  return (
    <Stack direction="row" spacing={1}>
      <Chip
        label="Agregar"
        onClick={handleClick}
        onDelete={handleClick}
        deleteIcon={<AddIcon />}
        color="primary"
      />
    </Stack>
  );
}
