let products = [];
let cart = [];
let sliderDict = {};
let totalPrice = 0;
let changedPrice = true;
let subwrapper2HTMLcc6in = document.getElementById("cc_6in_wrapper");
let subwrapper2HTMLcc = document.getElementById("cc_wrapper");
let subwrapper2HTMLm = document.getElementById("m_wrapper");
let subwrapper2HTMLt = document.getElementById("t_wrapper");
let subwrapper = document.querySelector(".dainty-wrapper");
let cartListHTML = document.querySelector(".cart-list");
let iconCartCount = document.querySelector(".icon-cart span");

const mqMobile = window.matchMedia('(max-width: 900px)');


// Array of images for the product

function getSliderID(button) {
    sliderID = button.parentElement.parentElement.id;
    return sliderID;
}

function nextImage(button) {
    sliderID = getSliderID(button);
    slider = document.getElementById("slider"+ sliderID);

    if (!sliderDict.hasOwnProperty(sliderID)) { // if key DNE for this slider
        sliderDict[sliderID] = 0; // Initialize the index for this slider
    }

    images = slider.querySelectorAll('img'); // Get all images in the slider
    sliderDict[sliderID] = (sliderDict[sliderID] + 1) % images.length; // Loop to the first image
    console.log("current:" + sliderDict[sliderID] + " images:" + images.length);
    updateSlider(slider, sliderID);
}

function previousImage(button) {
    sliderID = getSliderID(button);
    slider = document.getElementById("slider"+ sliderID);

    if (!sliderDict.hasOwnProperty(sliderID)) { // if key DNE for this slider
        sliderDict[sliderID] = 0; // Initialize the index for this slider
    }

    images = slider.querySelectorAll('img'); // Get all images in the slider
    sliderDict[sliderID] = (sliderDict[sliderID] - 1 + images.length) % images.length; // Loop to the last image
    updateSlider(slider, sliderID);
}

function updateSlider(slider, sliderID) {
  const imgs = slider.querySelectorAll('img');
  const index = sliderDict[sliderID] ?? 0;

  const targetImg = imgs[index];
  const x = targetImg ? targetImg.offsetLeft : 0;

  slider.style.transform = `translateX(-${x}px)`;
}

function getItemNumber(id) {
    for (var i = 1; i < 9999999; i++){
        if (id == "item"+i)
            return i;
    }
    return "error out of range";  //returns 0 if no match found.
}

function getTotalPrice() {
    let totalPrice = 0;
    for (let i = 0; i < cart.length; i++) {
        totalPrice += getPriceValue(cart[i].selectedPrice) * cart[i].quantity;
    }
    return totalPrice;
}

function updateCartPrice() {
    if (changedPrice) {
        changedPrice = false;
        console.log("price:" + getTotalPrice());
        document.getElementById("TotalPriceCart").textContent = "Subtotal: " + getTotalPrice() + "$"
        console.log("price again:" + getTotalPrice());
        changedPrice = true;
    }
}

function myFunction(imgs) {
    //allocate var of parent section
    var item = imgs.parentElement.parentElement.parentElement.parentElement;
    var itemNumber = getItemNumber(item.id);

    deleteDefault(itemNumber);
    // Get the expanded image
    var expandImg = document.getElementById("expandedImg" + itemNumber);
    // Use the same src in the expanded image as the image being clicked on from the grid
    expandImg.src = imgs.src;
    // Use the value of the alt attribute of the clickable image as text inside the expanded image
    //imgText.innerHTML = imgs.alt;
    // Show the container element (hidden with CSS)
    //expandImg.parentElement.style.display = "block";
    //console.log(imgs.parentElement.parentElement.parentElement.parentElement);
}

function deleteDefault(idNumber) {
    var default_img = document.getElementById("default_img" + idNumber);
    //console.log(idNumber);

    if (default_img.style.display != "none") {
        default_img.style.display = "none";
    }
}

function showCart() {
    console.log("toggling cart");
    document.querySelector("body").classList.toggle("showCart");
}

const isHomePage = window.location.pathname.includes("index.html");
let ccfCount = 0;
const fallbackContainer = document.querySelector(".dainty-wrapper");

const addItemsToHTML = () => {
    // build a map of only the category targets that exist on this page
    const targets = {};
    if (subwrapper2HTMLcc6in) targets.cc6in = subwrapper2HTMLcc6in;
    if (subwrapper2HTMLcc)   targets.ccf   = subwrapper2HTMLcc;   // ccf -> cc_wrapper
    if (subwrapper2HTMLm)    targets.cci   = subwrapper2HTMLm;    // cci / cci_mobile -> m_wrapper
    if (subwrapper2HTMLt)    targets.t     = subwrapper2HTMLt;

    // if no category containers found on the page, bail out
    if (Object.keys(targets).length === 0) return;

    const isMobile = mqMobile.matches;

    if (products.length > 0) {
        products.forEach(element => {
            // normalize product type keys (treat cci_mobile as cci)
            const typeKey = element.type === 'cci_mobile' ? 'cci' : element.type;

            // if this page doesn't have a target for that type, skip this product
            if (!targets.hasOwnProperty(typeKey)) return;

            let newProduct = document.createElement("div");
            newProduct.dataset.id = element.id;
            newProduct.classList.add("showcase-item");

            if (element.type == "cc6in" || isMobile) {
                newProduct.innerHTML = `
                    <div class="full_cc_outer_container" id="${element.id}">
                            <div class="full_cc_container">
                                <div class="full_cc_slider-container">
                                    <div class="full_cc_slider" id="slider${element.id}">
                                        <img src="${element.a_image}" alt="Product Image">
                                        <img src="${element.b_image}" alt="Product Image">
                                        <img src="${element.c_image}" alt="Product Image">
                                    </div>
                                </div>
                                <button class="arrow left" onclick="previousImage(this)">&lt;</button>
                                <button class="arrow right" onclick="nextImage(this)">&gt;</button>
                            </div>
                        </div>
                    <h2>${element.name}</h2>
                    <h3>${element.description}</h2>
                    <div class="price">
                        <label class="cc_option" for="${element.price1}+${element.id}">
                            <input type="radio" value="${element.price1}" name="${element.id}" id="${element.price1}+${element.id}">
                            ${element.price1.replace("/half a dozen", "<sub>per 6</sub>")}
                        </label>
                        <label class="cc_option" for="${element.price2}+${element.id}">
                            <input type="radio" value="${element.price2}" name="${element.id}" id="${element.price2}+${element.id}">
                            ${element.price2.replace("/dozen", "<sub>per 12</sub>")}
                        </label>
                    </div>
                    <div class="cartbtn_container">
                        <button class="addCart">Add To Cart</button>
                    </div>
                `;
            } else {
                newProduct.innerHTML = `
                    <div class="multi-item-container" id="item${element.id}">
                        <div class="main_item_container">
                            
                            <img class="section1" id="default_img${element.id}" src="${element.a_image}" style="width: 100%;">
                            <!-- Expanded image -->
                            <img class="section1" id="expandedImg${element.id}" style="width:100%">

                        </div>
                        <!-- The grid: three rows-->
                        <div class="dainty-wrapper-container">
                            <div class="main_item_column">
                                <div class="main_item_row">
                                    <img src="${element.a_image}" alt="itemPic1" onclick="myFunction(this);">
                                </div>
                                <div class="main_item_row" id="middle_item_row">
                                    <img src="${element.b_image}" alt="itemPic2"  onclick="myFunction(this);">
                                </div>
                                <div class="main_item_row">
                                    <img src="${element.c_image}" alt="itemPic3" onclick="myFunction(this);">
                                </div>
                            </div>
                        </div>
                    </div>
                    <h2>${element.name}</h2>
                    <h3>${element.description}</h2>
                    <div class="price">
                        <label class="cc_option" for="${element.price1}+${element.id}">
                            <input type="radio" value="${element.price1}" name="${element.id}" id="${element.price1}+${element.id}">
                            ${element.price1.replace("/half a dozen", "<sub>per 6</sub>")}
                        </label>
                        <label class="cc_option" for="${element.price2}+${element.id}">
                            <input type="radio" value="${element.price2}" name="${element.id}" id="${element.price2}+${element.id}">
                            ${element.price2.replace("/dozen", "<sub>per 12</sub>")}
                        </label>
                    </div>
                    <div class="cartbtn_container">
                        <button class="addCart">Add To Cart</button>
                    </div>
                `;
            }

            // append to the correct existing target
            if (typeKey === "ccf") {
                // if there is no cc_wrapper on this page this won't run due to the earlier check
                if (isHomePage && ccfCount >= 3) return; // Skip extras on home page
                targets.ccf.appendChild(newProduct);
                ccfCount++;
            } else if (typeKey === "cci") {
                targets.cci.appendChild(newProduct);
            } else if (typeKey === "t") {
                targets.t.appendChild(newProduct);
            } else if (typeKey === "cc6in") {
                targets.cc6in.appendChild(newProduct);
            }
        });
    }
}

console.log(subwrapper);
subwrapper.addEventListener('click', (event) => {
    let clickPosition = event.target;
    if (clickPosition.classList.contains('addCart')) {
        const productId = clickPosition.parentElement.parentElement.dataset.id;
            
        // Get selected price option
        let selectedPriceOption = document.querySelector(`input[name="${productId}"]:checked`).value;
        
        addToCart(productId, selectedPriceOption);

        Swal.fire({
            title: "Item Added to Cart!",
            icon: "success"
        });
    }
});

const clearCart = () => {
    cart = [];
    addCartToHTML();
    addCartToMemory();
    updateCartPrice()
}

const addToCart = (productId, selectedPriceOption) => {
    // console.log("cart before:", cart);
    // console.log("Adding to cart:", productId, selectedPriceOption);
    let cartPos = cart.findIndex(item => item.productId === productId && item.selectedPrice === selectedPriceOption);
    // console.log("Cart position:", cartPos);
    
    if (cart.length <= 0) {
        cart = [{
            productId: productId,
            quantity: 1,
            selectedPrice: selectedPriceOption
        }];
    } else if (cartPos < 0) {
        cart.push({
            productId: productId,
            quantity: 1,
            selectedPrice: selectedPriceOption
        });
    } else {
        cart[cartPos].quantity++;
    }

    // console.log("cart:", cart);
    
    addCartToHTML();
    addCartToMemory();
    updateCartPrice()
};

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

const addCartToHTML = () => {
    cartListHTML.innerHTML = '';
    let totalProducts = 0;

    if (cart.length > 0) {
        cart.forEach(cartItem => {
            totalProducts += cartItem.quantity;
            let newCartItem = document.createElement("div");
            newCartItem.classList.add('item');
            newCartItem.dataset.productId = cartItem.productId;
            newCartItem.dataset.selectedPrice = cartItem.selectedPrice;

            let positionProduct = products.findIndex(value => value.id == cartItem.productId);
            let info = products[positionProduct];
            console.log(products);
            console.log(positionProduct);

            newCartItem.innerHTML = `
                <div class="item-image">
                    <img src="${info.a_image}" alt="itemPic1">
                </div>
                <div class="item-details">
                    <div class="item-category">
                        <strong>${info.category}</strong>
                    </div>
                    <div class="item-name">
                        Flavour: ${info.name}
                    </div>
                    <div class="item-price">
                        Cost: ${getPriceValue(cartItem.selectedPrice) * cartItem.quantity}$
                    </div>
                    <div class="item-quantity">
                        <span>
                            <button class="minus"><</button>
                            <h4 id="item-number">${cartItem.quantity}</h4>
                            <button class="plus">></button>
                        </span>
                    </div>
                </div>

            `;
            cartListHTML.appendChild(newCartItem);
        });
    }

    iconCartCount.innerText = totalProducts;
};

cartListHTML.addEventListener('click', (event) => {
    const positionClick = event.target;
    // find the nearest button/control the user meant to click
    //so when we look through control we look for .plus .minus .removebtn

    // find the cart item row that owns that control
    const itemEl = positionClick.closest('.item');
    if (!itemEl) return;

    // if product id doesnt exist, then projectid = null instead of an error
    const productId = itemEl?.dataset.productId;
    const selectedPrice = itemEl.dataset.selectedPrice;

    if (positionClick.classList.contains('minus')) {
    changeQuantityCart(productId, selectedPrice, 'minus');
    return;
    } else if (positionClick.classList.contains('plus')) {
    changeQuantityCart(productId, selectedPrice, 'plus');
    return;
    } else if (positionClick.classList.contains('removebtn')) {
        const positionItemInCart = cart.findIndex(
        (value) => value.productId == productId && value.selectedPrice === selectedPrice);

    if (positionItemInCart >= 0) cart.splice(positionItemInCart, 1);

    addCartToMemory();
    addCartToHTML();
    updateCartPrice();
    }
});

const getPriceValue = (priceString) => {
    return parseFloat(priceString.split('/')[0].replace(/[^0-9.]/g, '')); //so this takes the string and replaces all non ints with ""
};

const changeQuantityCart = (productId, selectedPrice, type) => {
    console.log(productId);
    let positionItemInCart = cart.findIndex((value) => value.productId == productId && value.selectedPrice === selectedPrice);
    if(positionItemInCart >= 0){
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;
        
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                }else{
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    console.log("here")
    addCartToMemory();
    addCartToHTML();
    updateCartPrice()
}

function redirectToPage(url) {
    window.location.href = url;
}

// ===== Mobile drawer menu =====
function toggleMenu(){
  document.body.classList.toggle('showMenu');
  const btn = document.getElementById('menuToggle');
  if (btn) {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', (!expanded).toString());
  }
}

const menuToggle = document.getElementById('menuToggle');
const menuClose  = document.getElementById('menuClose');

if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
if (menuClose)  menuClose.addEventListener('click', toggleMenu);

// Close the drawer after a nav tap (nice on mobile)
document.querySelectorAll('nav#mobileNav a').forEach(a => {
  a.addEventListener('click', () => {
    if (document.body.classList.contains('showMenu')) toggleMenu();
  });
});

// Optional: close on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.body.classList.contains('showMenu')) toggleMenu();
});

function send_customer_datatest(email,phone) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://your-server.com/api/submit_data', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
        }
    };
    xhr.send(JSON.stringify({ email: email, phone: phone }));
}


function attachSwipeHandlers() {
  const containers = document.querySelectorAll('.full_cc_slider-container');
  containers.forEach((cont) => {
    let startX = 0, curX = 0, tracking = false;

    // Let vertical page scroll work normally; only track horizontal swipes
    cont.style.touchAction = 'pan-y';

    const getIDs = () => {
      const sliderID = cont.parentElement.parentElement.id;           // full_cc_outer_container id (your product id)
      const track = document.getElementById('slider' + sliderID);     // the sliding <div>
      return { sliderID, track };
    };

    cont.addEventListener('touchstart', (e) => {
      tracking = true;
      startX = e.touches[0].clientX;
      curX = startX;
    }, { passive: true });

    cont.addEventListener('touchmove', (e) => {
      if (!tracking) return;
      curX = e.touches[0].clientX;
    }, { passive: true });

    cont.addEventListener('touchend', () => {
      if (!tracking) return;
      tracking = false;

      const dx = curX - startX;
      const threshold = 40; // pixels: adjust if you want gentler/harder swipe

      if (Math.abs(dx) < threshold) return; // ignore tiny moves

      const { sliderID, track } = getIDs();
      if (!sliderDict.hasOwnProperty(sliderID)) sliderDict[sliderID] = 0;

      const images = track.querySelectorAll('img');
      if (dx < 0) {
        // swipe left -> next
        sliderDict[sliderID] = (sliderDict[sliderID] + 1) % images.length;
      } else {
        // swipe right -> previous
        sliderDict[sliderID] = (sliderDict[sliderID] - 1 + images.length) % images.length;
      }
      updateSlider(track, sliderID);
    });
  });
}
// ========== Checkout popup ==========
function showCheckoutPopup() {
    // Select the checkout form container
    const checkoutPopup = document.querySelector(".checkout_body_container");
    document.getElementById("TotalPriceText").textContent = "Subtotal: " + getTotalPrice() + "$";
    
    if (checkoutPopup) {
        // Make the form visible
        checkoutPopup.style.display = "flex";
        
        // Add a click event listener to close the popup when clicking outside the form
        window.addEventListener("click", function closePopup(event) {
            if (event.target === checkoutPopup) {
                checkoutPopup.style.display = "none";
                window.removeEventListener("click", closePopup); // Remove the event listener
            }
        });
    } else {
        console.error("Checkout popup element not found!");
    }
}

function hideCheckoutPopup() {
    const checkoutPopup = document.querySelector(".checkout_body_container");
    if (checkoutPopup) {
        checkoutPopup.style.display = "none";
    }
}



const form = document.querySelector("form");
const fullName = document.getElementById("customerName");
const lastName = document.getElementById("customerLastName");
const email = document.getElementById("customerEmail");
const emailList = document.querySelectorAll("#customerEmail");
const phoneNumber = document.getElementById("customerNumber");
const occasion = document.getElementById("customerOccasion");
const message = document.getElementById("customerMessage");
function sendEmail() {
    // run validation first
    checkInputs();

    // bail out if any of the main fields still have error classes
    if (
        fullName.classList.contains("error") ||
        email.classList.contains("error") ||
        phoneNumber.classList.contains("error")
    ) {
        return;
    }

    // no point submitting an empty cart
    if (cart.length === 0) {
        Swal.fire({
            title: "Shopping cart is empty!",
            text: "Please add at least one item before placing an order.",
            icon: "warning"
        });
        return;
    }

    const preferredContactSelect = document.getElementById("preferredContact");
    const preferredPaymentSelect = document.getElementById("preferredPayment");

    const orderPayload = {
        customer: {
            name: fullName.value,
            lastName: lastName.value,
            email: email.value,
            phone: phoneNumber.value,
            preferredContact: preferredContactSelect ? preferredContactSelect.value : null,
            preferredPayment: preferredPaymentSelect ? preferredPaymentSelect.value : null,
            occasion: occasion ? occasion.value : null,
            message: message.value
        },
        items: cart.map(item => {
            const product = products.find(p => p.id == item.productId);
            return {
                productId: item.productId,
                name: product ? product.name : "",
                priceLabel: item.selectedPrice,               // e.g. "$24/half a dozen"
                unitPrice: getPriceValue(item.selectedPrice), // numeric
                quantity: item.quantity
            };
        }),
        total: getTotalPrice()
    };

    Swal.fire({
        title: "Placing your order...",
        text: "Sending, please wait.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading()
    });

    fetch("/api/newOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
    })
    .then(async (res) => {
        // try to parse JSON if the function returns it
        let data = {};
        try { data = await res.json(); } catch {}

        if (!res.ok) {
            throw new Error(data?.error?.message || data?.error || "Server error placing order");
        }

        Swal.close(); // close loading
        return data;
    })
    .then(() => {
        Swal.fire({
            title: "Order Placed",
            text: "Thank you for your order! We'll contact you soon to confirm.",
            icon: "success"
        });

        // clear cart + UI
        cart = [];
        addCartToHTML();
        addCartToMemory();
        updateCartPrice();

        // reset the form fields
        const formEl = document.querySelector(".checkout_form");
        if (formEl) {
            formEl.reset();
        }

        // optionally hide the checkout popup
        const checkoutContainer = document.querySelector(".checkout_body_container");
        if (checkoutContainer) {
            checkoutContainer.style.display = "none";
        }
    })
    .catch(err => {
        console.error(err);
        Swal.close(); // ensure loading closes on error

        Swal.fire({
            title: "Error",
            text: "We couldn't place your order. Please try again or contact us directly.",
            icon: "error"
        });
    });
}

form.addEventListener("submit", (event) => { 
    event.preventDefault();
    sendEmail();
});

function checkInputs() {
    const items  = document.querySelectorAll(".checkout_input");

    console.log(items);
    console.log(items[1].value);
    for (const item of items) {
        if (item.value == "") {
            const itemids = document.querySelectorAll(`#${item.id}Check`);
            for (const itemid of itemids) {
                itemid.classList.add("error");
                itemid.parentElement.classList.add("error");
            }
            
        }

        // !Important!!!
        // Need to change this part in the future as this is hardcoding the email index which is BAD practice ye
        // This is how the items array looks interms of indices and info
        // items[] = [input#customerName.checkout_input, input#customerLastName.checkout_input, 
        // input#customerEmail.checkout_input, input#customerNumber.checkout_input, textarea#customerMessage.checkout_input]
        if (items[2].value != "") {
            checkEmail();
        }

        items[2].addEventListener("keyup", () => {
            checkEmail();
        });

        item.addEventListener("keyup", () => {
            if (item.value != "") {
                const itemids = document.querySelectorAll(`#${item.id}`);
                for (const itemid of itemids) {
                    itemid.classList.remove("error");
                    itemid.parentElement.classList.remove("error");
                }
            } else {
                const itemids = document.querySelectorAll(`#${item.id}`);
                for (const itemid of itemids) {
                    itemid.classList.add("error");
                    itemid.parentElement.classList.add("error");
                }
            }
        })
    }
}

function checkEmail() {
    const emailRegex = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,3})(\.[a-z]{2,3})?$/;
    const errorTxtEmail = document.querySelector(".error_txt.email");

    console.log(email.value);
    if (!email.value.match(emailRegex)) {
        for (const e of emailList) {
            e.classList.add("error");
            e.parentElement.classList.add("error");

            if (e.value != "") {
                errorTxtEmail.innerText = "Enter a valid email address";
            } else {
                errorTxtEmail.innerText = "Email can't be blank";
            }
        }

    } else {
        email.classList.remove("error");
        email.parentElement.classList.remove("error");
    }
}


function getEachItem(body) {
    for (let i = 0; i < cart.length; i++) {
        let positionProduct = products.findIndex(value => value.id == cart[i].productId);
        let info = products[positionProduct];
        body += ` ${info.name}: ${cart[i].quantity} ${cart[i].selectedPrice}<br>`;
    }
    return body;
}

const initApp = () => {
    // get data product
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addItemsToHTML();
        attachSwipeHandlers(); 

        //get cart from memory JSON file
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
            //clearCart();
            addCartToHTML();
            updateCartPrice()
        }
    })
}
initApp();