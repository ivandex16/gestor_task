import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";

export interface PropsField {
  name: string;
  label: string;
  id: string;
  value: string;
  size?: number;
  multiline?: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const Field = ({
  name,
  label,
  id,
  value,
  handleChange,
  multiline = false,
  size = 10,
}: PropsField) => {
  return (
    <Grid size={size}>
      <TextField
        id={id}
        name={name}
        label={label}
        value={value}
        variant="filled"
        onChange={handleChange}
        multiline={multiline}
        fullWidth
      />
    </Grid>
  );
};

export default Field;
