import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Field from "../../components/Field";
import { PropsField } from "../../components/Field";
import BasicSelect, { MenuItem } from "../../components/Select";
import { SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import CheckboxesTags, { Tag } from "../../components/Checkboxes";
import Button from "@mui/material/Button";
import useTaskStore from "../../store/useTaskStore";
import { ITask } from "../../interfaces";
import _ from "lodash";
import useAppStore from "../../store/useAppStore";

// interface FormData {
//   title: string;
//   description: string;
//   state: string;
//   tags: Tag[];
// }

interface Props {
  sizeInput?: number;
  taskDefault?: ITask | null;
}

export default function TaskCreate({ sizeInput, taskDefault }: Props) {
  const [formData, setFormData] = useState<ITask>({
    _id: "",
    title: "",
    description: "",
    status: "IN_PROGRESS",
    tags: [],
  });

  const [disabled, setDisabled] = useState<boolean>(false);

  const { saveTaskWebsocket, cleanTask } = useTaskStore();

  const { setOpenModal } = useAppStore();

  //se maneja la informacion de la tarea que selecciona para editar que viene de base de datos
  useEffect(() => {
    if (!taskDefault) return;
    console.log("default", taskDefault);
    const tags = taskDefault.tags;

    //se sanitiza la data para que pueda ser leoida por el campo  de tags
    const _tags = _.map(tags, (tag) => ({
      id: tag,
      label: tag,
    }));

    //se gurada toda la data para mostrar cuando se va a editar
    setFormData({
      ...taskDefault,
      tags: _tags,
    });
  }, [taskDefault]);

  //limpia la data de los campos al cerrar el modal
  useEffect(() => {
    return () => {
      cleanTask();
    };
  }, []);

  //contra la desactivacion del boton
  useEffect(() => {
    setDisabled(allValues);
  }, [formData]);

  //manejo de el campo title
  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name);
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //nmanejo de la campo descripcion
  const handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name);
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //manejo del  campo status
  const handleChangeStatus = (e: SelectChangeEvent) => {
    console.log(e.target);
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // manejo de los tags
  const handleChangeTags = (e: React.ChangeEvent<{}>, newValue: any) => {
    console.log(e);
    setFormData(
      (prev): ITask => ({
        ...prev,
        tags: newValue,
      })
    );
  };

  /**guardado de las tareas */
  const handleSaveTask = async () => {
    setOpenModal(false);
    const newTags = _.map(formData.tags, "id");
    const dataFormated = {
      ...formData,
      tags: newTags,
    };
    await saveTaskWebsocket(dataFormated);
  };

  //se valida que todos los campos tenga valor antes de guardar
  const allValues = Object.entries(formData)
    .filter(([key]) => key !== "_id")
    .every(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && value !== ""; // Validar otros valores
    });

  const fieldprops: PropsField[] = [
    {
      id: "title",
      name: "title",
      label: "Titulo",
      handleChange: (e) => handleChangeTitle(e),
      value: formData.title,
      size: sizeInput,
    },

    {
      id: "description",
      name: "description",
      label: "Descripción",
      handleChange: (e) => handleChangeDescription(e),
      value: formData.description,
      size: sizeInput,
      multiline: true,
    },
  ];

  const menuItems: MenuItem[] = [
    {
      value: "Pendiente",
      name: "Pendiente",
    },
    {
      value: "En progreso",
      name: "En progreso",
    },
    {
      value: "Completado",
      name: "Completado",
    },
  ];

  return (
    <Box sx={{ width: "100%", overflowY: "auto", maxHeight: "40%" }}>
      <Grid
        container
        spacing={4}
        columnSpacing={{ xs: 1, sm: 3, md: 5 }}
        direction="column"
        sx={{
          justifyContent: "center",
          alignItems: "center",
          overFlow: "auto",
          maxHeight: "400px",
        }}
      >
        {fieldprops.map((prop) => (
          <Field
            id={prop.id}
            name={prop.name}
            label={prop.label}
            handleChange={prop.handleChange}
            value={prop.value}
            size={prop.size}
            multiline={prop.multiline}
          />
        ))}

        <BasicSelect
          name="status"
          label="Estado"
          menuItem={menuItems}
          handleChange={handleChangeStatus}
          value={formData.status}
          size={sizeInput}
        />

        <CheckboxesTags handleChange={handleChangeTags} value={formData.tags} />
      </Grid>
      <Grid container mt={2} flexDirection={"row-reverse"}>
        <Button
          disabled={!disabled}
          variant="contained"
          onClick={handleSaveTask}
        >
          Guardar
        </Button>
      </Grid>
    </Box>
  );
}
