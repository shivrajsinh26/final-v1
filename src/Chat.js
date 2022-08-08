import { Avatar, IconButton } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicIcon from "@mui/icons-material/Mic";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import React, { useEffect, useRef, useState } from "react";
import "./css/Chat.css";
import InsertEmoticon from "@mui/icons-material/InsertEmoticon";
import { useParams } from "react-router-dom";
import db from "./FirebaseConfig";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useStateValue } from "./StateProvider";
import Moment from "react-moment";
import Picker from "emoji-picker-react";
import { v4 as uuidv4 } from 'uuid';








function Chat() {
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [emoji, setEmoji] = useState(false);
  const [{ user }] = useStateValue();
  const textbox = useRef(null);
  const [message, setMessage] = useState("");
  var id = useParams();
  const lstmsgref = useRef(null);
  const [chatName, setChatName] = useState("");
  const [messages, setMessages] = useState([]);

  const onEmojiClick = (event, emojiObject) => {
    setMessage(message?.concat(emojiObject.emoji));
    textbox.current.focus();
  };

  useEffect(() => {
    onSnapshot(doc(db, "chats", id.id), (doc) => {
      setChatName(doc.data().name);
    });

    onSnapshot(
      query(
        collection(db, "chats", id.id, "messages"),
        orderBy("timestamp", "asc")
      ),
      (snapshot) => {
        setMessages(snapshot.docs.map((doc) => doc.data()));
      }
    );
  }, [id]);

  const sent = (e) => {
    e.preventDefault();
    addDoc(collection(db, "chats", id.id, "messages"), {
      msg: message,
      timestamp: serverTimestamp(),
      name: user.displayName,
      sender: user.uid,
    }).then(() => {
      setMessage("");
      setEmoji(false);
    });
  };

  

  useEffect(() => {
    lstmsgref?.current?.scrollIntoView();
  }, [messages]);

  return (
    <div className="chat">
      <div className="chat__header">
        <div className="chat__headerInfo">
          <Avatar />
          <div className="chat__headerText">
            <h2>{chatName}</h2>
            <p>
              {messages[messages.length - 1]?.timestamp
                ? new Date(
                    messages[messages.length - 1]?.timestamp
                      ?.toDate()
                      .toUTCString()
                  ).toLocaleString()
                : "Offline"}
            </p>
          </div>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages.map((message) => (
          <div className="chat__message__container"  ref={lstmsgref} key={uuidv4()}>
            <div
              className={`chat__message ${
                message.sender === user.uid ? "sent" : "recieved"
              }`}
            >
              <div className="chat__messageName" key={message.name}>
                {message.name}
              </div>
              {message.msg}

              <div className="chat__messageTime">
                {<Moment fromNow>{message.timestamp?.toDate()}</Moment>}
              </div>
            </div >
            
          </div>
        ))}
      </div>
      <div className="chat__footer">
        <div className="chat__footerContent">
          <div className="chat__footerContentLeft">
            {emoji ? (
              <>
                <div className="chat__emojipicker">
                  <Picker
                    searchPlaceholder={"search emojis"}
                    disableAutoFocus={true}
                    onEmojiClick={onEmojiClick}
                    pickerStyle={{ width: "50%" }}
                  />
                </div>
              </>
            ) : (
              <></>
            )}
            <IconButton
              onClick={() => {
                setEmoji(!emoji);
              }}
            >
              <InsertEmoticon />
            </IconButton>
            <IconButton>
              <AttachFileIcon />
            </IconButton>
          </div>
          <form className="chat__msgbox">
            <input
              ref={textbox}
              type="text"
              value={message}
              className="chat__msg"
              placeholder="Type a message"
              onChange={(e) => {
                setMessage(e.target.value.replace(/\s+/g, " "));
              }}
            />
            <button
              className="sendMessageButton"
              type="submit"
              disabled={!message || message === " "}
              onClick={sent}
            ></button>
          </form>
          <div className="chat__footerContentRight">
            <IconButton>
              <MicIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
