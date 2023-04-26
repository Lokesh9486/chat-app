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
import dotLoader from "../assets/images/dotloader.gif";
import happyemoji from "../assets/images/happyemoji.png";
import Modal from "../components/Modal";
import { getModalShow, modalAction } from "../features/auth";
import { useAppDispatch, useAppSelector } from "../app/hooks";

const Chat = () => {
  const ulElement = useRef<HTMLInputElement | null>(null);
  const [searchUser, setSearchUser] = useState<string>("");
  const {
    data,
    // , isError, isFetching, isLoading, isSuccess
  } = useGetChatDetailsQuery()
  // useGetChatDetailsQuery(
  //   "asdas", {
  //   pollingInterval: 500,
  // }
  // );

  const [sendMessage, { data: value, isError, isLoading, isSuccess }] =
    useSendMessageMutation();
  console.log(`Chat ~ isSuccess:`, data, value, isSuccess, isLoading);
  const [deleteMsg] = useDeleteMessageMutation();
  const { data: userSeacrh, isLoading: searchUserLoading } = useSearchUserQuery(
    searchUser,
    {
      skip: searchUser ? false : true,
    }
  );

  const { data: userDetails } = useGetUserProfileQuery();

  const sidebarData = data?.reduce(
    (
      array: sidebarDataType[],
      { name, message, _id, active, profile }: registerApiData
    ) => {
      array.push({
        name,
        active: Date.now() - Number(new Date(active)) < 20 * 1000,
        lastmessage: message[message.length - 1].message,
        id: _id,
        profile,
      });
      return array;
    },
    []
  );

  const [currentChat, setCurrentChat] = useState<string | undefined>();
  const [currentChatData, setCurrentChatData] = useState<{
    message?: messageType[];
    profile?: string;
  }>({});
  const [userSendMessage, setUserSendMaessage] = useState<string>("");

  const dispatch=useAppDispatch();

  const modalShow=useAppSelector(getModalShow);

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

      setCurrentChatData({
        message: chatData?.[0]?.message,
        profile: chatData?.[0]?.profile,
      });
    } else {
      const chatData: registerApiData[] | undefined = data?.filter(
        ({ _id }) => _id === currentChat
      );
      setCurrentChatData({
        message: chatData?.[0]?.message,
        profile: chatData?.[0]?.profile,
      });
    }
    // currentChatData
  }, [data, userSendMessage]);

  useEffect(() => {
    if (currentChat) {
      const chatData: registerApiData[] | undefined = data?.filter(
        ({ _id }) => _id === currentChat
      );
      setCurrentChatData({
        message: chatData?.[0]?.message,
        profile: chatData?.[0]?.profile,
      });
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
console.log(userDetails?.user._id);

  return (
    <div className="chat-page">
      <section className="chat-pages-main">
        <aside>
          <div className="side-bar-header">
            <button type="button" className="primary-transparent-btn"
            onClick={()=>dispatch(modalAction({modal:!modalShow,userID:userDetails?.user._id}))}>
            <img
              src={userDetails?.user.profile ?? user}
              alt="user"
              className="profile-img-upload"
            />
            </button>
            <input
              type="search"
              placeholder="Search for contact..."
              onChange={(e) => setSearchUser(e.target.value)}
            />
          </div>
          <div className="side-bar-body">
            {searchUser ? (
              searchUserLoading ? (
                <img src={dotLoader} alt="" className="loader-img" />
              ) : (
                <>
                  <p className="side-bar-topic ternary-topic">Users</p>
                  <ul>
                    {userSeacrh?.map(({ name, email, _id: id }, index) => {
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
                            onClick={()=>dispatch(modalAction({modal:!modalShow,userID:id}))}
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
              )
            ) : (
              ""
            )}
            <p className="side-bar-topic ternary-topic">Chats</p>
            <ul>
              {sidebarData?.map(
                ({ name, lastmessage, id, active, profile }, index) => {
                  return (
                    <li
                      key={index}
                      className={currentChat === id ? "active" : ""}
                      onClick={() => setCurrentChat(id)}
                    >
                      <UserImgCon
                        profile={profile}
                        status={active ? " currently-active" : ""}
                        id={id}
                      />
                      <div>
                        <p className="user-name">{name}</p>
                        <p className="last-message">{lastmessage}</p>
                      </div>
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        </aside>
        <section className="chat-container">
          {currentChat ? (
            <>
              <div className="chat-header">
                {(() =>
                  sidebarData
                    ?.filter(({ id }) => id === currentChat)
                    ?.map(({ active, id, lastmessage, name, profile },index) => {
                      return (
                        <Fragment key={index}>
                          <UserImgCon
                            profile={profile}
                            status={active ? " currently-active" : ""}
                            id={id}
                          />
                          <p className="user-name">{name}</p>
                        </Fragment>
                      );
                    }))()}
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
                            {
                              type !== "received"?
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
                                  <button
                                    type="button"
                                    onClick={() => deleteMsg(id)}
                                  >
                                    <p>Delete</p>{" "}
                                    <img src={trash} alt="trash" />
                                  </button>
                                </li>
                              </ul>
                            </div>
                            :null
                            }
                            <img
                              src={
                                (type !== "received"
                                  ? userDetails?.user.profile
                                  : currentChatData?.profile) ?? user
                              }
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
                <form
                  onSubmit={formSubmitFunc}
                  className="user-message-conatiner"
                >
                  <input
                    type="text"
                    className="message-input"
                    value={userSendMessage}
                    placeholder="Type your Message here..."
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setUserSendMaessage(e.target?.value)
                    }
                  />
                  {/* <label htmlFor="upload-img" className="upload-img-label">
                    <img src={link} alt="link" className="loader-img" />
                  </label>
                  <input type="file" id="upload-img" accept="image/*" /> */}
                  {isLoading ? (
                    <img src={dotLoader} alt="" className="loader-img" />
                  ) : (
                    <button type="submit">Send</button>
                  )}
                </form>
              </div>
            </>
          ) : (
            <div className="message-not-found">
              <img src={happyemoji} alt="happyemoji" className="happyemoji"/>
              <p className="ternary-topic text-center">Search for other users in our chat and<br/> start a conversation with<br/> someone new</p>
            </div>
          )}
        </section>
      </section>
      
    </div>
  );
};

export default Chat;
