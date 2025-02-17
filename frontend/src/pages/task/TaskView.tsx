import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useTaskStore from "../../store/useTaskStore";
import TaskCreate from "./TaskCreate";
import BasicCard from "../../components/Card";

const TaskView = () => {
  const { id } = useParams<{ id: string }>();

  const { getTaskById, connectWebSocket, disconnectWebSocket } = useTaskStore();
  useEffect(() => {
    if (id) {
      connectWebSocket();

      getTaskById(id);
    }

    return () => {
      disconnectWebSocket();
    };
  }, [id]);
  return (
    <div>
      <h1>MI tarea {id}</h1>
      <BasicCard title={"Mi tarea"}>
        <TaskCreate sizeInput={6} />
      </BasicCard>
    </div>
  );
};

export default TaskView;
