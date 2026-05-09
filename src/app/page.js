import "@/style/globals.css"
import Link from "next/link"
import {Navbar} from "@/components/nav/nav"

export default function Home(){
  return(
    <div>
      <h1>Home Page</h1>
      <div>
        <Navbar/>
      </div>

      <Link href ={"/sign/up"}>Sign Up</Link>
      <p></p>
      <Link href ={"/sign/in"}>Sign In</Link>
    </div>
  );
}