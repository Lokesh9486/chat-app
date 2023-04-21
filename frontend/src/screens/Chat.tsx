import { useGetChatDetailsQuery, useSendMessageMutation } from "../app/chatApi";
import user from "../assets/images/user.png";
import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
import { messageType, registerApiData, sidebarDataType } from "../types";
import more from "../assets/images/more.png";

const Chat = () => {
  const ulElement = useRef<HTMLInputElement | null>(null);
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

  const sidebarData = data?.reduce(
    (
      array: sidebarDataType[],
      { name, message, _id }: registerApiData,
      index: number
    ) => {
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
  const [currentChatName, setCurrentChatName] = useState<string | undefined>();
  const [currentChatData, setCurrentChatData] = useState<
    messageType[] | undefined
  >();
  const [userSendMessage, setUserSendMaessage] = useState<string>("");

  ulElement?.current?.scrollTo({
    top: ulElement?.current?.scrollHeight,
    behavior: "smooth",
  });

  const recentDate=(data: messageType[]|undefined)=>{
       console.log(data);
      //  const uniqueDate=data?.filter(({createdAt},index)=>{
      //   return data.indexOf(createdAt)===index
      //  })
  }

  useEffect(() => {
    if (currentChat === undefined) {
      setCurrentChat(sidebarData?.[0]?.id);
      const chatData:  registerApiData[]|undefined = data?.filter(
        ({ _id }) => _id === sidebarData?.[0]?.id
      );
      setCurrentChatData(chatData?.[0]?.message);
      recentDate(chatData?.[0]?.message);
    } else {
      const chatData:  registerApiData[]|undefined = data?.filter(({ _id }) => _id === currentChat);
      setCurrentChatData(chatData?.[0].message);
      recentDate(chatData?.[0]?.message);
    }
    // currentChatData
  }, [data, userSendMessage]);

  useEffect(() => {
    if (currentChat) {
      const chatData: registerApiData[]|undefined = data?.filter(({ _id }) => _id === currentChat);
      setCurrentChatData(chatData?.[0].message);
    }
  }, [currentChat]);

  const sendMessageFun = () => {
    sendMessage({ currentChat, userSendMessage });
    setUserSendMaessage("");
  };

  const shortTime = new Intl.DateTimeFormat("en", {
    timeStyle: "short",
  });

  const formSubmitFunc=(e:FormEvent)=>{
     e.preventDefault();
     sendMessageFun();
  }

  return (
    <div className="chat-page">
      <header></header>
      <aside>
        <div className="side-bar-header">
          <img src={user} alt="user" className="profile-img-upload" />
          <input type="search" placeholder="Search for contact..." />
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
          {currentChatData?.map(({ type, message, createdAt }, index) => {
            console.log(new Date(createdAt).toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }));
            
            return (
              <Fragment key={index}>
                <div
                  
                  className={
                    type === "received" ? "other-chat-list" : "user-chat-list"
                  }
                >
                  <div className="chat-user-img-con">
                  <button type="button" className="more-btn">
                    <img src={more} alt="" />
                  </button>
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
          })}
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
            <button type="submit">
              Send
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Chat;
