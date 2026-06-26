import { useEffect } from "react";

const AUTO_LOGOUT_TIME = 60 * 1000 * 15; // 15 minute

function useAutoLogout() {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");

    // Notify all tabs
    localStorage.setItem("logout", Date.now());

    window.location.href = "/login";
  };

  useEffect(() => {
    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const updateActivity = () => {
      localStorage.setItem(
        "lastActivity",
        Date.now().toString()
      );
    };

    // Listen for logout from other tabs
    const syncLogout = (event) => {
      if (event.key === "logout") {
        window.location.href = "/login";
      }
    };

    window.addEventListener("storage", syncLogout);

    updateActivity();

    events.forEach((event) =>
      window.addEventListener(event, updateActivity)
    );

    const interval = setInterval(() => {
      const lastActivity = parseInt(
        localStorage.getItem("lastActivity") || "0"
      );

      if (
        Date.now() - lastActivity >
        AUTO_LOGOUT_TIME
      ) {
        logout();
      }
    }, 5000);

    return () => {
      clearInterval(interval);

      window.removeEventListener(
        "storage",
        syncLogout
      );

      events.forEach((event) =>
        window.removeEventListener(
          event,
          updateActivity
        )
      );
    };
  }, []);
}

export default useAutoLogout;