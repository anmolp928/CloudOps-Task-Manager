import {
  useContext,
  useEffect,
  useState,
} from "react";

import Modal from "react-modal";

import {
  LogOut,
  Moon,
  Sun,
  Plus,
  Trash2,
  Pencil,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  AuthContext,
} from "../context/AuthContext";

import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../services/taskService";

Modal.setAppElement("#root");

const Dashboard = () => {

  const { user, logout } =
    useContext(AuthContext);

  const [tasks, setTasks] =
    useState([]);

  const [darkMode, setDarkMode] =
    useState(true);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedTask, setSelectedTask] =
    useState(null);

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      priority: "Medium",
      due_date: "",
    });


  const loadTasks = async () => {

    try {

      const data = await getTasks();

      setTasks(data);

    } catch (error) {

      console.log(error);
    }
  };


  useEffect(() => {

    loadTasks();

  }, []);


  // CREATE TASK
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await createTask(formData);

      toast.success(
        "Task created"
      );

      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        due_date: "",
      });

      loadTasks();

    } catch (error) {

      toast.error(
        "Failed to create task"
      );
    }
  };


  // DELETE TASK
  const handleDelete = async (
    id
  ) => {

    try {

      await deleteTask(id);

      toast.success(
        "Task deleted"
      );

      loadTasks();

    } catch (error) {

      toast.error(
        "Delete failed"
      );
    }
  };


  // COMPLETE TASK
  const toggleComplete =
    async (task) => {

      try {

        await updateTask(
          task.id,
          {
            ...task,
            completed:
              !task.completed,
          }
        );

        toast.success(
          "Task updated"
        );

        loadTasks();

      } catch (error) {

        toast.error(
          "Update failed"
        );
      }
    };


  // OPEN EDIT MODAL
  const openEditModal = (
    task
  ) => {

    setSelectedTask(task);

    setFormData({
      title: task.title,
      description:
        task.description,
      priority: task.priority,
      due_date:
        task.due_date?.split(
          "T"
        )[0] || "",
    });

    setIsModalOpen(true);
  };


  // UPDATE TASK
  const handleUpdateTask =
    async (e) => {

      e.preventDefault();

      try {

        await updateTask(
          selectedTask.id,
          {
            ...selectedTask,
            ...formData,
          }
        );

        toast.success(
          "Task updated"
        );

        setIsModalOpen(false);

        loadTasks();

      } catch (error) {

        toast.error(
          "Update failed"
        );
      }
    };


  return (

    <div
      className={`min-h-screen flex transition-all duration-300
      ${
        darkMode
          ? "bg-black text-white"
          : "bg-gray-100 text-black"
      }`}
    >

      {/* SIDEBAR */}

      <aside
        className={`w-72 border-r p-6
        ${
          darkMode
            ? "border-zinc-800 bg-zinc-950"
            : "border-gray-200 bg-white"
        }`}
      >

        <h1 className="text-3xl font-bold mb-10">

          CloudOps

        </h1>


        <button className="w-full text-left bg-blue-600 text-white p-4 rounded-2xl font-semibold mb-10">

          Dashboard

        </button>


        <div>

          <h2 className="text-gray-400 mb-4">

            Stats

          </h2>


          <div className="space-y-4">

            <div
              className={`p-4 rounded-2xl
              ${
                darkMode
                  ? "bg-zinc-900"
                  : "bg-gray-100"
              }`}
            >

              <p>Total Tasks</p>

              <h3 className="text-3xl font-bold">

                {tasks.length}

              </h3>

            </div>


            <div
              className={`p-4 rounded-2xl
              ${
                darkMode
                  ? "bg-zinc-900"
                  : "bg-gray-100"
              }`}
            >

              <p>Completed</p>

              <h3 className="text-3xl font-bold text-green-500">

                {
                  tasks.filter(
                    (t) =>
                      t.completed
                  ).length
                }

              </h3>

            </div>

          </div>

        </div>

      </aside>


      {/* MAIN */}

      <main className="flex-1 p-8">

        {/* TOPBAR */}

        <div className="flex justify-between items-center mb-10">

          <div>

            <h2 className="text-4xl font-bold">

              Welcome back,
              {" "}
              {user?.username}

            </h2>

            <p
              className={`mt-2
              ${
                darkMode
                  ? "text-gray-400"
                  : "text-gray-600"
              }`}
            >

              Manage your workflow efficiently.

            </p>

          </div>


          <div className="flex gap-4">

            <button
              onClick={() =>
                setDarkMode(
                  !darkMode
                )
              }
              className={`p-3 rounded-2xl
              ${
                darkMode
                  ? "bg-zinc-900"
                  : "bg-white shadow"
              }`}
            >

              {darkMode
                ? <Sun />
                : <Moon />
              }

            </button>


            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 p-3 rounded-2xl text-white"
            >

              <LogOut />

            </button>

          </div>

        </div>


        {/* CREATE TASK */}

        <form
          onSubmit={handleSubmit}
          className={`p-6 rounded-3xl mb-10 border
          ${
            darkMode
              ? "bg-zinc-950 border-zinc-800"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >

          <div className="flex justify-between items-center mb-6">

            <h3 className="text-2xl font-bold">

              Create Task

            </h3>

            <Plus />

          </div>


          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Task title"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title:
                    e.target.value,
                })
              }
              className={`p-4 rounded-xl border
              ${
                darkMode
                  ? "bg-zinc-900 border-zinc-700 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />


            <select
              value={
                formData.priority
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority:
                    e.target.value,
                })
              }
              className={`p-4 rounded-xl border
              ${
                darkMode
                  ? "bg-zinc-900 border-zinc-700 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            >

              <option>Low</option>
              <option>Medium</option>
              <option>High</option>

            </select>


            <input
              type="date"
              value={
                formData.due_date
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  due_date:
                    e.target.value,
                })
              }
              className={`p-4 rounded-xl border
              ${
                darkMode
                  ? "bg-zinc-900 border-zinc-700 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />


            <input
              type="text"
              placeholder="Description"
              value={
                formData.description
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description:
                    e.target.value,
                })
              }
              className={`p-4 rounded-xl border
              ${
                darkMode
                  ? "bg-zinc-900 border-zinc-700 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />

          </div>


          <button
            className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold text-white"
          >

            Add Task

          </button>

        </form>


        {/* TASKS */}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {tasks.map((task) => (

            <div
              key={task.id}
              className={`p-6 rounded-3xl border transition-all
              ${
                darkMode
                  ? "bg-zinc-950 border-zinc-800 hover:border-blue-500"
                  : "bg-white border-gray-200 hover:border-blue-400 shadow-sm"
              }`}
            >

              <div className="flex justify-between items-start mb-4">

                <h3
                  className={`text-2xl font-bold
                  ${
                    task.completed
                      ? "line-through text-gray-500"
                      : ""
                  }`}
                >

                  {task.title}

                </h3>


                <div className="flex gap-3">

                  <button
                    onClick={() =>
                      openEditModal(
                        task
                      )
                    }
                    className="text-blue-500"
                  >

                    <Pencil size={18} />

                  </button>


                  <button
                    onClick={() =>
                      handleDelete(
                        task.id
                      )
                    }
                    className="text-red-500"
                  >

                    <Trash2 size={18} />

                  </button>

                </div>

              </div>


              <p
                className={`mb-6
                ${
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}
              >

                {task.description}

              </p>


              <div className="flex justify-between items-center">

                <span
                  className={`px-4 py-2 rounded-full text-sm
                  ${
                    task.priority ===
                    "High"
                      ? "bg-red-500/20 text-red-400"
                      : task.priority ===
                        "Medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >

                  {task.priority}

                </span>


                <button
                  onClick={() =>
                    toggleComplete(
                      task
                    )
                  }
                  className={`px-4 py-2 rounded-xl text-white
                  ${
                    task.completed
                      ? "bg-green-600"
                      : "bg-blue-600"
                  }`}
                >

                  {task.completed
                    ? "Done"
                    : "Complete"}

                </button>

              </div>

            </div>

          ))}

        </div>

      </main>


      {/* EDIT MODAL */}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() =>
          setIsModalOpen(false)
        }
        className={`max-w-xl mx-auto mt-32 p-8 rounded-3xl border outline-none
        ${
          darkMode
            ? "bg-zinc-950 border-zinc-800 text-white"
            : "bg-white border-gray-200 text-black"
        }`}
        overlayClassName="fixed inset-0 bg-black/70 flex justify-center items-start"
      >

        <h2 className="text-3xl font-bold mb-6">

          Edit Task

        </h2>


        <form
          onSubmit={
            handleUpdateTask
          }
        >

          <div className="space-y-4">

            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title:
                    e.target.value,
                })
              }
              className={`w-full p-4 rounded-xl border
              ${
                darkMode
                  ? "bg-zinc-900 border-zinc-700 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />


            <input
              type="text"
              value={
                formData.description
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description:
                    e.target.value,
                })
              }
              className={`w-full p-4 rounded-xl border
              ${
                darkMode
                  ? "bg-zinc-900 border-zinc-700 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />


            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority:
                    e.target.value,
                })
              }
              className={`w-full p-4 rounded-xl border
              ${
                darkMode
                  ? "bg-zinc-900 border-zinc-700 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            >

              <option>Low</option>
              <option>Medium</option>
              <option>High</option>

            </select>


            <input
              type="date"
              value={formData.due_date}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  due_date:
                    e.target.value,
                })
              }
              className={`w-full p-4 rounded-xl border
              ${
                darkMode
                  ? "bg-zinc-900 border-zinc-700 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />

          </div>


          <div className="flex gap-4 mt-6">

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white"
            >

              Save Changes

            </button>


            <button
              type="button"
              onClick={() =>
                setIsModalOpen(false)
              }
              className={`px-6 py-3 rounded-xl
              ${
                darkMode
                  ? "bg-zinc-700 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >

              Cancel

            </button>

          </div>

        </form>

      </Modal>

    </div>
  );
};

export default Dashboard;