import React, { useState, useEffect } from "react";
import { Avatar, IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import "./css/Sidebar.css";
import SidebarChat from "./SidebarChat";
import db from "./FirebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { Link, Outlet } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { getAuth, signOut } from "firebase/auth";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./Reducer";
import UserList from "./UserList";
// import { getAuth, signOut } from "firebase/auth";

function Sidebar() {
  const [{ user }, dispatch] = useStateValue();
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const colRef = collection(db, "chats");

    onSnapshot(colRef, (snapshot) => {
      setChats(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const SignOut = () => {
    setAnchorEl(null);
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch({
          type: actionTypes.REMOVE_USER,
          user: null,
        });
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <>
      <div className="sidebar">
        <div className="sidebar__header">
          <div className="user">
            <Avatar src={user.photoURL} />
            <div className="user__info">
              <div className="user__info__name">
                <b>{user.displayName}</b>
              </div>
              <div className="user__info__email">{user.email}</div>
            </div>
          </div>
          <div className="sidebar__headerRight">
            <Link to="/users">
              <IconButton aria-haspopup="true">
                <ChatIcon />
              </IconButton>
            </Link>

            <IconButton onClick={handleClick} aria-haspopup="true">
              <MoreVertIcon />
            </IconButton>
          </div>
        </div>

        <Menu anchorEl={anchorEl} keepMounted onClose={handleClose} open={open}>
          <MenuItem onClick={SignOut}>Sign Out</MenuItem>
        </Menu>

        <div className="sidebar__search">
          <div className="sidebar__searchContainer">
            <IconButton>
              <SearchOutlined />
            </IconButton>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              placeholder="Search or start a new chat"
            ></input>
          </div>
        </div>

        <div className="sidebar__chats">
          <SidebarChat addNewChat id="696969" />
          {chats
            .filter((chat) => {
              if (searchQuery === "") {
                return chat;
              } else if (
                chat.data.name.toLowerCase().includes(searchQuery.toLowerCase())
              ) {
                return chat;
              } else if (
                chat.data.name
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) === 0
              ) {
                return alert("No Chat Found");
              }
              return null;
            })
            .map((chat) => (
              <SidebarChat key={chat.id} id={chat.id} name={chat.data.name} />
            ))}
        </div>
      </div>
      <Outlet />{" "}
    </>
  );
}

export default Sidebar;
