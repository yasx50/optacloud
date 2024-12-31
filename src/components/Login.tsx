import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = isLogin
      ? "http://localhost:5000/api/v1/users/login"
      : "http://localhost:5000/api/v1/users/register";
  
    try {
      const response = await axios.post(apiUrl, formData, {
        withCredentials: true, // Enable sending cookies
      });
      console.log("Success:", response.data);
      alert(isLogin ? "Login Successful" : "Registration Successful");
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      alert("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 text-gray-800">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg border border-orange-200">
        <h2 className="text-2xl font-bold mb-4 text-center text-orange-600">
          {isLogin ? "Login" : "Register"}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-orange-100 text-gray-800 rounded focus:ring-2 focus:ring-orange-400"
                placeholder="Enter your name"
              />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-orange-100 text-gray-800 rounded focus:ring-2 focus:ring-orange-400"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-orange-100 text-gray-800 rounded focus:ring-2 focus:ring-orange-400"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded transition"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({ name: "", email: "", password: "" }); // Reset form data
            }}
            className="text-orange-500 hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
