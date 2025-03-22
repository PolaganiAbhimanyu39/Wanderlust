let input = document.querySelector(".search-tab");
let listingsContainer = document.getElementById("listingsCOntainer");
let classes = ["row-cols-xs-1","row","row-cols-lg-3","row-cols-md-2","row-cols-sm-1"];

input.addEventListener("input", async (evt) => {
    let query = evt.target.value;
    if(query!="")
    {
        try {
            const response = await fetch(`/listings?query=${query}`); // Send query to backend
            if (!response.ok) {
                listingsContainer.classList.remove(...classes);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // console.log(response)
            const results = await response.json();
            displayResults(results); // Display results in the container
    
        } catch (error) {
            console.error("Error fetching search results:", error);
            let message = "Error servicing your requests";
            listingsContainer.innerHTML = 
            `<div class="row">
                <div class="alert alert-info col-6 offset-3" role="alert">
                    <h4 class="alert-heading">${message}</h4>
                </div>
            </div>`
        }
    }
});
function displayResults(results) {
    if (!(listingsContainer === null)) {
        classes.forEach(className=>{
            if(!listingsContainer.classList.contains(className)) listingsContainer.classList.add(className);
        })
        listingsContainer.innerHTML = ""; // Clear previous results
        console.log(classes);
        if (results.length === 0) {
            message = "No listings found for your query";
            listingsContainer.classList.remove(...classes);
            listingsContainer.innerHTML = 
                        `<div class="row">
                            <div class="alert alert-info col-6 offset-3" role="alert">
                                <h4 class="alert-heading">${message}</h4>
                            </div>
                        </div>`
            return;
        }

        results.forEach(listing => {
            const resultItem = document.createElement("a"); // Make it an <a> tag
            resultItem.href = `/listings/${listing._id}`; // Set the href
            resultItem.classList.add("listing-link"); // Add the same class for styling

            resultItem.innerHTML = `
            <div class="card col">
                <img src="${listing.image.url}" class="card-img-top" alt="listing_image" style="height: 20rem;">
                <div class="card-img-overlay"></div>
                <div class="card-body">
                    <p class="card-text"><b>${listing.title}</b></p>
                    <p class="card-text price"> &#8377; ${listing.price.toLocaleString("en-IN")} /night</p>
                </div>
            </div>`;

            listingsContainer.appendChild(resultItem);
        });
    }
}