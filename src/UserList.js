import { Avatar, Button, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import "../src/css/userlist.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { addDoc, collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import db from "./FirebaseConfig";
import { v4 as uuidv4 } from 'uuid';

const UserList = () => {
  const [{ user }, dispatch] = useStateValue();
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const docRef = collection(db, "usersData");
    onSnapshot(docRef, (snapshot) => {
      setUserList(snapshot.docs.map((doc) => doc.data()));
    });
  }, []);
  const navigate = useNavigate();

  const handleDoc = async (frd) => {
    const iid = frd.uid > user.uid ? `${user.uid}${frd.uid}` : `${frd.uid}${user.uid}`;
    await setDoc(doc(db , "usersChats", iid) , {
      chatUsers : [user.uid , frd.uid].sort((a ,b) => a - b )
    })
  }


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
      <div className="userlist-container" >
        <table className="tg">
          <thead>
            <tr>
              <th className="tg-ul38">Profile Picture</th>
              <th className="tg-ru17">Name</th>
              <th className="tg-ul38">Message</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((frd) => {
              return (
                <tr key={
                  uuidv4()
                }>
                  <td className="tg-buh4">
                    <Avatar src={frd.photo} />
                  </td>
                  <td className="tg-797t">{frd.name}</td>
                  <td className="tg-buh4">
                    {
                     
                      <Button variant="contained" onClick={() => {
                        navigate('/');
                        navigate(`/chats/${frd.uid}` , {replace:true})
                        handleDoc(frd);
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

