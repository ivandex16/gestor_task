import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Grid from "@mui/material/Grid2";

interface PropsChekboxTag {
  value: any[];
  name?: string;
  handleChange: (event: React.ChangeEvent<{}>, newValue: string[]) => void;
}

export interface Tag {
  [x: string]: any;
  id: string;
  label?: string;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CheckboxesTags({
  value,
  handleChange,
  name,
}: PropsChekboxTag) {
  // const [selectedTags, setSelectedTags] = React.useState<Tag[]>([]);
  return (
    <Grid size={10}>
      <Autocomplete
        multiple
        id="checkboxes-tags-demo"
        options={taskTags}
        disableCloseOnSelect
        getOptionLabel={(option) => option.id}
        value={value}
        onChange={handleChange}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          const isChecked = value.some((val) => val.id === option.id);
          return (
            <li key={key} {...optionProps}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={isChecked}
                name={name}
              />
              {option.id}
            </li>
          );
        }}
        style={{ width: "100%" }}
        renderInput={(params) => (
          <TextField {...params} label="Checkboxes" placeholder="Favorites" />
        )}
      />
    </Grid>
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top

const taskTags: any[] = [
  { id: "Urgente", label: "Urgente" },
  { id: "Importante", label: "Importante" },
  { id: "Pendiente", label: "Pendiente" },
  { id: "En progreso", label: "En progreso" },
  { id: "Completado", label: "Completado" },
  { id: "Trabajo", label: "Trabajo" },
  { id: "Personal", label: "Personal" },
  { id: "Reunión", label: "Reunión" },
  { id: "Proyecto", label: "Proyecto" },
  { id: "Estudio", label: "Estudio" },
  { id: "Hogar", label: "Hogar" },
  { id: "Salud", label: "Salud" },
  { id: "Finanzas", label: "Finanzas" },
  { id: "Revisión", label: "Revisión" },
  { id: "Colaboración", label: "Colaboración" },
];
