// Function to load sizes and colors for a specific gem from Firestore and display in watchlist
async function loadSizes(gemName) {
    const watchlist = document.getElementById("watchlist");
    watchlist.innerHTML = `<p>Loading sizes and colors for ${gemName}...</p>`;

    try {
        const sizesCollection = collection(db, "gems", gemName, "sizes");
        const querySnapshot = await getDocs(sizesCollection);
        watchlist.innerHTML = "";

        // Iterate through each size document
        for (const doc of querySnapshot.docs) {
            const sizeName = doc.id;
            const colorsCollection = collection(db, "gems", gemName, "sizes", sizeName, "colors");

            // Create a container for the size item
            const sizeItem = document.createElement("div");
            sizeItem.classList.add("watchlist-item");
            sizeItem.innerHTML = `<div class="stock-name">${sizeName}</div>`;

            // Retrieve the colors for this size
            try {
                const colorsSnapshot = await getDocs(colorsCollection);
                const colors = [];
                colorsSnapshot.forEach(colorDoc => {
                    colors.push(colorDoc.id); // Assuming the document ID represents the color name
                });

                // Display the colors
                if (colors.length > 0) {
                    const colorsContainer = document.createElement("div");
                    colorsContainer.classList.add("colors-container");

                    colors.forEach(color => {
                        const colorItem = document.createElement("span");
                        colorItem.classList.add("color-item");
                        colorItem.style.backgroundColor = color; // Assuming color is a valid CSS color
                        colorItem.title = color; // Display the color name on hover
                        colorsContainer.appendChild(colorItem);
                    });

                    sizeItem.appendChild(colorsContainer);
                } else {
                    const noColors = document.createElement("div");
                    noColors.innerText = "No colors available";
                    sizeItem.appendChild(noColors);
                }
            } catch (colorError) {
                console.error(`Error loading colors for size ${sizeName}:`, colorError);
            }

            // Append the size item to the watchlist
            watchlist.appendChild(sizeItem);
        }
    } catch (error) {
        console.error(`Error loading sizes for ${gemName}:`, error);
        watchlist.innerHTML = `<p>Error loading sizes for ${gemName}. Please try again later.</p>`;
    }
}
