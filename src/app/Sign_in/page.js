"use client";

import "@/style/globals.css"
import {useState} from "react";
import Link from "next/link"
import {UsernameValidation} from "@/components/validation/username";
import {PasswordValidation} from "@/components/validation/password";

export default function User(){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userError, setUserError] = useState("");
  const [passError, setPassError] = useState("");

  const isValid = !userError && !passError && username !== "" && password !== "";

  const handleSubmit = (e) => {
    e.preventDefault();

    if(isValid){
      alert("HI");
    }
  }

  return(
    <div className="signHeader">
      <h1>Sign in</h1>
      <div className="aligning">
        <form className="form" onSubmit={handleSubmit}>
          <UsernameValidation
            username={username}
            setUsername={setUsername}
            userError={userError}
            setUserError={setUserError}
          />
          <PasswordValidation
            password={password}
            setPassword={setPassword}
            passError={passError}
            setPassError={setPassError}
          />
          <div className="rightSide">
            <button 
            className= {isValid ? "submitOn" : "submit"}
            disabled = {!isValid}
            type="submit"
            >Sign In</button>
          </div>
        </form>
        <div className="signUp">
          <Link href ={"/Sign_up"}>Click Here To Sign Up</Link>
        </div>
      </div>
    </div>
  );  
}