<<<<<<< HEAD
const BUTTONS_IDS = [
    "main", 
    "general", 
    "no-udfs", 
    "no-udfs-new",
    "no-udfs-old",
    "no-udfs-old-contact",
    "no-udfs-unfilled",
    "no-udfs-idk",
    "no-udfs-email",
    "request-udfs",
    "request-udfs-subject",
    "utilise",
    "utilise-cant-find",
    "utilise-error",
    "utilise-done",
    "utilise-check-id",
    "install",
    "install-help",
    "activation",
    "activation-quan",
    "activation-login",
    "activation-guide",
    "update",
    "update-blue",
    "update-black",
    "update-no-connect",
    "software"
];

loadPage("main.html");



function loadPage(filename) {
    fetch("pages/"+String(filename)).then(
        function(response) {return response.text();}
    ).then(
        function(htmlContent) {
            document.getElementById("content").innerHTML = htmlContent;
            addButtonListeners();
        }
    )
}

function addButtonListeners() {
    // const general = document.getElementById("general"); 
    // if (general) {
    //     general.addEventListener("click", function() {console.log("hi");loadPage("general.html")});
    // }
    for (const buttonId of BUTTONS_IDS) {
        const buttonElement = document.getElementById(buttonId); 
        if (buttonElement) {
            buttonElement.addEventListener("click", function() {console.log("hi");loadPage(buttonId+".html")});
        }
    }
}
=======
const BUTTONS_IDS = [
    "main", 
    "general", 
    "no-udfs", 
    "no-udfs-new",
    "no-udfs-old",
    "no-udfs-old-contact",
    "no-udfs-unfilled",
    "no-udfs-idk",
    "no-udfs-email",
    "request-udfs",
    "request-udfs-subject",
    "utilise",
    "utilise-cant-find",
    "utilise-error",
    "utilise-done",
    "utilise-check-id",
    "install",
    "install-help",
    "activation",
    "activation-quan",
    "activation-login",
    "activation-guide",
    "update",
    "update-blue",
    "update-black",
    "update-no-connect",
    "software"
];

loadPage("main.html");



function loadPage(filename) {
    fetch("pages/"+String(filename)).then(
        function(response) {return response.text();}
    ).then(
        function(htmlContent) {
            document.getElementById("content").innerHTML = htmlContent;
            addButtonListeners();
        }
    )
}

function addButtonListeners() {
    // const general = document.getElementById("general"); 
    // if (general) {
    //     general.addEventListener("click", function() {console.log("hi");loadPage("general.html")});
    // }
    for (const buttonId of BUTTONS_IDS) {
        const buttonElement = document.getElementById(buttonId); 
        if (buttonElement) {
            buttonElement.addEventListener("click", function() {console.log("hi");loadPage(buttonId+".html")});
        }
    }
}
>>>>>>> a27f7a6f429de7beaace2f82e51233bbd70bb18a
