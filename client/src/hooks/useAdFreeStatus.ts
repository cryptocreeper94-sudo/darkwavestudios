import { useState, useEffect } from "react";

export function useAdFreeStatus() {
  const [isAdFree, setIsAdFree] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("tl-sso-token") || localStorage.getItem("signal_chat_token");
    let userData = localStorage.getItem("signal_chat_user");

    if (!token) {
      setIsAdFree(false);
      setLoading(false);
      return;
    }

    if (!userData && token) {
      fetch("/api/chat/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            localStorage.setItem("signal_chat_user", JSON.stringify(data.user));
            checkSubscription(data.user.email);
          } else {
            setIsAdFree(false);
            setLoading(false);
          }
        })
        .catch(() => {
          setIsAdFree(false);
          setLoading(false);
        });
      return;
    }

    try {
      const user = JSON.parse(userData!);
      if (user.email) {
        checkSubscription(user.email);
      } else {
        setLoading(false);
      }
    } catch {
      setIsAdFree(false);
      setLoading(false);
    }
  }, []);

  const checkSubscription = (email: string) => {
    fetch(`/api/subscription/status?email=${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(data => {
        setIsAdFree(data.adFree === true);
        setLoading(false);
      })
      .catch(() => {
        setIsAdFree(false);
        setLoading(false);
      });
  };

  const startCheckout = async () => {
    const userData = localStorage.getItem("signal_chat_user");
    if (!userData) {
      window.location.href = "/chat";
      return;
    }

    try {
      const user = JSON.parse(userData);
      const res = await fetch("/api/subscription/ad-free/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email })
      });
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return { isAdFree, loading, startCheckout };
}
