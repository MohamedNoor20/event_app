export function UsernameValidation({username, setUsername, userError, setUserError}){
  const regex = /^[^\s@]{3,}@[^@\s\d]+\.[^@\s\d]+$/;

  const handleChange = (e) => {
    const value = e.target.value;
    setUsername(value)

    if(value.length ===0){
      setUserError("");
    }
    else if(!regex.test(value)){
      const name = value.split("@");
      if(name[0].length < 3){
        setUserError("User name most contain 3 charcter");
      }
      else{
        setUserError("Invalid email format");
      }
      
    }
    else{
      setUserError("");
    }
  };

  return(
    <div className="inputArea">
      <input
        type="email"
        placeholder="name@domain.com"
        value={username}
        onChange={handleChange}
        />
      {userError && <p>{userError}</p>}
    </div>
  );

}