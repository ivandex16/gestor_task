import Grid from "@mui/material/Grid2";
import Table from "../../components/Table";
import useTaskStore from "../../store/useTaskStore";
import { useCallback, useEffect, useState } from "react";
import ActionsButton from "../../components/ActionsButton";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { debounce } from "lodash";
import TransitionsModal from "../../components/Modal";
import TaskCreate from "../task/TaskCreate";
import useAppStore from "../../store/useAppStore";
import { ITask } from "../../interfaces";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chip from "@mui/material/Chip";
import { Box } from "@mui/material";
import SearchInput from "../../components/Search";

interface ColumnsPropiedades {
  field: string;
  headerName: string;
  width?: number;
  flex?: number;
  sortable?: boolean;
  editable?: boolean;
  hide?: boolean;
  renderCell?: (parmas: any) => void;
}

const Home = () => {
  const [defaulTask, setDefaultTask] = useState<ITask | null>(null);
  const [filter, setFilter] = useState<string>("");

  const {
    tasks,
    // error,
    // loading,
    // getTask,
    // getTaskWebSocket,
    disconnectWebSocket,
    connectWebSocket,
    getTaskById,
    myTask,
    deleteTask,
    msj,
    filterTaskwbSocket,
    setError,
    setMensaje,
  } = useTaskStore();

  const { setOpenModal, openModal } = useAppStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completado":
        return "success";
      case "Pendiente":
        return "warning";
      case "En progreso":
        return "info";
      case "Urgente":
        return "error";
      default:
        return "default";
    }
  };
  //conexion websocket
  useEffect(() => {
    connectWebSocket();
    return () => {
      disconnectWebSocket();
    };
  }, []);

  //notificaciones
  useEffect(() => {
    if (msj) {
      toast.success(msj, { className: "custom-toast" });
    }
    setMensaje(null);
  }, [msj]);

  //tarea seleccionada para editar
  useEffect(() => {
    setDefaultTask(myTask);
  }, [myTask]);

  

  const handleDelete = async (params: GridRenderCellParams) => {
    const id = params.row._id;
    deleteTask(id);
  };

  const handleEdit = async (params: GridRenderCellParams) => {
    console.log(params);
    if (params.row._id) getTaskById(params.row._id);
    setOpenModal(true);
  };

  const handleSearch = (value: string) => {
    filterTaskwbSocket(value);
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 300), []);

  const handleChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilter(value);
    debouncedHandleSearch(value);
  };

  const columns: ColumnsPropiedades[] = [
    {
      field: "_id",
      headerName: "Id",
      hide: true,
    },
    {
      field: "title",
      headerName: "Titulo",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Descripcion",
      flex: 3,
    },

    {
      field: "status",
      headerName: "Estado",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value as string)}
        />
      ),
    },

    {
      field: "tags",
      headerName: "Tags",
      flex: 2,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {params.value.map((tag: string) => (
            <Chip key={tag} label={tag} />
          ))}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <ActionsButton
            params={params}
            ruta={`/task/${params.row._id}`}
            handleFunctions={{
              handleDelete: (params) => handleDelete(params),
              handleEdit: (params) => handleEdit(params),
            }}
          />
        </>
      ),
    },
  ];
  const titleModal = myTask?._id !== "" ? "Editar Tarea" : "Agregar Tarea";
  return (
    <Grid container direction="column" spacing={1}>
      <Grid
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <TransitionsModal title={titleModal} open={openModal}>
          <TaskCreate taskDefault={myTask} />
        </TransitionsModal>
        <ToastContainer />
        <SearchInput handleChange={handleChangeFilter} value={filter} />
      </Grid>
      <Table columns={columns} rows={tasks} />
    </Grid>
  );
};

export default Home;
