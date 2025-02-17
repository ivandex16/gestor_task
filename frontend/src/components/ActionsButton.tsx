import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import { GridRenderCellParams } from "@mui/x-data-grid";

interface Props {
  handleFunctions: {
    handleDelete: (params: GridRenderCellParams) => void;
    handleEdit: (params: GridRenderCellParams) => void;
  };
  params: GridRenderCellParams;
  ruta: string;
}

const ActionsButton = ({ handleFunctions, params, ruta }: Props) => {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
      <Tooltip title="Eliminar">
        <IconButton
          aria-label="delete"
          size="small"
          onClick={() => handleFunctions.handleDelete(params)}
        >
          <DeleteIcon fontSize="inherit" color="error" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Editar">
        <IconButton
          aria-label="edit"
          size="small"
          onClick={() => handleFunctions.handleEdit(params)}
        >
          <EditIcon fontSize="inherit" color="secondary" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default ActionsButton;
