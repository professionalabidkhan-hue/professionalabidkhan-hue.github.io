function secureLogout() {
    localStorage.clear();
    sessionStorage.clear();
    alert("Vault Secured. Identity Cleared.");
    window.location.replace("signin.html");
}
