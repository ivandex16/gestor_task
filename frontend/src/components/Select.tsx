import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Grid from "@mui/material/Grid2";

export interface MenuItem {
  value: string;
  name: string;
}

export interface SelectProps {
  menuItem: MenuItem[];
  label: string;
  value: string;
  name: string;
  size?: number;
  handleChange: (event: SelectChangeEvent<string>) => void;
}

export default function BasicSelect({
  label,
  value,
  menuItem,
  name,
  handleChange,
  size = 10,
}: SelectProps) {
  //   const [value, setValue] = React.useState('');

  //   const handleChange = (event: SelectChangeEvent) => {
  //     setAge(event.target.value as string);
  //   };

  return (
    <Grid size={size}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={label}
          onChange={handleChange}
          name={name}
        >
          {menuItem.map((m) => (
            <MenuItem value={m.value}>{m.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
}
