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

function updateSlider(slider,sliderID) {

    const sliderWidth = slider.querySelector('img').offsetWidth;
    console.log("sliderWidth:" + sliderWidth);

    slider.style.transform = `translateX(-${sliderDict[sliderID] * sliderWidth}px)`; // Slide to the correct image

    console.log("sliderWidth and index:" + sliderDict[sliderID] * sliderWidth);
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
        document.getElementById("TotalPriceCart").textContent = "Total Price: " + getTotalPrice() + "$"
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
    document.querySelector("body").classList.toggle("showCart");
}

const isHomePage = window.location.pathname.includes("home.html");
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

const addToCart = (productId, selectedPriceOption) => {
    let cartPos = cart.findIndex(item => item.productId === productId && item.selectedPrice === selectedPriceOption);
    
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

            let positionProduct = products.findIndex(value => value.id == cartItem.productId);
            let info = products[positionProduct];

            newCartItem.innerHTML = `
                <div class="item-image">
                    <img src="${info.a_image}" alt="itemPic1">
                </div>
                <div class="item-name">
                    ${info.name}
                </div>
                <div class="item-price">
                    ${getPriceValue(cartItem.selectedPrice) * cartItem.quantity}$
                </div>
                <div class="item-quantity">
                    <span>
                        <span class="minus"><</span>
                        <span>${cartItem.quantity}</span>
                        <span class="plus">></span>
                    </span>
                    <button class="removebtn">Remove</button>
                </div>
            `;
            cartListHTML.appendChild(newCartItem);
        });
    }

    iconCartCount.innerText = totalProducts;
};

cartListHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let productId = positionClick.parentElement.parentElement.dataset.productId;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantityCart(productId, type);
    } else if(positionClick.classList.contains('removebtn')) {
        let productId = positionClick.parentElement.parentElement.dataset.productId;
        let positionItemInCart = cart.findIndex((value) => value.productId == productId);
        cart.splice(positionItemInCart, 1);

        addCartToMemory();
        addCartToHTML();
        updateCartPrice()
    }
})

const getPriceValue = (priceString) => {
    return parseFloat(priceString.split('/')[0].replace(/[^0-9.]/g, '')); //so this takes the string and replaces all non ints with ""
};

const changeQuantityCart = (productId, type) => {
    console.log(productId);
    let positionItemInCart = cart.findIndex((value) => value.productId == productId);
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
// ==========

function send_customer_data(email,phone) {
    console.log(email);
    const recipient = email;
    const subject = 'Hello';
    const body = 'This is the body of the email.';

    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
}

function showCheckoutPopup() {
    // Select the checkout form container
    const checkoutPopup = document.querySelector(".checkout_body_container");
    document.getElementById("TotalPriceText").textContent = "Total Price: " + getTotalPrice() + "$";
    
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

const form = document.querySelector("form");
const fullName = document.getElementById("customerName");
const email = document.getElementById("customerEmail");
const emailList = document.querySelectorAll("#customerEmail");
const phoneNumber = document.getElementById("customerNumber");
const occasion = document.getElementById("customerOccasion");
const message = document.getElementById("customerMessage");
function sendEmail() {

    const bodyMessage = `Full Name: ${fullName.value}<br> Email: ${email.value}<br> Phone Number: ${phoneNumber.value}<br> Message: ${message.value}<br>`;
    let finalMessage = getEachItem(bodyMessage);
    checkInputs();

    if (!fullName.classList.contains("error") && !email.classList.contains("error") && !phoneNumber.classList.contains("error")) {
        if (cart.length == 0) {
            Swal.fire({
                    title: "Shopping cart is empty!",
                    text: "The order did not send as your cart is empty",
                    icon: "error"
                });
        } else {
            Email.send({
                Host : "smtp25.elasticemail.com",
                Username : "mascakenbakes@gmail.com",
                Password : "6ADFC03843F0B3BC8CA46ED380E063DED071",
                To : 'mascakenbakes@gmail.com',
                From : "mascakenbakes@gmail.com",
                Subject : `${fullName.value} Order Information`,
                Body : finalMessage
            }).then(
                message => {
                    if (message == "OK") {
                        Swal.fire({
                            title: "Order Placed",
                            text: "Thank you for your order!",
                            icon: "success"
                        });
                    }
                }
            );
        }
    }
}

form.addEventListener("submit", (event) => { 
    event.preventDefault();
});

function checkInputs() {
    const items  = document.querySelectorAll(".checkout_input");

    for (const item of items) {
        if (item.value == "") {
            const itemids = document.querySelectorAll(`#${item.id}`);
            for (const itemid of itemids) {
                itemid.classList.add("error");
                itemid.parentElement.classList.add("error");
            }
            
        }

        if (items[1].value != "") {
            checkEmail();
        }

        items[1].addEventListener("keyup", () => {
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
            addCartToHTML();
            updateCartPrice()
        }
    })
}
initApp();