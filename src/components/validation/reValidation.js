export function ReValidate({checkPass, setChekPass, reError,setReError, password}){

  const handleChange = (e) =>{
    const value = e.target.value;
    setChekPass(value);

    if(value.length === 0){
      setReError("");
    }
    else if(value.length < 8){
      setReError(`${value.length}/8`);
    }
    else if(value !== password){
      setReError("Passwords do not match");
    }
    else{
      setReError("");
    }
  };

  return(
    <div className="inputArea">
      <input
        type="password" 
        value={checkPass}
        placeholder="Password"
        onChange={handleChange}
        required
      ></input>
      {reError && <p>{reError}</p>}
    </div>
  );
}