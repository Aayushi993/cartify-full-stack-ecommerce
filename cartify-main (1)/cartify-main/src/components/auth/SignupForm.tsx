import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../features/auth/authSlice";
import toast from "react-hot-toast";
import { authService } from "../../services/auth.service";
import { useNavigate, useLocation } from "react-router-dom";
import type { AppDispatch, RootState } from "../../app/store";
import { closeAuth } from "../../features/ui/uiSlice";

const SignupForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { isAuthOpen } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    if (isAuthOpen) {
      setForm({ name: "", email: "", password: "" });
    }
  }, [isAuthOpen]);

  const validate = () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("All fields required ⚠️");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error("Invalid email ❌");
      return false;
    }

    if (form.password.length < 6) {
      toast.error("Weak password 🔒");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const user = await authService.signup(form);

      dispatch(loginSuccess(user));
      dispatch(closeAuth()); // 🔥 ADD THIS

      navigate(from, { replace: true });

      toast.success("Account created 🎉");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Signup failed ❌");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Create Account</h2>

      <input
        placeholder="Full Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full border p-2 rounded-md focus:ring-2 focus:ring-primary outline-none"
      />

      <input
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
className="w-full bg-primary text-white py-2 rounded-md hover:scale-[1.02] transition-transform duration-200 disabled:opacity-50"      >
        {loading ? "Creating..." : "Create Account"}
      </button>
    </form>
  );
};

export default SignupForm;
