"use client";
import axios from "axios";
import { CreditCardIcon, Loader2, Settings } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

type Props = {
  isPro: boolean;
  style: "home" | "sidebar";
};

const SubscriptionButton = ({ isPro, style }: Props) => {
  const [loading, setLoading] = React.useState(false);

  const handleSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url.url;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (style === "sidebar") {
    return (
      <div
        className="flex items-center hover:text-gray-200"
        onClick={!loading ? handleSubscription : () => {}}
      >
        {!loading ? (
          !isPro ? (
            <CreditCardIcon className="mr-2" />
          ) : (
            <Settings className="mr-2" />
          )
        ) : (
          <Loader2 className="w-5 h-5 animate-spin" />
        )}
        {!isPro ? "Upgrade to Pro!" : "Manage Subscription"}
      </div>
    );
  }

  return (
    <Button disabled={loading} onClick={handleSubscription}>
      {isPro ? "Manage Subscription" : "Get Pro"}
    </Button>
  );
};

export default SubscriptionButton;
