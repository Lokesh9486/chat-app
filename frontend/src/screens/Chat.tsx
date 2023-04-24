import {
  useDeleteMessageMutation,
  useGetChatDetailsQuery,
  useSendMessageMutation,
} from "../app/chatApi";
import user from "../assets/images/user.png";
import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
import { messageType, registerApiData, sidebarDataType } from "../types";
import more from "../assets/images/more.png";
import edit from "../assets/images/edit.gif";
import trash from "../assets/images/trash.gif";
import logo from "../assets/images/logo1.png";
import { Link } from "react-router-dom";
import { useGetUserProfileQuery, useSearchUserQuery } from "../app/authApi";
import UserImgCon from "../components/UserImgCon";
import link from "../assets/images/link.png";

const Chat = () => {
  const ulElement = useRef<HTMLInputElement | null>(null);
  const [searchUser, setSearchUser] = useState<string>("");
  const {
    data,
    // , isError, isFetching, isLoading, isSuccess
  } = useGetChatDetailsQuery();
  // useGetChatDetailsQuery(
  //   "asdas", {
  //   pollingInterval: 3000,
  // }
  // );

  const [sendMessage, { data: value, isError, isLoading, isSuccess }] = useSendMessageMutation();
  const [deleteMsg] = useDeleteMessageMutation();
  const { data: userSeacrh } = useSearchUserQuery(searchUser, {
    skip: searchUser ? false : true,
  });

  const {data:userDetails}=useGetUserProfileQuery();

  const sidebarData = data?.reduce(
    (array: sidebarDataType[], { name, message, _id,active,profile }: registerApiData) => {
      array.push({
        name,
        active: Date.now()-Number(new Date(active))<20*1000,
        lastmessage: message[message.length - 1].message,
        id: _id,
        profile
      });
      return array;
    },
    []
  );

  const [currentChat, setCurrentChat] = useState<string | undefined>();
  const [currentChatData, setCurrentChatData] = useState<{message?:messageType[],profile?:string}>({});
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
      console.log(chatData);
      
      setCurrentChatData({message:chatData?.[0]?.message,profile:chatData?.[0]?.profile});
    } else {
      const chatData: registerApiData[] | undefined = data?.filter(
        ({ _id }) => _id === currentChat
      );
      setCurrentChatData({message:chatData?.[0]?.message,profile:chatData?.[0]?.profile});
    }
    // currentChatData
  }, [data, userSendMessage]);

  useEffect(() => {
    if (currentChat) {
      const chatData: registerApiData[] | undefined = data?.filter(
        ({ _id }) => _id === currentChat
      );
      setCurrentChatData({message:chatData?.[0]?.message,profile:chatData?.[0]?.profile});
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
  
  console.log(currentChatData);
  
  // let renderDate = "";

  return (
    <div className="chat-page">
      <section className="chat-pages-main">
        <aside>
          <div className="side-bar-header">
            <img src={userDetails?.user.profile??user} alt="user" className="profile-img-upload" />
            <input
              type="search"
              placeholder="Search for contact..."
              onChange={(e) => setSearchUser(e.target.value)}
            />
          </div>
          <div className="side-bar-body">
            {(userSeacrh?.length &&searchUser) ? (
              <>
                <p className="side-bar-topic ternary-topic">Users</p>
                <ul>
                  {userSeacrh?.map(({ name, email ,_id:id }, index) => {
                    return (
                      <li
                        key={index}
                        className={currentChat === id ? "active" : ""}
                        onClick={() => setCurrentChat(id)}
                      >
                        <img
                          src={user}
                          alt="user"
                          className="profile-img-upload"
                        />
                        <div>
                          <p className="user-name">{name}</p>
                          <p className="last-message">{email}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              ""
            )}
            <p className="side-bar-topic ternary-topic">Chats</p>
            <ul>
              {sidebarData?.map(({ name, lastmessage, id,active,profile }, index) => {
                return (
                  <li
                    key={index}
                    className={(currentChat === id? "active" :"")}
                    onClick={() => setCurrentChat(id)}
                  >
                    <UserImgCon profile={profile} status={active? " currently-active":""}/>
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
          {
            (()=>
            sidebarData?.filter(({ id }) => id === currentChat)?.map(({active,id,lastmessage,name,profile})=>{
             return  <>
              <UserImgCon profile={profile} status={active? " currently-active":""}/>
              <p className="user-name">
                {name}
              </p>
              </>
              })
            )()
          }
          </div>
          <div className="chat-body" ref={ulElement}>
            {(() => {
              const messsage = [];
              const renderDateArr: string[] = [];
              let renderDate = "";
              for (const [
                index,
                { type, message, createdAt, id },
              ] of currentChatData?.message?.entries() ?? []) {
                const date = new Date(createdAt).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
                renderDate = date;
                if (renderDateArr.includes(date)) {
                  renderDate = "";
                }
                messsage.push(
                  <Fragment key={index}>
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
                              <button
                                type="button"
                                onClick={() => deleteMsg(id)}
                              >
                                <p>Delete</p> <img src={trash} alt="trash" />
                              </button>
                            </li>
                          </ul>
                        </div>
                        <img
                          src={(type !== "received"?userDetails?.user.profile:currentChatData?.profile)??user}
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
            })()}
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
              <label htmlFor="upload-img" className="upload-img-label" ><img src={link} alt="link"  /></label>
              <input type="file" id="upload-img" accept="image/*"/>
              <button type="submit">Send</button>
            </form>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Chat;
