import useAutoLogout from "../../hooks/useAutoLogout";

function AutoLogoutWrapper() {
  useAutoLogout();

  return null; // Nothing to render
}

export default AutoLogoutWrapper;