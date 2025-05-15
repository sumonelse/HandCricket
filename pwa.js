// Register service worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./service-worker.js")
            .then((registration) => {
                console.log(
                    "ServiceWorker registration successful with scope: ",
                    registration.scope
                )
            })
            .catch((error) => {
                console.log("ServiceWorker registration failed: ", error)
            })
    })
}

// Add install prompt
let deferredPrompt
const installButton = document.createElement("button")
installButton.style.display = "none"
installButton.classList.add("install-button")
installButton.textContent = "Install App"

// Add the install button to the welcome container
window.addEventListener("load", () => {
    const welcomeContainer = document.getElementById("welcome-container")
    if (welcomeContainer) {
        welcomeContainer.appendChild(installButton)
    }
})

window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault()
    // Stash the event so it can be triggered later
    deferredPrompt = e
    // Update UI to notify the user they can add to home screen
    installButton.style.display = "block"
})

installButton.addEventListener("click", (e) => {
    // Hide our user interface that shows our install button
    installButton.style.display = "none"
    // Show the install prompt
    deferredPrompt.prompt()
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt")
        } else {
            console.log("User dismissed the install prompt")
        }
        deferredPrompt = null
    })
})
