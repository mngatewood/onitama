"use client";

import { signOut } from "next-auth/react";

const LogoutNow = () => {
	signOut().then(() => {
	  window.location.href = '/';
	});

  return <div>Logging out...</div>;
};

export default LogoutNow;