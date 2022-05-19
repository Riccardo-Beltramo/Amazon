const tokenKey = "TOKEN";
const usernameKey = "USERNAME";
const role = "ROLE";
const cart = "CART";

export function logout() {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(usernameKey);
    localStorage.removeItem(role);
    localStorage.removeItem(cart);
}