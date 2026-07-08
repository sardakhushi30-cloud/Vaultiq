// This file contains the pages calling and main component of the expense tracker application.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/DashBoard";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";
import Expenses from "./pages/Expense";
import Reminder from "./pages/Reminder";
import Budget from "./pages/Budget";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/reminders" element={<Reminder />} />
          <Route path="/budget" element={<Budget />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;