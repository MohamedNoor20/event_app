import "@/style/globals.css";
import Link from "next/link";
import {Navbar} from "@/components/nav/nav";
import {UserInfo} from "@/components/UserInfo";

export default function Home(){
  return(
    <div>
      <h1>Home Page</h1>
      
      <div>
        <UserInfo/>
        <Navbar/>
      </div>
    </div>
  );
}