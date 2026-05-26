import api from "./api";


// Get Auth Header
const authHeader = () => {

  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
};


// GET TASKS
export const getTasks = async () => {

  const response = await api.get(
    "/tasks",
    authHeader()
  );

  return response.data.tasks || response.data;
};


// CREATE TASK
export const createTask = async (taskData) => {

  const response = await api.post(
    "/tasks",
    taskData,
    authHeader()
  );

  return response.data;
};


// DELETE TASK
export const deleteTask = async (id) => {

  const response = await api.delete(
    `/tasks/${id}`,
    authHeader()
  );

  return response.data;
};


// UPDATE TASK
export const updateTask = async (
  id,
  updatedData
) => {

  const response = await api.put(
    `/tasks/${id}`,
    updatedData,
    authHeader()
  );

  return response.data;
};