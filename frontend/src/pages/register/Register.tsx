import BasicCard from "../../components/Card";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useUserStore from "../../store/useUserStore";
import { ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { debounce, delay } from "lodash";

const Register = () => {
  const navigate = useNavigate();
  const {
    user,
    msj,
    loading,
    error,
    registerUser: fetchRegister,
    setMensaje,
    setError,
  } = useUserStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullname: "",
  });




  //notificaciones
  useEffect(() => {
    console.log("efect msj", msj);
    if (msj) {
      toast.success(msj, { className: "custom-toast" });
      setFormData({
        email: "",
        password: "",
        fullname: "",
      });
      setHelpertext({
        email: "",
        password: "",
        fullname: "",
      });
      setErrorField({
        email: false,
        password: false,
        fullname: false,
      });
    
      
    }
    setMensaje(null);

    return () => {
      setMensaje(null);
    };
  }, [msj]);

  useEffect(() => {
    console.log("efect msj", msj);
    if (error) {
      toast.error(error, { className: "custom-toast" });
    }
    setError(null);

    return () => {
      setError(null);
    };
  }, [error]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  

  const [helpertext, setHelpertext] = useState({
    email: "",
    password: "",
    fullname: "",
  });

  const [errorField, setErrorField] = useState({
    email: false,
    password: false,
    fullname: false,
  });

  const validate = () => {
    let isValid = false
    if (!formData.email) {
      setHelpertext((prev) => ({
        ...prev,
        email: "Email es requerido",
      }));

      setErrorField((prev) => ({
        ...prev,
        email: true,
      }));
      isValid = false
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
      isValid = false
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
      isValid = false
    } else if (formData.password.length < 6) {
      setHelpertext((prev) => ({
        ...prev,
        password: "Password debe tener al menos 6 caracteres",
      }));
      setErrorField((prev) => ({
        ...prev,
        password: true,
      }));
      isValid = false
    }

    if (!formData.fullname) {
      setHelpertext((prev) => ({
        ...prev,
        fullname: "el nombre es requerido",
      }));
      setErrorField((prev) => ({
        ...prev,
        fullname: true,
      }));
      isValid = false
    }

    return isValid
  };

  const handleSubmit = async () => {
    validate();
    if (!errorField.email && !errorField.password && !errorField.fullname) {
      fetchRegister(formData.email, formData.password, formData.fullname), 3000
     setTimeout(() => {
       navigate("/auth/login");
      },2000)

    }
  };

  console.log("el error", error);
  console.log("user", user);
  return (
    <BasicCard title="Registrarse">
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
          helperText={helpertext.email}
          error={errorField.email}
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
          helperText={helpertext.password}
          error={errorField.password}
        />
        <TextField
          id="fullname"
          label="Full name"
          variant="outlined"
          fullWidth
          type="text"
          name="fullname"
          size="small"
          onChange={handleChange}
          helperText={helpertext.fullname}
          error={errorField.fullname}
        />

        {msj && <p>{msj}</p>}

        <Button
          variant="contained"
          disableElevation
          onClick={() => handleSubmit()}
          loading={loading}
          loadingIndicator="Loading…"
          sx={{ backgroundColor: "black", color: "white" }}
        >
          Registrate
        </Button>

        <Button component={Link} to="/auth/login" variant="text">
          ¿Ya tienes cuenta?
        </Button>

        <ToastContainer />
      </Box>
    </BasicCard>
  );
};

export default Register;
