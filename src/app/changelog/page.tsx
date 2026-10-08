import { redirect } from "next/navigation";

// The changelog lives on the Releases page (release notes per version).
export default function Changelog() {
  redirect("/releases#notes");
}
