const studentAppUrl =
  import.meta.env.VITE_STUDENT_APP_URL || "http://localhost:5180";

export function sendStudentAction(action) {
  if (window.parent === window) {
    const route = action === "login" ? "/login" : "/register";
    window.location.assign(new URL(route, studentAppUrl));
    return true;
  }

  window.parent.postMessage({ source: "tapnpay-landing-pages", action }, "*");
  return true;
}
