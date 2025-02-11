import { SocketProvider } from "@/socket/SocketContext";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Outlet } from "react-router-dom";

function InterviewLayout() {
  return (
    <>
      {/* Redirect to sign-in only if the user is signed out */}
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      {/* Render the app only if signed in */}
      <SignedIn>
        <SocketProvider>
          <Outlet />
        </SocketProvider>
      </SignedIn>
    </>
  );
}

export default InterviewLayout;
