
export function PasswordValidation({password, setPassword, passError, setPassError}){
  const regex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).{8,}$/;

  const handleChange = (e) => {
    const value = e.target.value;
    setPassword(value)

    if(value.length === 0){
      setPassError("");
    }
    else if(value.length < 8){
      setPassError(`${value.length}/8`) 
    }
    else if(!regex.test(value)){
      setPassError("Invalid password format, password most contain Capital, Small letters and special charcter");
    }
    else{
      setPassError("");
    }
  };

  return(
    <div className="inputArea">
      <input 
      type="password" 
      value={password}
      placeholder="Password" 
      onChange={handleChange}/>
      {passError && <p>{passError}</p>}
    </div>
  );
}