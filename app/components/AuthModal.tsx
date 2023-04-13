"use client";

import * as React from "react";
import Box from "@mui/material/Box";

import Modal from "@mui/material/Modal";
import AuthModalInputs from "./AuthModalInputs";
import useAuth from "../../hooks/useAuth";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "5px",
  p: 4,
};

export default function AuthModal({ isSignIn }: { isSignIn: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [inputs, setInputs] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });

  React.useEffect(() => {
    if (isSignIn) {
      if (inputs.email.trim() && inputs.password.trim()) {
        return setDisabled(false);
      }
      return setDisabled(true);
    } else {
      if (
        inputs.firstName.trim() &&
        inputs.lastName.trim() &&
        inputs.email.trim() &&
        inputs.phone.trim() &&
        inputs.city.trim() &&
        inputs.password.trim()
      ) {
        return setDisabled(false);
      }
      return setDisabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { signin } = useAuth();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const renderContent = (signinContent: string, signupContents: string) => {
    return isSignIn ? signinContent : signupContents;
  };

  const handleSubmit = () => {
    if (isSignIn) {
      signin({ email: inputs.email, password: inputs.password });
    }
  };

  return (
    <div>
      <button
        className={`${
          isSignIn && "bg-blue-400 text-white mr-3"
        }  border p-1 px-4 rounded `}
        onClick={handleOpen}
      >
        {renderContent("Sign in", "Sign up")}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="p-2 h-[600px]">
            <div className="uppercase font-bold text-center pb-2 border-b border-zinc-400 mb-2">
              <p className="text-sm">
                {renderContent("Sign In", "Create Account")}
              </p>
            </div>
            <div className="m-auot">
              <h2 className="text-2xl font-light text-center">
                {renderContent(
                  "Log into your account",
                  "Create your OpenTable account"
                )}
              </h2>
              <AuthModalInputs
                inputs={inputs}
                handleInput={handleInput}
                isSignIn={isSignIn}
              />
              <button
                className="bg-red-600 uppercase text-white w-full p-3 rounded text-cm mb-5 disabled:bg-gray-400"
                disabled={disabled}
                onClick={handleSubmit}
              >
                {renderContent("Sign in", "Create account")}
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
