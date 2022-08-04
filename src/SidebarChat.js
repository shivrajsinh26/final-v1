import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./css/SidebarChat.css";
import db from "./FirebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { Link } from "react-router-dom";
// import { doc, setDoc } from "firebase/firestore";

function SidebarChat({ id, name, addNewChat }) {
  const [last, setLast] = useState("");

  const createChat = () => {
    var chatName = prompt(
      "Enter the name or email address of person to connect to"
    );
    if (chatName) {
      addDoc(collection(db, "chats"), {
        name: chatName,
        addDate: serverTimestamp(),
      });
    }
  };

  useEffect(() => {
    console.log(id)
     const msgRef=  collection(db, "chats",`${id}`, "messages")
     const q = query(msgRef , orderBy("timestamp", "desc"));
     onSnapshot(q , (snapshot) => {
      setLast((snapshot.docs.map(doc => doc.data())))
     });
  }, [id]);

  return !addNewChat ? (
    <Link to={`/chats/${id}`}>
      <div className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/human/1.svg`} />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p>{
          last[0] ? (
          last[0]?.msg.length >= 21 ?
          last[0]?.msg.substring(0 ,20) + "..." : last[0]?.msg ) : "No New Message"}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="centerChat">
      <h2>Add New Chat</h2>
    </div>
  );
}

export default SidebarChat;
