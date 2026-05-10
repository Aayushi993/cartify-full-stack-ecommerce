import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { closeAuth, switchAuthMode } from "../../features/ui/uiSlice";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const AuthModal = () => {
  const dispatch = useDispatch();
  const { isAuthOpen, authMode } = useSelector((state: RootState) => state.ui);

  return (
    <Modal
      open={isAuthOpen}
      onClose={() => dispatch(closeAuth())}
      className="backdrop-blur-sm"
    >
      <Box className="flex items-center justify-center min-h-screen px-4 py-6 overflow-auto">
        <div className="relative bg-white w-full max-w-[750px] rounded-2xl overflow-hidden grid md:grid-cols-2 shadow-2xl transition-all duration-300 scale-100">
          {/* CLOSE */}
          <IconButton
            onClick={() => dispatch(closeAuth())}
            className="!absolute top-2 right-2 z-10"
          >
            <CloseIcon />
          </IconButton>
          {/* LEFT */}
          <div className="hidden md:flex flex-col justify-center p-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
            <h2 className="text-2xl font-bold mb-2">
              {authMode === "login" ? "Welcome Back 👋" : "Join CartiFy 🚀"}
            </h2>
            <p className="text-sm opacity-90">
              {authMode === "login"
                ? "Login to continue shopping"
                : "Create your account and start exploring"}
            </p>
          </div>
          {/* RIGHT */}
          <div className="p-6 sm:p-8">
            {authMode === "login" ? <LoginForm /> : <SignupForm />}

            <p className="text-sm text-center mt-5">
              {authMode === "login"
                ? "Don’t have an account?"
                : "Already have an account?"}{" "}
              <span
                className="text-primary font-semibold cursor-pointer hover:underline"
                onClick={() => {
                  dispatch(
                    switchAuthMode(authMode === "login" ? "signup" : "login"),
                  );
                }}
              >
                {authMode === "login" ? "Sign up" : "Login"}
              </span>
            </p>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AuthModal;
