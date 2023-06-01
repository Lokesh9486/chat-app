import {
  useDeleteMessageMutation,
  useGetChatDetailsQuery,
  useSendMessageMutation,
} from "../app/chatApi";
import user from "../assets/images/user.png";
import { ChangeEvent, FormEvent, Fragment, useEffect, useRef, useState } from "react";
import { messageType, registerApiData, sidebarDataType } from "../types";
import more from "../assets/images/more.png";
import trash from "../assets/images/trash.gif";
import { useGetUserProfileQuery, useSearchUserQuery } from "../app/authApi";
import UserImgCon from "../components/UserImgCon";
import link from "../assets/images/link.png";
import dotLoader from "../assets/images/dotloader.gif";
import happyemoji from "../assets/images/happyemoji.png";
import Skeleton from "../components/Skeleton";
import loctioinImg from "../assets/images/location1.png";
import loctioinplaceholderImg from "../assets/images/placeholder.png";
import cancel from "../assets/images/cancel.png";
import "leaflet/dist/leaflet.css";
import MapCom from "../components/MapCom";
import GroupImg from "../assets/images/group.png";
import imageplaceholder from "../assets/images/imageplaceholder.png"
import { useDeleteGroupMessageMutation, useSendMessageGroupMutation } from "../app/groupApi";
import { motion } from "framer-motion";
import Modal from "../components/Modal";


const Chat = () => {
  const ulElement = useRef<HTMLInputElement | null>(null);
  const [searchUser, setSearchUser] = useState<string>("");
  const {
    data,
    // , isError, isFetching, isLoading, isSuccess
  } =  useGetChatDetailsQuery("");

  const [sendMessage, { data: value, isError, isLoading, isSuccess }] = useSendMessageMutation();

  const [groupSendMessage,{data:groupMsg,error:groupError}]=useSendMessageGroupMutation();
  
  const [deleteMsg] = useDeleteMessageMutation();
  const [deletGroupMsg]=useDeleteGroupMessageMutation();

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
      { name, message, _id, active, profile,group }: registerApiData
    ) => {
      array.push({
        name,
        active: Date.now() - Number(new Date(active)) < 20 * 1000,
        lastmessage: message[message.length - 1].message,
        image: message[message.length - 1].image?true:false,
        location: message[message.length - 1].location?true:false,
        id: _id,
        profile,
        group
      });
      return array;
    },
    []
  );

  const [currentChat, setCurrentChat] = useState<string | undefined>();
  const [currentChatData, setCurrentChatData] = useState<{
    description?:string,
    group?:boolean,
    createdAt?:Date;
    createdBy?:string;
    message?: messageType[];
    profile?: string;
  }>({});
  const [userSendMessage, setUserSendMaessage] = useState<string>("");
  const [preview,setPreview]=useState<string| ArrayBuffer | null>("");
  const [uploadImg,setUploadImg]=useState<File | undefined>();
  const [location,setLocation]=useState<number[]>([]);


  const shortTime = new Intl.DateTimeFormat("en", {
    timeStyle: "short",
  });

  // ulElement?.current?.scrollTo({
  //   top: ulElement?.current?.scrollHeight,
  //   behavior: "smooth",
  // });

  useEffect(()=>{
    ulElement?.current?.scrollTo({
      top: ulElement?.current?.scrollHeight,
      behavior: "smooth",
    });
  },[value])

  useEffect(() => {
    if (currentChat === undefined) {
      setCurrentChat(sidebarData?.[0]?.id);
      const chatData: registerApiData[] | undefined = data?.filter(
        ({ _id }) => _id === sidebarData?.[0]?.id
      );
 
      setCurrentChatData({
        createdBy:chatData?.[0]?.created_by,
        description:chatData?.[0]?.description,
        group:chatData?.[0]?.group,
        message: chatData?.[0]?.message,
        profile: chatData?.[0]?.profile,
      });
    } else {
      const chatData: registerApiData[] | undefined = data?.filter(
        ({ _id }) => _id === currentChat
      );
   
      setCurrentChatData({
        createdBy:chatData?.[0]?.created_by,
        description:chatData?.[0]?.description,
        group:chatData?.[0]?.group,
        message: chatData?.[0]?.message,
        profile: chatData?.[0]?.profile,
      });
    }
    
  }, [data, userSendMessage]);

  useEffect(() => {
    if (currentChat) {
      ulElement?.current?.scrollTo({
        top: ulElement?.current?.scrollHeight,
        behavior: "smooth",
      });
      const chatData: registerApiData[] | undefined = data?.filter(
        ({ _id }) => _id === currentChat
      );
      
      setCurrentChatData({
        createdBy:chatData?.[0]?.created_by,
        createdAt:chatData?.[0]?.created_at,
        description:chatData?.[0]?.description,
        group:chatData?.[0]?.group,
        message: chatData?.[0]?.message,
        profile: chatData?.[0]?.profile,
      });
    }
  }, [currentChat]);

  const sendMessageFun = () => {
    const formData=new FormData();
    formData.append("message",userSendMessage)
    formData.append("location",JSON.stringify(location))
    formData.append("image",(uploadImg as any));
    if(currentChatData.group){
      groupSendMessage({ currentChat, formData})
    }
    else{
      sendMessage({ currentChat, formData });
    }
    setUserSendMaessage("");
    setPreview("");
    setLocation([]);
    setUploadImg(undefined)
  };

  const formSubmitFunc = (e: FormEvent) => {
    e.preventDefault();
    sendMessageFun();
  };

  const imageUpload=(e:ChangeEvent<HTMLInputElement>)=>{
    const reader=new FileReader();
    reader.onload=()=>{
       if(reader.readyState===2){
        setPreview(reader.result);
        setUploadImg(e.target.files?.[0]);
       }
      }
      if(e.target?.files){
       reader.readAsDataURL(e.target.files?.[0])
     }
  }

  const getLocation=()=> {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
        setLocation([position.coords.longitude,position.coords.latitude])
      },function(e){
        
      }, {
        enableHighAccuracy: true
    });
    } else {
     console.log("Geolocation is not supported by this browser.");
    }
  }

  return (
  <>
  <div className="chat-page">
    {
      data?
    <section className="chat-pages-main">
      <aside>
        {/* sidebar header */}
        <div className="side-bar-header">
         {userDetails?.user._id&&<UserImgCon
           isGroup={false}
            profile={userDetails?.user.profile}
            id={userDetails?.user._id}
            isUser={true}
          />}
          <input
            type="search"
            placeholder="Search for contact..."
            onChange={(e) => setSearchUser(e.target.value)}
          />
        </div>
        {/* sidebar body */}
        <div className="side-bar-body">
          {searchUser ? (
            searchUserLoading ? (
              <img src={dotLoader} alt="" className="loader-img" />
            ) : (
              <>
                <p className="side-bar-topic ternary-topic">Users</p>
                <ul>
                  {userSeacrh?.map(({ name, email, _id: id,profile }, index) => {
                    return (
                      <motion.li
                      transition={{delay:1*index}}
                      initial={{opacity:0,y:50}}
                      animate={{opacity:1,y:0}}
                      exit={{opacity:0,y:50}}
                        key={index}
                        className={currentChat === id ? "active" : ""}
                        onClick={() => setCurrentChat(id)}
                      >
                        <img
                          src={profile??user}
                          alt="user"
                          className="profile-img-upload"
                        />
                        <div>
                          <p className="user-name">{name}</p>
                          <p className="last-message">{email}</p>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </>
            )
          ) : null}
          {/* chat container start */}
          <p className="side-bar-topic ternary-topic">Chats</p>
          <ul>
            {sidebarData?.map(
              ({ name, lastmessage, id, active, profile,image,location,group }, index) => {
                return (
                  <motion.li
                  transition={{delay:.2*index,ease: [0.6, 0.04, 0.98, 0.34] }}
                  initial={{opacity:0,y:100}}
                  animate={{opacity:1,y:0}}
                  exit={{opacity:0,y:-100}}
                    key={index}
                    className={currentChat === id ? "active" : ""}
                    onClick={() => setCurrentChat(id)}
                  >
                    <UserImgCon
                     isGroup={group}
                      profile={profile}
                      // status={active ? "currently-active" : ""}
                      id={id}
                    />
                    <div>
                      <p className="user-name">{name}</p>
                      <p className="last-message">{lastmessage}</p>
                      {image? <div className="d-flex align-items-center"><img src={imageplaceholder} alt="imageplaceholder" className="image-placeholder"/> <p>Photos</p></div>:null}
                      {location? <div className="d-flex align-items-center"><img src={loctioinplaceholderImg} alt="imageplaceholder" className="image-placeholder"/> <p>Location</p></div>:null}
                    </div>
                  </motion.li>
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
                  ?.map(({ active, id, lastmessage, name, profile,group },index) => {
                    return (
                      <div className="d-flex align-items-center" key={index}>
                        <UserImgCon
                         isGroup={group}
                          profile={profile}
                          id={id}
                        />
                        <p className="user-name">{name}</p>
                      </div>
                    );
                  }))()}
              <div className="ml-auto">
          
              <button type="button" className="group-btn" data-bs-toggle="modal" data-bs-target="#groupCreation"><img src={GroupImg} alt="GroupImg" /></button>
              </div>
            </div>
            <div className="chat-body" ref={ulElement}>
              {
                (()=>{
                  const {createdBy,description,group,profile,createdAt}=currentChatData;
                  
                 return createdBy&& <div className="unique-date mb-2">
                          <p>{createdBy} at {createdAt&&new Date(createdAt).toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</p>
                        </div>
                }
                )()
              }
              {(() => {
                const messsage = [];
                const renderDateArr: string[] = [];
                const {createdBy,description,group,profile}=currentChatData
                let renderDate = "";
                for (const [
                  index,
                  { type, message, createdAt, id,image ,location,},
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
                  const received=type === "received";
                  (id&& messsage.push(
                    <Fragment key={index}>
                      {renderDate && (
                       createdAt&& <div className="unique-date">
                          <p>{renderDate}</p>
                        </div>
                      )}
                      {createdAt&&
                        <div
                        className={
                          received
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
                                  onClick={() =>group?deletGroupMsg(id): deleteMsg(id)}
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
                        <motion.div
                        transition={{delay:.1*index,ease: [0.6, 0.04, 0.98, 0.34] }}
                        initial={{opacity:0,x:received?-100:100}}
                        animate={{opacity:1,x:0}}
                        exit={{opacity:0,x:received?100:100}}
                         className="message-con">
                         
                          {
                            message&&<p className="message">{message}</p>
                          }
                          {image &&<div className="uploaded-img-con">
                          <img src={image} alt="" />
                          </div>}
                          {
                            location?.coordinates?.length? <div className="map-con"><MapCom {...location.coordinates}/></div>:null
                          }
                          <p className="message-time">
                            {createdAt&&shortTime?.format(new Date(createdAt))}
                          </p>
                        </motion.div>
                      </div>}
                    </Fragment>
                  ))
                  renderDateArr.push(date);
                }
                return messsage;
              })()}

              <form
                onSubmit={formSubmitFunc}
                className="user-message-conatiner"
              >
                {
                  location.length ? <div className="show-img-con">
                  <img src={loctioinplaceholderImg} alt="loctioinImg" className="location-img"/>
                 Share the current location <button type="button" className="cancel-img" onClick={()=>setLocation([])}><img src={cancel} alt="cancel" /></button>
                  </div>:null
                }
                {preview &&<div className="show-img-con">
                  <img src={(preview as any)} alt="preview"  className="preview-img-upload"/>
                  </div>}
                <div className="send-form-con">
                <input
                  type="text"
                  className="message-input"
                  value={userSendMessage}
                  placeholder="Type your Message here..."
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUserSendMaessage(e.target?.value)
                  }
                />
                <button type="button" className="location-btn" onClick={getLocation}>
                  <img src={loctioinImg} alt="loctioinImg" />
                </button>
                <label htmlFor="upload-img" className="upload-img-label">
                  <img src={link} alt="link" className="loader-img" />
                </label>
                <input type="file" id="upload-img" accept="image/*" onChange={imageUpload} />
                {isLoading ? (
                  <img src={dotLoader} alt="" className="loader-img" />
                ) : (
                  <button type="submit" className="send-btn">Send</button>
                )}
                </div>
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
    :
    <Skeleton/>
    }
    
  </div>
   <Modal/>  
  </>
  );
};

export default Chat;
