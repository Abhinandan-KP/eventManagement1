/**
 * Evently Core Logic
 * Handles data persistence and UI rendering for a premium user experience.
 */

document.addEventListener('DOMContentLoaded', () => {
    const eventsContainer = document.getElementById("main") || document.getElementById("event-grid");
    const fileInput = document.getElementById("fileInput");
    const preview = document.getElementById("preview");
    const uploadPlaceholder = document.getElementById("uploadPlaceholder");

    // --- 1. RENDER EVENTS (For index.html and events.html) ---
    if (eventsContainer) {
        const storedEvents = JSON.parse(localStorage.getItem("box-content")) || [];
        
        // Clear skeleton loaders if any
        eventsContainer.innerHTML = "";

        if (storedEvents.length === 0) {
            eventsContainer.innerHTML = `<div class="col-span-full py-20 text-center text-gray-400">No events found.</div>`;
        }

        storedEvents.forEach((event) => {
            const card = document.createElement("div");
            // Modern "Human" classes for smooth lifting and shadow
            card.className = "group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 cursor-pointer";
            
            const mediaHtml = event.type.startsWith("image/")
                ? `<img src="${event.src}" class="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110">`
                : `<video src="${event.src}" class="w-full h-64 object-cover"></video>`;

            card.innerHTML = `
                <div class="relative overflow-hidden">
                    ${mediaHtml}
                    <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span class="text-white font-semibold px-6 py-2 border border-white rounded-full backdrop-blur-sm">Register Now</span>
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-900">New Community Event</h3>
                    <p class="text-gray-500 text-sm mt-2 leading-relaxed">Join this event to connect with like-minded individuals in your area.</p>
                </div>
            `;

            card.addEventListener("click", () => {
                // Smooth transition instead of 'confirm'
                window.location.href = "register.html";
            });

            eventsContainer.appendChild(card);
        });
    }

    // --- 2. HANDLE FILE UPLOADS (For create.html) ---
    if (fileInput) {
        fileInput.addEventListener("change", function (e) {
            const file = e.target.files[0];
            if (!file) return;

            // Human-centric check: Don't let users crash their local storage with giant files
            if (file.size > 2 * 1024 * 1024) { // 2MB limit for LocalStorage
                alert("File is too large. Please choose an image under 2MB.");
                return;
            }

            const reader = new FileReader();
            
            // Show a "Processing" state
            if (uploadPlaceholder) uploadPlaceholder.innerHTML = `<p class="text-sm animate-pulse">Processing your media...</p>`;

            reader.onload = function (event) {
                const fileData = { 
                    src: event.target.result, 
                    type: file.type,
                    id: Date.now() 
                };

                // Save to LocalStorage
                let storedEvents = JSON.parse(localStorage.getItem("box-content")) || [];
                storedEvents.push(fileData);
                localStorage.setItem("box-content", JSON.stringify(storedEvents));

                // Show preview immediately for instant feedback
                if (preview) {
                    preview.classList.remove("hidden");
                    uploadPlaceholder.classList.add("hidden");
                    preview.innerHTML = file.type.startsWith("image/") 
                        ? `<img src="${event.target.result}" class="rounded-2xl max-h-64 mx-auto shadow-lg">`
                        : `<video src="${event.target.result}" controls class="rounded-2xl max-h-64 mx-auto"></video>`;
                }

                // Wait a moment so the human user can see their upload before redirecting
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1200);
            };

            reader.readAsDataURL(file);
        });
    }
});
