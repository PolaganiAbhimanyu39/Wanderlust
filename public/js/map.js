        let displayMap = async ()=>{ 
        // console.log(address);
        const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${mapKey}`);
        const geocodingResult = await response.json();
      
        if (geocodingResult.features.length > 0) 
        {
          // console.log(geocodingResult);
          const long = geocodingResult.features[0].geometry.coordinates[0];
          const lat = geocodingResult.features[0].geometry.coordinates[1];
          // console.log(lat,"..",long);
          // Initialize the map inside the async function after getting coordinates
          const map = L.map('map').setView([lat, long], 13); // [latitude, longitude], zoom level
      
          // Add Geoapify map tiles
          L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${mapKey}`, {
            attribution: '&copy; <a href="https://www.geoapify.com/">Geoapify</a> contributors',
          }).addTo(map);
      ;
          // Add a marker at the geocoded location
          L.marker([lat, long]).addTo(map)
            .bindPopup(`Welcome to ${address}!`)
            .openPopup();
        }
        else 
        {
          console.error("No geocoding results found.");
        }
    }
    displayMap();

    function removeClassesOnBreakpoint(elements, classesToRemove, breakpoint) {
      const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    
      function handleBreakpointChange(event) {
        if (event.matches) {
          elements.forEach(element=>
            {
              classesToRemove.forEach(className => {
                element.classList.remove(className);
            });
            });
        } else {
          // If you want to add the classes back when the breakpoint is no longer met:
          elements.forEach(element=>
            {
              classesToRemove.forEach(className => {
                element.classList.add(className);
            });
            });
         }
      }
    
      // Initial check
      handleBreakpointChange(mediaQuery);
    
      // Listen for changes
      mediaQuery.addEventListener("change", handleBreakpointChange);
    
      // Return a function to remove the listener later if needed.
      return () => {
        mediaQuery.removeEventListener("change", handleBreakpointChange);
      };
    }
    
    // Example usage:
    const Elements = document.querySelectorAll(".main-show-content");
    const reviewElement = document.getElementById("review-show");
    const classesToRemove = ["offset-3"];
    const breakpoint = 1200; // Example breakpoint (adjust as needed)
    
    const removeListener = removeClassesOnBreakpoint(Elements, classesToRemove, breakpoint);
    
    // To remove the event listener later:
    // removeListener();