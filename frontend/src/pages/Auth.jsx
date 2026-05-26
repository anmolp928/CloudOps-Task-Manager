import {
  useContext,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ShieldCheck,
} from "lucide-react";

import api from "../services/api";

import {
  AuthContext,
} from "../context/AuthContext";

const Auth = () => {

  const navigate = useNavigate();

  const { login } =
    useContext(AuthContext);

  const [isLogin, setIsLogin] =
    useState(true);

  const [formData, setFormData] =
    useState({
      username: "",
      email: "",
      password: "",
    });


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      // LOGIN
      if (isLogin) {

        const response =
          await api.post(
            "/auth/login",
            {
              email: formData.email,
              password:
                formData.password,
            }
          );

        login(
          response.data.token,
          response.data.user
        );

        navigate("/dashboard");

      }

      // SIGNUP
      else {

        await api.post(
          "/auth/signup",
          formData
        );

        alert(
          "Signup successful"
        );

        setIsLogin(true);
      }

    } catch (error) {

      alert(
        error.response?.data
          ?.message ||
        "Authentication failed"
      );
    }
  };


  return (

    <div className="min-h-screen flex bg-black text-white">

      {/* LEFT SECTION */}

      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 items-center justify-center p-16">

        <div>

          <div className="flex items-center gap-4 mb-8">

            <ShieldCheck
              size={50}
            />

            <h1 className="text-5xl font-bold">
              CloudOps
            </h1>

          </div>

          <h2 className="text-4xl font-bold leading-tight mb-6">

            Manage tasks
            <br />
            like a modern team.

          </h2>

          <p className="text-lg text-gray-200 max-w-lg">

            Secure cloud-native task
            management platform with
            DevOps-focused architecture.

          </p>

        </div>

      </div>


      {/* RIGHT SECTION */}

      <div className="flex-1 flex items-center justify-center p-8">

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-10 rounded-3xl shadow-2xl"
        >

          <h2 className="text-4xl font-bold mb-2">

            {isLogin
              ? "Welcome Back"
              : "Create Account"}

          </h2>

          <p className="text-gray-400 mb-8">

            {isLogin
              ? "Login to continue"
              : "Start managing tasks"}

          </p>


          {!isLogin && (

            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-xl mb-4 outline-none focus:border-blue-500"
              onChange={handleChange}
            />

          )}


          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-xl mb-4 outline-none focus:border-blue-500"
            onChange={handleChange}
          />


          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-xl mb-6 outline-none focus:border-blue-500"
            onChange={handleChange}
          />


          <button
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all p-4 rounded-xl font-semibold"
          >

            {isLogin
              ? "Login"
              : "Create Account"}

          </button>


          <p className="text-center text-gray-400 mt-6">

            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"
            }

            <button
              type="button"
              onClick={() =>
                setIsLogin(
                  !isLogin
                )
              }
              className="text-blue-500 ml-2"
            >

              {isLogin
                ? "Signup"
                : "Login"}

            </button>

          </p>

        </form>

      </div>

    </div>
  );
};

export default Auth;