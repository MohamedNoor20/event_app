"use client";

import "@/style/globals.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UsernameValidation } from "@/components/validation/username";
import { PasswordValidation } from "@/components/validation/password";

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

      router.replace("/events");
      
    } catch (err) {
      setServerError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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

          {/* Show server-side errors (e.g. wrong credentials) */}
          {serverError && <p className="errorMsg">{serverError}</p>}

          <div className="rightSide">
            <button
              className={isValid ? "submitOn" : "submit"}
              disabled={!isValid || loading}
              type="submit"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="signUp">
          <Link href={"/sign/up"}>Click Here To Sign Up</Link>
        </div>
      </div>
    </div>
  );
}