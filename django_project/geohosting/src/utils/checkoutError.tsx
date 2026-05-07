import React from "react";
import { toast } from "react-toastify";

export const checkout_error_handler = (error: unknown) => {
  // @ts-ignore
  const message = error?.response?.data;
  if (message && message.includes('/#/dashboard/profile')) {
    toast.error(
      <span>
        Your profile is incomplete. Please{" "}
        <a href="/#/dashboard/profile" style={{ textDecoration: "underline" }}>
          update your profile
        </a>{" "}
        and try again.
      </span>
    );
  } else if (message) {
    toast.error(<span>{message}</span>);
  } else {
    toast.error("Checkout failed. Please try again later.");
  }
};