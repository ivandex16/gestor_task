import { create } from "zustand";
import { ITask } from "../interfaces";
import { io, Socket } from "socket.io-client";
import { OptionalTask } from "../interfaces/task.interface";
import { omit } from "lodash";

interface TaskStates {
  tasks: ITask[] | [];
  loading: boolean;
  error: string | null;
  setError: (error: string) => void;
  msj: string | null;
  setMensaje: (msj: string | null) => void;
  socket: Socket | null;
  myTask: ITask | null;
  connectWebSocket: () => Promise<void>;
  //getTask: () => Promise<void>;
  getTaskWebSocket: () => Promise<void>;
  disconnectWebSocket: () => Promise<void>;
  saveTaskWebsocket: (args: ITask) => Promise<void>;
  getTaskById: (id: string) => Promise<void>;
  updateTaskWbSocket: (newValue: OptionalTask) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  cleanTask: () => void;
  filterTaskwbSocket: (params: string) => Promise<void>;
}

const useTaskStore = create<TaskStates>((set, get) => {
  // let socket: Socket | null = null;
  return {
    tasks: [],
    loading: false,
    error: null,
    setError: (error) => set({ error }),
    msj: null,
    setMensaje: (msj) => set({ msj }),
    socket: null,
    myTask: null,
    cleanTask: () => {
      set({
        myTask: {
          _id: "",
          title: "",
          description: "",
          status: "IN_PROGRESS",
          tags: [],
        },
      });
    },
    connectWebSocket: async () => {
      const { socket } = get();
      const token = localStorage.getItem("token");

      // Crear conexión solo si no existe
      if (!socket) {
        const newSocket = io("http://localhost:3002/tasks", {
          transports: ["websocket"],
          auth: { token },
          reconnection: true,
          reconnectionAttempts: 3,
          reconnectionDelay: 1000,
        });

        // Configurar listeners comunes
        newSocket.on("connect", () => {
          console.log("✅ WebSocket conectado");
          newSocket?.emit("findAllTask");

          set({ loading: false, error: null });
        });

        newSocket.on("taskListed", (tasks: ITask[]) => {
          console.log("taskkk", tasks);
          set({ tasks, loading: false, error: null });
        });

        newSocket.on("saludo", (message: string) => {
          console.log("saludo", message);
          let saludo = `Hola ${message}`;
          set({ msj: saludo, loading: false, error: null });
        });

        newSocket.on("errorFindAllTask", (err) => {
          console.error("❌ Error de conexión:", err.message);
          set({ error: err.message, loading: false });
        });

        newSocket.on("connect_error", (err) => {
          console.error("❌ Error de conexión:", err.message);
          set({ error: err.message, loading: false });
        });

        set({ socket: newSocket, loading: true });
      }
    },

    // getTask: async () => {
    //   set({ loading: true, error: null });

    //   const token = localStorage.getItem("token");
    //   try {
    //     const response = await fetch("http://localhost:3002/task", {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });

    //     if (!response.ok) {
    //       const errorData = await response.json();
    //       set({ error: errorData.message });
    //       throw new Error(errorData.message);
    //     }

    //     const data: ITask[] = await response.json();
    //     set({ tasks: data, loading: false, error: null });
    //   } catch (error: any) {
    //     set({ loading: false, error: error.message });
    //   }
    // },

    getTaskWebSocket: async () => {
      //   const token = localStorage.getItem("token");
      //   console.log(token);

      //   socket = io("http://localhost:3002", {
      //     transports: ["websocket"],
      //     auth: { token },
      //   });

      const { socket } = get();

      //   socket.on("connect", () => {
      //     console.log(" conectado al websocket");
      //     set({ loading: true, error: null });
      //     socket?.emit("findAllTask");
      //   });

      if (!socket) {
        throw new Error("WebSocket no conectado");
      }

      //   socket.on("taskListed", (tasks: ITask[]) => {
      //     // Cambiado a taskListed
      //     console.log("📥 Tareas recibidas:", tasks);
      //     set({ tasks, loading: false, error: null });
      //   });

      socket.on("connect_error", (err) => {
        console.error("❌ Error de conexión:", err.message);
        set({ error: err.message, loading: false });
        //disconnectWebSocket(); // Limpiar conexión
      });

      socket.on("disconnect", () => {
        console.log("❌ WebSocket desconectado");
        set({ loading: false });
      });
    },

    disconnectWebSocket: async () => {
      const { socket } = get();
      if (socket) {
        socket.off(); // Remover todos los listeners
        socket.disconnect();
        set({ socket: null });
        console.log("🚪 WebSocket desconectado");
      }
    },

    saveTaskWebsocket: async (taskData: ITask) => {
      const { socket, updateTaskWbSocket } = get();
      console.log("websocket", taskData);
      if (!socket) throw new Error("Primero debe conectar el websocket");

      //actualizamos si viene un id
      if (taskData._id !== "") {
        updateTaskWbSocket(taskData);
        return;
      }
      //eliminamos el id del cuerpo del objeto para evitar enviarlo al crear
      const dataSanatize = omit(taskData, "_id");
      return new Promise((resolve, reject) => {
        if (!socket) return reject("WebSocket no conectado");

        socket.emit(
          "createTask",
          dataSanatize,
          (response: {
            success: boolean;
            task?: ITask;
            error?: string;
            message?: string;
          }) => {
            console.log("📩 Respuesta del servidor:", response);
            if (response.success) {
              set({ msj: response.message, error: null });
              resolve();
            } else {
              set({ error: response.error || "Error desconocido" });
              reject(response.error);
            }
          }
        );

        socket.on("addTaskError", (err) => {
          console.error("❌ Error de conexión:", err.message);
          set({ error: err.message, loading: false });
        });
      });
    },

    getTaskById: (id: string | undefined) => {
      const { socket } = get();
      console.log(id);
      if (!socket) throw new Error("Primero debe conectar el websocket");

      set({ loading: true, error: null });

      return new Promise((resolve, reject) => {
        if (!socket) return reject("WebSocket no conectado");
        socket.once("oneTaskListed", (myTask: ITask) => {
          console.log("oneTaskListed:", myTask);
          set({ myTask, loading: false, error: null }); // Actualiza el estado con la tarea recibida
        });

        socket.emit(
          "findOneTask",
          { _id: id },
          (response: { success: boolean; task?: ITask; error?: string }) => {
            if (response.success) {
              console.log("tarea", response);
              set({ myTask: response.task });
              resolve();
            } else {
              set({ error: response.error || "Error desconocido" });
              reject(response.error);
            }
          }
        );

        socket.on("errorFindOneTask", (err) => {
          set({ error: err.message, loading: false });
        });
      });
    },

    updateTaskWbSocket: async (newValue: OptionalTask) => {
      const { socket } = get();

      const id = newValue._id;
      console.log("newValue", newValue);

      if (!socket) throw new Error("Primero debe conectar el websocket");

      return new Promise((resolve, reject) => {
        if (!socket) return reject("WebSocket no conectado");

        socket.once("taskUpdated", (response) => {
          console.log("taskUpdated:", response);
          set({
            myTask: response.task,
            loading: false,
            error: null,
            msj: response.message,
          }); // Actualiza el estado con la tarea recibida
        });

        socket.on("updatedTaskError", (err) => {
          set({ error: err.message, loading: false });
        });

        socket.emit(
          "updateTask",
          { ...newValue, id },

          (response: { success: boolean; task?: ITask; error?: string }) => {
            console.log("editResponse", response);
            if (response.success) {
              set({ error: null, msj: "Tarea actualizada" });
              resolve();
            } else {
              set({ error: response.error || "Error desconocido" });
              reject();
            }
          }
        );
      });
    },

    deleteTask: (id: string) => {
      const { socket } = get();
      if (!socket) throw new Error("Primero debe conectar el websocket");
      return new Promise((resolve, reject) => {
        if (!socket) return reject("WebSocket no conectado");

        socket.once("taskRemoved", (response) => {
          console.log("taskRemoved:", response);
          set({ loading: false, error: null, msj: response.message }); // Actualiza el estado con la tarea recibida
        });

        socket.on("deleteTaskError", (err) => {
          set({ error: err.message, loading: false });
        });

        socket.emit(
          "removeTask",
          { idTask: id },
          (response: {
            success: boolean;
            task?: ITask;
            error?: string;
            message?: string;
          }) => {
            console.log("📩 Respuesta del servidor:delete:", response);
            if (response.success) {
              console.log("tarea", response);
              set({ msj: response.message });
              resolve();
            } else {
              set({ error: response.error || "Error desconocido" });
              reject(response.error);
            }
          }
        );
      });
    },

    filterTaskwbSocket: async (params: string) => {
      const { socket } = get();

      if (!socket) throw new Error("Primero debe conectar el websocket");

      set({ loading: true, error: null });

      return new Promise((resolve, reject) => {
        if (!socket) return reject("WebSocket no conectado");
        socket.once("filtered", (response) => {
          console.log("filtered:", response);
          set({
            tasks: response.task,
            loading: false,
            error: null,
            msj: response.message,
          }); // Actualiza el estado con la tarea recibida
        });

        socket.emit(
          "filterTask",
          { search: params },
          (response: { success: boolean; task?: ITask; error?: string }) => {
            if (response.success) {
              console.log("tarea", response);
              set({ myTask: response.task });
              resolve();
            } else {
              set({ error: response.error || "Error desconocido" });
              reject(response.error);
            }
          }
        );

        socket.on("errorFindOneTask", (err) => {
          set({ error: err.message, loading: false });
        });
      });
    },
  };
});

export default useTaskStore;
