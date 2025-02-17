import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../interfaces";
import { jwtDecode } from "jwt-decode";

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  msj: string | null;
  token: string | null;
  setMensaje: (msj: string | null) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  registerUser: (
    email: string,
    password: string,
    fullname: string
  ) => Promise<void>;
  logout: () => void;
  initializeAuth: () => Promise<void>;
}

const useUserStore = create<UserState, [["zustand/persist", UserState]]>(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      msj: null,
      token: null,
      setMensaje: (msj) => set({ msj }),
      setError: (error) => set({ error }),
      login: async (email: string, password: string) => {
        set({ loading: true, error: null });

        try {
          const response = await fetch("http://localhost:3002/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              password: password,
            }),
          });

          console.log("response", response);
          if (!response.ok) {
            const errorData = await response.json();
            set({ error: errorData.message });
            console.log(errorData);
            throw new Error("Failed to login");
          }

          const data: User = await response.json();

          const decoded = jwtDecode<User & { exp: number }>(data.token);
          localStorage.setItem("token", data.token);
          set({ user: data, loading: false, msj: null });
        } catch (error: any) {
          console.log("cathError", error);
          set({ error: error.message, loading: false, token: null });
          localStorage.removeItem("token");
        }
      },
      registerUser: async (
        email: string,
        password: string,
        fullname: string
      ) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch("http://localhost:3002/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              password: password,
              fullname: fullname,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            set({ error: errorData.message });
            console.log(errorData);
            throw new Error("Failed to login");
          }

          const data: User = await response.json();

          //localStorage.setItem("token", data.token);
          set({
            user: data,
            loading: false,
            msj: "Usuario registrado con exito",
          });
        } catch (error: any) {
          console.log("cathError", error);
          set({ error: error.message, loading: false, token: null });
        }
      },
      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null });
      },

      initializeAuth: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          set({ token: null });
          return;
        }

        try {
          const decoded = jwtDecode<User & { exp: number }>(token);

          console.log("init", decoded.exp * 1000 < Date.now());
          if (decoded.exp * 1000 > Date.now()) {
            throw new Error("Token expirado");
          }

          set({ token });
        } catch (error) {
          localStorage.removeItem("token");
          set({ token: null });
        }
      },
    }),
    {
      name: "user-store", // Nombre de la key en localStorage
      // Opcional: puedes filtrar qué campos persistir
      // partialize: (state) => ({ user: state.user })
    }
  )
);

export default useUserStore;
