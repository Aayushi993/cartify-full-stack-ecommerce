import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../features/auth/authSlice";
import toast from "react-hot-toast";
import { authService } from "../../services/auth.service";
import { useNavigate, useLocation } from "react-router-dom";
import type { AppDispatch, RootState } from "../../app/store";
import { closeAuth } from "../../features/ui/uiSlice";

const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { isAuthOpen } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    if (isAuthOpen) {
      setForm({ email: "", password: "" });
    }
  }, [isAuthOpen]);

  const validate = () => {
    if (!form.email || !form.password) {
      toast.error("All fields required ⚠️");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error("Invalid email format ❌");
      return false;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters 🔒");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const user = await authService.login(form);

      dispatch(loginSuccess(user));
      dispatch(closeAuth()); // 🔥 ADD THIS

      if (user.role === "SUPER_ADMIN") {
        navigate("/super-admin", { replace: true });
      } else if (user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }

      toast.success("Login successful 🎉");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Login</h2>

      <input
        autoFocus
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full border p-2 rounded-md focus:ring-2 focus:ring-primary outline-none"
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full border p-2 rounded-md focus:ring-2 focus:ring-primary outline-none"
      />

      <button
        disabled={loading}
        className="w-full bg-primary text-white py-2 rounded-md hover:scale-[1.02] transition-transform duration-200 disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
