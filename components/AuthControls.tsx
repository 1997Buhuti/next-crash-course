"use client";

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function AuthControls() {
  return (
    <div className="flex items-center gap-3">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button
            type="button"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
          >
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button
            type="button"
            className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-white/90"
          >
            Sign up
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "size-9",
            },
          }}
        />
      </Show>
    </div>
  );
}
