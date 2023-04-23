import { useDeleteMessageMutation, useGetChatDetailsQuery, useSendMessageMutation } from "../app/chatApi";
import user from "../assets/images/user.png";
import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
import { messageType, registerApiData, sidebarDataType } from "../types";
import more from "../assets/images/more.png";
import edit from "../assets/images/edit.gif";
import trash from "../assets/images/trash.gif";
import logo from "../assets/images/logo1.png";
import { Link } from "react-router-dom";
import home from "../assets/images/home.png";
import settings from "../assets/images/settings.png";
import chat from "../assets/images/chat.png";
import delete1 from "../assets/images/delete1.png";
import { useSearchUserQuery } from "../app/authApi";

const Chat = () => {
  const ulElement = useRef<HTMLInputElement | null>(null);
  const [searchUser,setSearchUser]=useState<string>("");
  const {
    data,
    // , isError, isFetching, isLoading, isSuccess
  } = useGetChatDetailsQuery();
  // useGetChatDetailsQuery(
  //   "asdas", {
  //   pollingInterval: 3000,
  // }
  // );
  console.log(data);

  const [sendMessage, { data: value, isError, isLoading, isSuccess }] =
    useSendMessageMutation();
    const [deleteMsg]=useDeleteMessageMutation();
    const {data:user} = useSearchUserQuery(searchUser,{skip:searchUser?true:false});

  const sidebarData = data?.reduce(
    (array: sidebarDataType[], { name, message, _id }: registerApiData) => {
      array.push({
        name,
        lastmessage: message[message.length - 1].message,
        id: _id,
      });
      return array;
    },
    []
  );

  const [currentChat, setCurrentChat] = useState<string | undefined>();
  const [currentChatData, setCurrentChatData] = useState<
    messageType[] | undefined
  >([]);
  const [userSendMessage, setUserSendMaessage] = useState<string>("");

  const shortTime = new Intl.DateTimeFormat("en", {
    timeStyle: "short",
  });

  ulElement?.current?.scrollTo({
    top: ulElement?.current?.scrollHeight,
    behavior: "smooth",
  });

  useEffect(() => {
    if (currentChat === undefined) {
      setCurrentChat(sidebarData?.[0]?.id);
      const chatData: registerApiData[] | undefined = data?.filter(
        ({ _id }) => _id === sidebarData?.[0]?.id
      );
      setCurrentChatData(chatData?.[0]?.message);
    } else {
      const chatData: registerApiData[] | undefined = data?.filter(
        ({ _id }) => _id === currentChat
      );
      setCurrentChatData(chatData?.[0].message);
    }
    // currentChatData
  }, [data, userSendMessage]);

  useEffect(() => {
    if (currentChat) {
      const chatData: registerApiData[] | undefined = data?.filter(
        ({ _id }) => _id === currentChat
      );
      setCurrentChatData(chatData?.[0].message);
    }
  }, [currentChat]);


  const sendMessageFun = () => {
    sendMessage({ currentChat, userSendMessage });
    setUserSendMaessage("");
  };

  const formSubmitFunc = (e: FormEvent) => {
    e.preventDefault();
    sendMessageFun();
  };

  // let renderDate = "";

  return (
    <div className="chat-page">
      <section className="chat-pages-main">
      {/* <nav>
        <div></div>
        <div className="main-icons">
          <Link to="/"><img src={home} alt="home" /></Link>
          <Link to="/"><img src={chat} alt="chat" /></Link>
          <Link to="/"><img src={settings} alt="settings" /></Link>
        </div>
        <Link to="/userprofile"><img src={user} alt="user" /></Link>
      </nav> */}
        <aside>
          <div className="side-bar-header">
            <img src={user} alt="user" className="profile-img-upload" />
            <input type="search" placeholder="Search for contact..." 
            onChange={(e)=>setSearchUser(e.target.value)}/>
          </div>
          <div className="side-bar-body">
            <p className="side-bar-topic ternary-topic">Chats</p>
            <ul>
              {sidebarData?.map(({ name, lastmessage, id }, index) => {
                return (
                  <li
                    key={index}
                    className={currentChat === id ? "active" : ""}
                    onClick={() => setCurrentChat(id)}
                  >
                    <img src={user} alt="user" className="profile-img-upload" />
                    <div>
                      <p className="user-name">{name}</p>
                      <p className="last-message">{lastmessage}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
        <section className="chat-container">
          <div className="chat-header">
            <img src={user} alt="user" className="profile-img-upload" />
            <div>
              <p className="user-name">
                {sidebarData?.filter(({ id }) => id === currentChat)?.[0]?.name}
              </p>
            </div>
          </div>
          <div className="chat-body" ref={ulElement}>
            {/* {currentChatData?.map(({ type, message, createdAt }, index) => {
            const date = new Date(createdAt).toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            (() => (renderDate != date)?renderDate=date:( renderDate = "") )()
            
            return (
              <Fragment key={index}>
                {renderDate&& <div className="unique-date">
                  <p>{renderDate}</p>
                </div>}
                <div
                  className={
                    type === "received" ? "other-chat-list" : "user-chat-list"
                  }
                >
                  <div className="chat-user-img-con">
                  <div className="dropdown">
                  <button type="button" className="more-btn dropdown-toggle" data-bs-toggle="dropdown">
                      <img src={more} alt="" />
                    </button>
                  <ul className="dropdown-menu">
                    <li><button type="button"><p>Edit</p> <img src={edit} alt="edit" /></button></li>
                    <li><button type="button"><p>Delete</p> <img src={trash} alt="trash" /></button></li>
                  </ul>
                </div>
                    <img src={user} alt="user" className="profile-img-upload" />
                  </div>
                  <div className="message-con">
                    <p className="message">{message}</p>
                    <p className="message-time">
                      {shortTime.format(new Date(createdAt))}
                    </p>
                  </div>
                </div>
              </Fragment>
            );
            
          })} */}
            {
              (() => {
                const messsage = [];
                const renderDateArr:string[]=[];
                let renderDate='';
                for (const { type, message, createdAt,id } of currentChatData ?? []) {
                  const date = new Date(createdAt).toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });
                  renderDate=date
                  if(renderDateArr.includes(date)){
                    renderDate=""
                  }
                  messsage.push(
                    <Fragment>
                      {renderDate && (
                        <div className="unique-date">
                          <p>{renderDate}</p>
                        </div>
                      )}
                      <div
                        className={
                          type === "received"
                            ? "other-chat-list"
                            : "user-chat-list"
                        }
                      >
                        <div className="chat-user-img-con">
                          <div className="dropdown">
                            <button
                              type="button"
                              className="more-btn dropdown-toggle"
                              data-bs-toggle="dropdown"
                            >
                              <img src={more} alt="" />
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button type="button">
                                  <p>Edit</p> <img src={edit} alt="edit" />
                                </button>
                              </li>
                              <li>
                                <button type="button" onClick={()=>deleteMsg(id)}>
                                  <p>Delete</p> <img src={trash} alt="trash" />
                                </button>
                              </li>
                            </ul>
                          </div>
                          <img
                            src={user}
                            alt="user"
                            className="profile-img-upload"
                          />
                        </div>
                        <div className="message-con">
                          <p className="message">{message}</p>
                          <p className="message-time">
                            {shortTime.format(new Date(createdAt))}
                          </p>
                        </div>
                      </div>
                    </Fragment>
                  );
                  renderDateArr.push(date);
                }
                return messsage;
              })()
            }
            <form onSubmit={formSubmitFunc} className="user-message-conatiner">
              <input
                type="text"
                className="message-input"
                value={userSendMessage}
                placeholder="Type your Message here..."
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUserSendMaessage(e.target?.value)
                }
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Chat;
