"use client";

import "@/style/globals.css"
import {useState} from "react";
import Link from "next/link";
import {UsernameValidation} from "@/components/validation/username";
import {PasswordValidation} from "@/components/validation/password";
import {ReValidate} from "@/components/validation/reValidation";
import { useRouter } from "next/navigation";
import {Navbar} from "@/components/nav/nav"


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
  const [dob, setDob] = useState("");
  const [dobError, setDobError] = useState("");
  const [role, setRole] = useState("attendee");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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

  const handleDob = (e) => {
    const value = e.target.value;
    setDob(value);

    if (!value) {
      setDobError("Date of birth is required");
      return;
    }

    const today = new Date();
    const birthDate = new Date(value);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 16) {
      setDobError("You must be at least 16 years old");
    } else {
      setDobError("");
    }
  };

  const isValid = 
  userError === "" &&
  passError === "" &&
  reError === "" &&
  username.trim() !== "" &&
  password.trim() !== "" &&
  checkPass.trim() !== "" &&
  errorFN == "" &&
  errorLN == "" &&
  firstname.length > 1 &&
  lastname.length > 1 &&
  dob !== "" &&
  dobError === "";

  const handleForm = async (e) => {
    e.preventDefault();

    if(!isValid){
      return;
    }

    setLoading(true);
    setServerError("");

        try {
      const res = await fetch("/api/auth/up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname,
          lastname,
          username,
          password,
          dob,
          role,
        }),
      });
 
      const data = await res.json();
 
      if (!res.ok) {
        setServerError(data.message || "Something went wrong");
        return;
      }
 
      // send to login page
      router.push("/sign/in");
    } catch (err) {
      setServerError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }

  };

  return(
    <div className="signHeader">
      <h1>Sign Up</h1>
      <div>
        <Navbar/>
      </div>
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
        
          <div className="inputArea">
            <input
              type="date"
              value={dob}
              onChange={handleDob}
              required
            />
            {dobError && <p className="errorMsg">{dobError}</p>}
          </div>
 
          <div className="inputArea">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="attendee">Attendee</option>
              <option value="organiser">Organiser</option>
            </select>
          </div>
 
          {serverError && <p className="errorMsg">{serverError}</p>}
 
          <div className="rightSide">
            <button
              className={isValid ? "submitOn" : "submit"}
              disabled={!isValid || loading}
              type="submit"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </div>
        </form>
        <div className="signIn">
          <Link href ={"/sign/in"}>Click Here To Sign In</Link>
        </div>
      </div>
    </div>
  );
}