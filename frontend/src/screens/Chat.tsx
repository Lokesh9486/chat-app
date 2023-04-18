import user from "../assets/images/user.png";
const Chat = () => {
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
            {[...Array(3)].map((_, index) => {
              return (
                <li>
                  <img src={user} alt="user" className="profile-img-upload" />
                  <div>
                    <p className="user-name">Felecia Rower</p>
                    <p className="last-message">I will purchase it for sure </p>
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
            <p className="user-name">Felecia Rower</p>
          </div>
        </div>
        <div className="chat-body">
           <div className="other-chat-list">
            <img src={user} alt="user" className="profile-img-upload"/>
            <p className="message">How can i purchase it ?</p>
           </div>
           <div className="user-chat-list">
            <p className="message">How can i purchase it ?</p>
            <img src={user} alt="user" className="profile-img-upload"/>
           </div>
           <div className="user-message-conatiner">
           <input type="text" className="message-input" placeholder="Type your Message here..."/>
           <button type="submit">Send</button>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Chat;
