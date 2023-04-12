import { useState } from "react";

const SignUp = () => {
  interface signUpInterface {
    type: string;
    name: string;
    value?:string
  }
  const [signUpdetail, setSignUpdetail] = useState<signUpInterface[]>([
    {
      type: "text",
      name: "userName",
    },
    {
      type: "email",
      name: "userEmail",
    },
    {
      type: "password",
      name: "userPassword",
    },
  ]);

  function inputChange(trigger:string,value:string){
    const filterData=signUpdetail.findIndex(({name})=>name===trigger);
    // filterData[0]['value']=value;
    setSignUpdetail([...signUpdetail,filterData]);
  }
  console.log(signUpdetail);
  
  function registerSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
  }
  return (
    <section className="sign-screen">
      <form action="" onSubmit={registerSubmit}>
        <p>Sign Up</p>
        {signUpdetail.map(({ name, type,value },index:number) => (
          <input key={index} type={type} value={value} className="log-input" onChange={(e:React.ChangeEvent<HTMLInputElement>)=>inputChange(name,e.target.value)} />
        ))}
        <button type="submit" className="log-btn">
          SignUp
        </button>
      </form>
    </section>
  );
};

export default SignUp;
