import "@/style/globals.css"
import Link from "next/link"

export default function Home(){
  return(
    <div>
      <h1>Home Page</h1>
      <Link href ={"/sign/up"}>Sign Up</Link>
      <p></p>
      <Link href ={"/sign/in"}>Sign In</Link>
    </div>
  );
}