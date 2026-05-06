"use client";

import "@/style/globals.css"
import {useState} from "react";
import Link from "next/link";
import {UsernameValidation} from "@/components/validation/username";
import {PasswordValidation} from "@/components/validation/password";
import {ReValidate} from "@/components/validation/reValidation";


export default function SignUp(){
  const [username, setUsername] = useState("");
  const [userError, setUserError] = useState("");
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [checkPass, setChekPass] = useState("");
  const [reError, setReError] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [errorFN, setErrorFN] = useState("");
  const [errorLN, setErrorLN] = useState("");

  const regex = /^[A-Za-z]+(?: [A-Za-z]+)?$/;

  const handleFN = (e) => {
    const value = e.target.value;
    setFirstname(value);

    if(value.length === 0){
      setErrorFN("");
    }
    else if(!regex.test(value)){
      setErrorFN("Only letter are allowed");
    }
    else{
      setErrorFN("");
    }
  };

  const handleLN = (e) => {
    const value = e.target.value;
    setLastname(value);

    if(value.length === 0){
      setErrorLN("");
    }
    else if(!regex.test(value)){
      setErrorLN("Only letter are allowed");
    }
    else{
      setErrorLN("");
    }
  };

  const isValid = userError === "" && passError === "" && reError === "" && username.trim() !== "" && password.trim() !== "" && checkPass.trim() !== "" && errorFN == "" && errorLN == "" && firstname.length > 1 && lastname.length > 1;

  const handleForm = (e) => {
    e.preventDefault();

    if(isValid){
      alert("hi");
    }
  };

  return(
    <div className="signHeader">
      <h1>Sign Up</h1>
      <div className="aligning">
        <form className="form" onSubmit={handleForm}>
          <div className="inputArea">
            <input
              type="text"
              value={firstname}
              placeholder="Firstname"
              onChange={handleFN}
              required
              
            ></input>
            {errorFN && <p>{errorFN}</p>}
          </div>
          <div className="inputArea">
            <input
              type="text"
              value={lastname}
              placeholder="Lastname"
              onChange={handleLN}
              required
            ></input>
            {errorLN && <p>{errorLN}</p>}
          </div>


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
          <ReValidate
            checkPass={checkPass}
            setChekPass={setChekPass}
            reError={reError}
            setReError={setReError}
            password={password}
          />
          <div className="rightSide">
            <button 
            className= {isValid ? "submitOn" : "submit"}
            disabled = {!isValid}
            type="submit"
            >Sign Up</button>
          </div>
        </form>
        <div className="signIn">
          <Link href ={"/Sign_in"}>Click Here To Sign In</Link>
        </div>
      </div>
    </div>
  );
}