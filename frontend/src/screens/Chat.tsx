import { useGetChatDetailsQuery, useSendMessageMutation } from "../app/chatApi";
import user from "../assets/images/user.png";
import { useEffect, useState } from "react";
import { messageType, registerApiData, sidebarDataType } from "../types";
const Chat = () => {
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

  useEffect(() => {
    if (currentChat === undefined) {
      setCurrentChat(sidebarData?.[0]?.id);
      const chatData: any = data?.filter(
        ({ _id }) => _id === sidebarData?.[0]?.id
      );
      setCurrentChatData(chatData?.[0].message);
    } else {
      const chatData: any = data?.filter(({ _id }) => _id === currentChat);
      setCurrentChatData(chatData?.[0].message);
    }
  }, [data]);

  useEffect(() => {
    if (currentChat) {
      const chatData: any = data?.filter(({ _id }) => _id === currentChat);
      setCurrentChatData(chatData?.[0].message);
    }
  }, [currentChat]);

  const sendMessageFun = () => {
    sendMessage({ currentChat, userSendMessage });
    setUserSendMaessage("");
  };

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
        <div className="chat-body">
          {currentChatData?.map(({ type, message, createdAt }, index) => {
            return (
              <div
                key={index}
                className={
                  type === "received" ? "other-chat-list" : "user-chat-list"
                }
              >
                <img src={user} alt="user" className="profile-img-upload" />
                <p className="message">{message}</p>
              </div>
            );
          })}
          <div className="user-message-conatiner">
            <input
              type="text"
              className="message-input"
              placeholder="Type your Message here..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUserSendMaessage(e.target?.value)
              }
            />
            <button type="submit" onClick={sendMessageFun}>
              Send
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Chat;
