"use client";

import "@/style/globals.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UsernameValidation } from "@/components/validation/username";
import { PasswordValidation } from "@/components/validation/password";
import { Navbar } from "@/components/nav/nav";

export default function User() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userError, setUserError] = useState("");
  const [passError, setPassError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const isValid =
    !userError && !passError && username !== "" && password !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setServerError("");

    try {
      const res = await fetch("/api/auth/in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message);
        return;
      }

      router.replace("/Event");
      
    } catch (err) {
      setServerError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pageContainer">
      <div className="contentWrapper">

        {/* Login Card */}
        <div className="form-container">
          <div className="cardCentered" style={{ padding: "0 0 2rem 0", background: "transparent" }}>
            <h1 className="headerTitle">Sign In</h1>
          </div>

          <form onSubmit={handleSubmit}>
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

            {/* Show server-side errors */}
            {serverError && <p className="error-message">{serverError}</p>}

            <div className="actionButtonsCenter">
              <button
                className={isValid && !loading ? "btn-primary btnLarge" : "submit btnLarge"}
                disabled={!isValid || loading}
                type="submit"
                style={{ width: "100%" }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="actionButtonsCenter mt1">
            <Link href={"/sign/up"} style={{ color: '#000000', fontWeight: 'bold' }}>
              Don't have an account? Sign Up Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}