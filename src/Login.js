import { Button } from "@mui/material";
import React, { useState } from "react";
import "./css/Login.css";
import { signInWithPopup } from "firebase/auth";
import db, { auth, provider } from "./FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./Reducer";

function Login() {
  const nav = useNavigate();
  const [{ user }, dispatch] = useStateValue();
  const [data, setData] = useState({
    uid: null,
    name: null,
    email: null,
    photo: null
  });

  const login = () => {
    signInWithPopup(auth, provider).then((result) => {
      data.uid = result.user.uid;
      setData({ ...data, uid: data.uid });

      data.name = result.user.displayName;
      setData({ ...data, name: data.name });

      data.email = result.user.email;
      setData({ ...data, email: data.email });

      data.photo = result.user.photoURL;
      setData({ ...data, photo: data.photo });

      setDoc(doc(db, "usersData", result.user.uid), {
        name: data.name,
        photo: data.photo,
        email: data.email,
        uid: data.uid
      });

      dispatch({
        type: actionTypes.SET_USER,
        user: result.user
      });

      nav("/", { replace: true });
    });
  };

  return (
    <div className="login">
      <div className="login-container">
        <img
          alt=""
          src={
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png"
          }
          className="whatslogo"
        />
        <Button variant="outlined" onClick={login}>
          Login With Google
        </Button>
      </div>
    </div>
  );
}
export default Login;
