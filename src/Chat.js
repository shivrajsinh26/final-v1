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

function Chat() {
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [emoji, setEmoji] = useState(false);
  const [search, setSearch] = useState(false);
  const [{ user }] = useStateValue();
  const textbox = useRef(null);
  const [message, setMessage] = useState("");
  var id = useParams();
  const [chatName, setChatName] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setMessage(message.concat(chosenEmoji.emoji));
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

  // const messagesEndRef = useRef(null)

  // const scrollToBottom = () => {
  //   messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  // }

  // useEffect(scrollToBottom, [messages]);

  return (
    <div className="chat">
      <div className="chat__header">
        <div className="chat__headerInfo">
          <Avatar />
          <div className="chat__headerText">
            <h2>{chatName}</h2>
            <p>
              {new Date(
                messages[messages.length - 1]?.timestamp?.toDate().toUTCString()
              ).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="chat__headerRight">
          {search ? (
            <>
              <input
                type="text"
                value={searchMessage}
                onChange={(e) => {
                  setSearchMessage(e.target.value);
                }}
                placeholder="Search Messages..."
              ></input>
            </>
          ) : (
            <></>
          )}

          <IconButton
            onClick={() => {
              setSearch(!search);
            }}
          >
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages.filter((message) => {
              if (searchMessage === "") {
                return message;
              } else if (
                message.data.msg.toLowerCase().includes(searchMessage.toLowerCase())
              ) {
                return message;
              } else if (
                message.data.msg
                  .toLowerCase()
                  .includes(searchMessage.toLowerCase()) === 0
              ) {
                return alert("No Messages Found");
              }
              return null;
            }).map((message) => (
          <div className="chat__message__container" key={message.id}>
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
            </div>
            {/* <div ref={messagesEndRef} /> */}
          </div>
        ))}
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
      </div>
      <div className="chat__footer">
        <div className="chat__footerContent">
          <div className="chat__footerContentLeft">
            {/* {emoji ? (
              <>
                <div className="chat__emojipicker">
                  <Picker
                  searchPlaceholder = {"search emojis"}
                    disableAutoFocus={true}
                    onEmojiClick={onEmojiClick}
                    pickerStyle={{ width: "50%" }}
                  />
                </div>
              </>
            ) : (
              <></>
            )} */}
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
