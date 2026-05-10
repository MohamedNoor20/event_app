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
    <div className="pageContainer">
      <div className="contentWrapper">


        {/* Sign Up Card */}
        <div className="form-container">
          <div className="cardCentered" style={{ padding: "0 0 2rem 0", background: "transparent" }}>
            <h1 className="headerTitle">Sign Up</h1>
            <p className="successText mt1">Create an account to start booking events.</p>
          </div>

          <form onSubmit={handleForm}>
            
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-input"
                value={firstname}
                placeholder="Firstname"
                onChange={handleFN}
                required
              />
              {errorFN && <p className="error-message" style={{ padding: '8px', marginTop: '5px', marginBottom: 0 }}>{errorFN}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-input"
                value={lastname}
                placeholder="Lastname"
                onChange={handleLN}
                required
              />
              {errorLN && <p className="error-message" style={{ padding: '8px', marginTop: '5px', marginBottom: 0 }}>{errorLN}</p>}
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

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-input"
                value={dob}
                onChange={handleDob}
                required
              />
              {dobError && <p className="error-message" style={{ padding: '8px', marginTop: '5px', marginBottom: 0 }}>{dobError}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="attendee">Attendee</option>
                <option value="organiser">Organiser</option>
              </select>
            </div>

            {serverError && <p className="error-message">{serverError}</p>}

            <div className="actionButtonsCenter">
              <button
                className={isValid && !loading ? "btn-primary btnLarge" : "submit btnLarge"}
                disabled={!isValid || loading}
                type="submit"
                style={{ width: "100%" }}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </div>
          </form>

          <div className="actionButtonsCenter mt1">
            <Link href={"/sign/in"} style={{ color: '#000000', fontWeight: 'bold' }}>
              Already have an account? Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}