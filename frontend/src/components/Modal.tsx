import { FormEvent, useState,ChangeEvent, useEffect, useRef, MutableRefObject } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getModalShow, modalAction } from "../features/auth";
import { getAllUser, signUpInterface } from "../types";
import searchIcon from "../assets/images/seacrh.png";
import userImage from "../assets/images/user.png";
import tickImg from "../assets/images/tick.png";
import chipCancel from "../assets/images/chipcancel.png";
import { useCreateGroupMutation, useGetAllUserQuery } from "../app/groupApi";
import selectFileImage from "../assets/images/selectImage.png"


const Modal = () => {
  const [signUpdetail, setSignUpdetail] = useState<signUpInterface[]>([
    {
      type: "text",
      name: "group_name",
      value: "",
      palceholder: "Group Name",
      error: false,
      errMessage:"Name must contain 3-15 character"
    },
    {
      type: "text",
      name: "description",
      value: "",
      palceholder: "Description",
      error: false,
      errMessage:"Please enter description"
    },
  ]);
  const [participants,setparticipants]=useState<getAllUser[]>([]);
  const [proifle,setProfile]=useState<any>(undefined);
  const [participantsError,setparticipantsError]=useState<boolean>(false);
  const [createGroup,{data:createGroupData,isSuccess,error}]=useCreateGroupMutation();
  const cancelButton=useRef<HTMLButtonElement | null>(null);
  
  function inputChange(trigger: string, value: string) {
    const filterData = signUpdetail.map((item) => {
      if (item.name === trigger) {
        item["value"] = value;
        return item;
      }
      return item;
    });
    setSignUpdetail(filterData);
  }

  function setparticipantsFunc(data:getAllUser){
    if(!participants.some(({_id}) =>  data._id===_id )){
      setparticipants([...participants,data]);
    }
  }

  function removeParticipants(id:string){
    setparticipants(participants.filter(({_id})=>_id!==id))
  }

  const fileOnChange=(e:ChangeEvent<HTMLInputElement>)=>{
    const reader=new FileReader();
    reader.onload=()=>{
      if(reader.readyState===2){
        setProfile(e.target.files?.[0]);
      }
    }
    if(e.target?.files){
      reader.readAsDataURL(e.target.files?.[0])
    }
  }
  
  function formSubmit(e:FormEvent){
    e.preventDefault();
    const errorFunc = (
      patt: RegExp,
      value: string | undefined,
      item: signUpInterface
    ) => {
      if (!value?.match(patt)) {
        item["error"] = true;
      } else {
        item["error"] = false;
      }
      return item;
    };
    const errorMap: signUpInterface[] = signUpdetail.map((item) => {
      const { type, value } = item;
      if (type === "text") {
        return errorFunc(/[a-zA-Z]{3,15}/, value, item);
      }
      return item;
    });
    setSignUpdetail(errorMap);
    const errorValu = errorMap.every(({ error }) => !error);
    const participantsCheck=participants.length>0&&participants.length<=10
    if(!participantsCheck){
      setparticipantsError(true);
    }
    else{
      setparticipantsError(false);
    }
    
    if (errorValu&&!participantsError) {
      const formData=new FormData();
      formData.append("name",signUpdetail[0].value)
      formData.append("description",signUpdetail[1].value)
      formData.append("image",proifle);
      formData.append("participance",JSON.stringify(participants.map(({_id})=>_id)));
      createGroup(formData);
    }

  }

  useEffect(()=>{
    if(isSuccess){
      cancelButton?.current?.click();
    }
  },[isSuccess])
  
  const {data}=useGetAllUserQuery();
  console.log(`Modal ~ data:`, data)
  // 34567891
  return (
<div className="modal fade" id="groupCreation" tabIndex={-1} >
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header border-0">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Create group</h1>
        <button type="button" ref={cancelButton} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form onSubmit={formSubmit}>
        {signUpdetail.map(
          ({ name, type, value, palceholder,error,errMessage}, index: number) => (
            <div className="position-relative" key={index}>
            <input
              type={type}
              value={value}
              placeholder={palceholder}
              className={`log-input ${error?"error":""}`}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                inputChange(name, e.target.value)
              }
            />
            {
             error && <p className="error-msg">{errMessage}</p>
            }
            </div>
          )
        )}
        <div className="log-input d-flex alig-items-center justify-content-between">
          {proifle&& <p>{proifle.name}</p>}
          <input type="file" accept="image/*" onChange={fileOnChange} className="d-none" id="inputGroupFile04"/>
          <label htmlFor="inputGroupFile04" className="select-img-label"><img src={selectFileImage} alt="selectFileImage" /></label>
       </div>
        <div className="search-user-con">
          <div className="position-relative">
          {/* <div className="input-con">
          <input type="text" className={participantsError?"error":""}  placeholder="Search participants"/>
          <button type="button"><img src={searchIcon} alt="searchIcon" />
          </button>
          </div> */}
          {
             participantsError && <p className="error-msg">select participants 1 to 10</p>
          }
          </div>
          
          <ul className="chip-con">
            {
              participants?.map(({_id,name,profile},index)=>{
             return <li  key={index}><img src={profile??userImage} className="user-logo" alt="userImage" />
             <span>{name}</span> 
             <button type="button" className="cancel-btn" onClick={()=>removeParticipants(_id)}>
              <img src={chipCancel} alt="" />
             </button>
            </li>
              })
            }
          </ul>
          <ul className="search-participants-con">
            {
           data? data.map(({name,email,_id,active,profile},index)=>{
            return <li onClick={()=>setparticipantsFunc({name,email,_id,active,profile})} key={index}>
              <img src={profile??userImage} alt="userImage" />
              <div>
               <span>{name}</span>
               <span>{email}</span>
              </div>
              <img src={tickImg} className="tick-img" alt="tickImg" /></li>
              }):
              <div className="skeleton">
                   {[...Array(4)].map((_, index) => (
                    <div className="split" key={index}>
                      <div className="user-round"></div>
                      <div className="w-100 d-flex alig-items-center flex-column gap-3">
                        <div className="input-straight"></div>
                        <div className="input-straight w-50"></div>
                      </div>
                    </div>
                  ))
                }
              </div>
          }
          </ul>
        </div>
        <button type="submit" className="create-btn">Create group</button>
        {error && <p>{(error as any)?.data}</p>}
        </form>
      </div>
    </div>
  </div>
</div>
  );
};

export default Modal;
