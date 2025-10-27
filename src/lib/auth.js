export function saveToken(token) {
    localStorage.setItem("token", token);
  }
  export function getToken() {
    return localStorage.getItem("token");
  }
  export function clearAuth() {
    localStorage.removeItem("token");
  }
  export function isAuthed() {
    return !!localStorage.getItem("token");
  }
  // сохраняем пользователя (при регистрации/логине)
export function saveUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
  
  // получаем пользователя
  export function getUser() {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  