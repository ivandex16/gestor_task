import { useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";
//import { JwtPayload } from "jsonwebtoken";
import useUserStore from "../store/useUserStore";

// interface DecodedToken extends JwtPayload {
//   exp: number;
// }

export const useAuth = () => {
  const user = useUserStore((state) => state.user);
  const token = localStorage.getItem("token");
  return Boolean(token);
};
