import "@/style/globals.css"
import Link from "next/link"

export default function Home(){
  return(
    <div>
      <h1>Home Page</h1>
      <Link href ={"/Sign_up"}>Sign Up</Link>
      <p></p>
      <Link href ={"/Sign_in"}>Sign In</Link>
    </div>
  );
}