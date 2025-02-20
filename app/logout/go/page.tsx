"use client";

import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

const LogoutNow = () => {
	signOut().then(() => {
	  redirect('/');
	});

  return <div>Logging out...</div>;
};

export default LogoutNow;