
import successIcon from "../assets/images/success.png";
export const SuccessMsg = ({isSuccess,message}:{isSuccess:boolean,message:string}) => {
  return (
    <div
      className={`message-con ${isSuccess?"active":""}`}
      >
        <img src={successIcon} alt="successIcon" />
        <div>
          <h5>Success</h5>
          <p>{message}</p>
        </div>
        </div>
  )
}
