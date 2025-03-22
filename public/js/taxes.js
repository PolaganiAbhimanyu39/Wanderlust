let toggle = document.getElementById("flexSwitchCheckReverse");
let prices = document.getElementsByClassName("price");
const scrollContainer = document.querySelector(".filterSet"); // Adjusted to actual scrollable container
const leftBtn = document.getElementById("s-left");
const rightBtn = document.getElementById("s-right");
icon_state = "off";
let originalPrices = [];
let idx;
let modifiedPrice = '';
let state = "off";
for(let price of prices)
{
    let newp = price.textContent.replace(',',"");
    for(let char of newp)
    {
        if(char>='0' && char<='9')
        {
            modifiedPrice+=char;
        }
    }   
    originalPrices.push(modifiedPrice);
    modifiedPrice='';
}

const updateButtonVisibility = () => {
    // Buffer to account for minor pixel discrepancies
    const buffer = 5;

    // Check if at left extreme
    if (scrollContainer.scrollLeft <= buffer) {
        leftBtn.style.visibility = "hidden";
    } else {
        leftBtn.style.visibility = "visible";
    }

    // Check if at right extreme
    if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - buffer) {
        rightBtn.style.visibility = "hidden";
    } else {
        rightBtn.style.visibility = "visible";
    }
};

// Initial check on page load
updateButtonVisibility();

// Scroll event listener to update button visibility
scrollContainer.addEventListener("scroll", updateButtonVisibility);

leftBtn.addEventListener("click", () => {
    scrollContainer.scrollBy({ left: -500, behavior: "smooth" });
    console.log("swipe left");
});

rightBtn.addEventListener("click", () => {
    scrollContainer.scrollBy({ left: 500, behavior: "smooth" });
    console.log("swipe right");
});

toggle.addEventListener("click",()=>{
    if(state==="off")
    {
        console.log("toggle");
        for(price of prices)
            {
                let newp = price.textContent.replace(',',"");
                for(let char of newp)
                {
                    if(char>='0' && char<='9')
                    {
                        modifiedPrice+=char;
                    }
                }
                modifiedPrice*=1.18;
                price.innerHTML = `₹${modifiedPrice.toLocaleString("en-IN")} /night&emsp;<i>(Including 18%GST)</i>`;
                modifiedPrice='';
            }
        state="on";
    }
    else
    {
       idx=0; 
        for(price of prices)
        {
            price.innerHTML = `₹${originalPrices[idx].toLocaleString("en-IN")}&nbsp;/night`;
            idx++;
        }
        state="off";
    }
});