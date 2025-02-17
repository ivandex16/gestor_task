import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import SearchIcon from "@mui/icons-material/Search";

interface ISearchComponent {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

export default function SearchInput({ handleChange, value }: ISearchComponent) {
  return (
    <Box sx={{ "& > :not(style)": { m: 1 } }}>
      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
        <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <TextField
          id="input-with-sx"
          label="Buscar"
          variant="standard"
          onChange={handleChange}
          value={value}
        />
      </Box>
    </Box>
  );
}
