import { Avatar, Button, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import "../src/css/userlist.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { collection, onSnapshot } from "firebase/firestore";
import db from "./FirebaseConfig";

const UserList = () => {
  const [{ user }, dispatch] = useStateValue();
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const docRef = collection(db, "usersData");
    onSnapshot(docRef, (snapshot) => {
      setUserList(snapshot.docs.map((doc) => doc.data()));
    });
    console.log(userList);
  }, []);
  const navigate = useNavigate();

  return (
    <div className="userlist">
      <div className="userlist-navbar">
        <div className="userlist-header">
          <Link to="/">
            <IconButton>
              <ArrowBackIcon />
            </IconButton>
          </Link>
        </div>
        <div className="userlist-header-right">
          {user.displayName}
          <Avatar src={`${user.photoURL}`} />
        </div>
      </div>
      <div className="userlist-container">
        <table class="tg">
          <thead>
            <tr>
              <th class="tg-ul38">Profile Picture</th>
              <th class="tg-ru17">Name</th>
              <th class="tg-ul38">Email</th>
              <th class="tg-ul38">Message</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => {
              return (
                <tr>
                  <td class="tg-buh4">
                    <Avatar src={user.photo} />
                  </td>
                  <td class="tg-797t">{user.name}</td>
                  <td class="tg-buh4">{user.email}</td>
                  <td class="tg-buh4">
                    {
                     
                      <Button variant="contained" onClick={() => {
                        
                        navigate('/');
                        navigate(`/chats/${user.uid}` , {replace:true})
                        
                      }}>
                        Send Message
                      </Button>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
