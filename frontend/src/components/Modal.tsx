import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getModalShow, modalAction } from "../features/auth";
import { signUpInterface } from "../types";

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
    {
      type: "password",
      name: "userPassword",
      value: "",
      palceholder: " password",
      error: false,
      errMessage:"Passwrod must contain 8-15 character"
    },
  ]);
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
  return (
<div className="modal fade" id="groupCreation" tabIndex={-1} aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header border-0">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Create group</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form action="">
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
        </form>
      </div>
    </div>
  </div>
</div>
  );
};

export default Modal;
