import { useState, useEffect } from "react";

export function useAdFreeStatus() {
  const [isAdFree, setIsAdFree] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("signal_chat_token");
    const userData = localStorage.getItem("signal_chat_user");

    if (!token || !userData) {
      setIsAdFree(false);
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.email) {
        fetch(`/api/subscription/status?email=${encodeURIComponent(user.email)}`)
          .then(res => res.json())
          .then(data => {
            setIsAdFree(data.adFree === true);
            setLoading(false);
          })
          .catch(() => {
            setIsAdFree(false);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    } catch {
      setIsAdFree(false);
      setLoading(false);
    }
  }, []);

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
