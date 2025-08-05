const input = document.getElementById("fileInput");
const events = document.querySelector(".main");


if (events) {
    let main = JSON.parse(localStorage.getItem("box-content")) || [];
    main.forEach((Event) => {
        const newdiv = document.createElement("div");
        newdiv.classList.add("Event");
        newdiv.innerHTML = Event.type.startsWith("image/")
            ? `<img src="${Event.src}">`
            : `<video src="${Event.src}" controls></video>`;

        newdiv.addEventListener("click", function () {
            const action = confirm("Click OK to register");
            if (action) {
                window.location.href = "register.html";
            }
        });

        events.appendChild(newdiv);
    });
}

document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById("preview");
    preview.innerHTML = "";

    if (file) {
        const fileType = file.type;
        const reader = new FileReader();

        reader.onload = function (e) {
            const newEvent = { src: e.target.result, type: fileType };
            let storedEvents = JSON.parse(localStorage.getItem("box-content")) || [];
            storedEvents.push(newEvent);
            localStorage.setItem("box-content", JSON.stringify(storedEvents));

            if (fileType.startsWith("image/")) {
                const img = document.createElement("img");
                img.src = e.target.result;
                preview.appendChild(img);
            } else if (fileType.startsWith("video/")) {
                const video = document.createElement("video");
                video.src = e.target.result;
                video.controls = true;
                preview.appendChild(video);
            }
            setTimeout(() => {
                alert("Preview displayed successfully!");
            }, 2000);
            window.location.href = "index.html";
        };

        reader.readAsDataURL(file);
    }
});
