import BasicCard from "../../components/Card";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useUserStore from "../../store/useUserStore";
import { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Alert from "@mui/material/Alert";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const { user, msj, loading, error, login, setMensaje } = useUserStore();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const [helpertext, setHelpertext] = useState({
    email: "",
    password: "",
  });

  const [errorField, setErrorField] = useState({
    email: false,
    password: false,
  });

  //hook
  const authenticated = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) {
      navigate("/", { replace: true });
    }
  }, [authenticated, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setHelpertext({ email: "", password: "" });
    setErrorField({ email: false, password: false });
  };

  //notificaciones
  useEffect(() => {
    console.log("efect msj", msj);
    if (msj) {
      toast.error(msj, { className: "custom-toast" });
    }
    setMensaje(null);

    return () => {
      setMensaje(null);
    };
  }, [msj]);

  const validate = () => {
    if (!formData.email) {
      setHelpertext((prev) => ({
        ...prev,
        email: "Email es requerido",
      }));

      setErrorField((prev) => ({
        ...prev,
        email: true,
      }));
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      setHelpertext((prev) => ({
        ...prev,
        email: "Email no válido",
      }));
      setErrorField((prev) => ({
        ...prev,
        email: true,
      }));
    }

    if (!formData.password) {
      setHelpertext((prev) => ({
        ...prev,
        password: "Password es requerido",
      }));
      setErrorField((prev) => ({
        ...prev,
        password: true,
      }));
    } else if (formData.password.length < 6) {
      setHelpertext((prev) => ({
        ...prev,
        password: "Password debe tener al menos 6 caracteres",
      }));
      setErrorField((prev) => ({
        ...prev,
        password: true,
      }));
    }
  };

  const handleSubmit = () => {
    validate();
    if (!errorField.email && !errorField.password) {
      login(formData.email, formData.password);
    }
  };

  console.log("el error", error);
  console.log("user", user);
  console.log({ msj });
  return (
    <BasicCard title="Iniciar Sesión">
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          "& > :not(style)": { m: 1, width: "100%" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          fullWidth
          type="email"
          name="email"
          size="small"
          onChange={handleChange}
          error={errorField.email}
          helperText={helpertext.email}
        />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          fullWidth
          type="password"
          name="password"
          size="small"
          onChange={handleChange}
          error={errorField.password}
          helperText={helpertext.password}
        />

        <Button
          variant="contained"
          disableElevation
          onClick={() => handleSubmit()}
          loading={loading}
          loadingIndicator="Loading…"
          sx={{ backgroundColor: "black", color: "white" }}
        >
          Login
        </Button>
        <Button component={Link} to="/auth/register" variant="text">
          ¿No tienes cuenta?
        </Button>
        <ToastContainer />

        {msj && (errorField.email || errorField.password) ? (
          <Alert variant="filled" severity="error">
            {msj}
          </Alert>
        ) : null}
      </Box>
    </BasicCard>
  );
};

export default Login;
