let products = [];
let cart = [];
let subwrapper2HTMLcc = document.getElementById("cc_wrapper");
let subwrapper2HTMLm = document.getElementById("m_wrapper");
let subwrapper2HTMLt = document.getElementById("t_wrapper");
let subwrapper = document.querySelector(".dainty-wrapper");
let cartListHTML = document.querySelector(".cart-list");
let iconCartCount = document.querySelector(".icon-cart span");


function getItemNumber(id) {
    for (var i = 1; i < 10; i++){
        if (id == "item"+i)
            return i;
    }
    return "error out of range";  //returns 0 if no match found.
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
    console.log(imgs.parentElement.parentElement.parentElement.parentElement);
}

function deleteDefault(idNumber) {
    var default_img = document.getElementById("default_img" + idNumber);

    if (default_img.style.display != "none") {
        default_img.style.display = "none";
    }
}

function showCart() {
    document.querySelector("body").classList.toggle("showCart");
}

const addItemsToHTML = () => {
    subwrapper2HTMLcc.innerHTML = "";
    let name = "";
    if (products.length > 0) {
        products.forEach(element => {
            let newProduct = document.createElement("div");
            newProduct.dataset.id = element.id;
            newProduct.classList.add("showcase-item");
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
                <div class="price">${element.price}$</div>
                <div class="cartbtn_container">
                    <button class="addCart">Add To Cart</button>
                </div>

            `;
            switch (element.type) {
                case 'cc':
                    subwrapper2HTMLcc.appendChild(newProduct);
                    break;
                case 'm':
                    subwrapper2HTMLm.appendChild(newProduct);
                    break;
                case 't':
                    subwrapper2HTMLt.appendChild(newProduct);
                    break;

            }
        });
    }
}

subwrapper.addEventListener('click', (event) => {
    let clickPosition = event.target;
    if (clickPosition.classList.contains('addCart')) {
        addToCart(clickPosition.parentElement.parentElement.dataset.id);
    }
})

const addToCart = (productId) => {
    let cartPos = cart.findIndex(item => item.productId === productId);
    if (cart.length <= 0){
        cart = [{
            productId: productId,
            quantity: 1
        }]
    } else if (cartPos < 0) {
        cart.push({
            productId: productId,
            quantity: 1
        })
    } else {
        cart[cartPos].quantity++;
    }
    console.log(cart + "yey");
    addCartToHTML();
    addCartToMemory();
}

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
            let positionProduct = products.findIndex((value) => value.id == cartItem.productId);
            let info = products[positionProduct]
            cartListHTML.appendChild(newCartItem);
            newCartItem.innerHTML = `
                <div class="item-image">
                    <img src="${info.a_image}" alt="itemPic1">
                </div>
                <div class="item-name">
                    ${info.name}
                </div>
                <div class="item-price">
                    ${info.price * cartItem.quantity}$
                </div>
                <div class="item-quantity">
                    <span class="minus"><</span>
                    <span>${cartItem.quantity}</span>
                    <span class="plus">></span>
                    <button class="removebtn">Remove</button>
                </div>
            `;
            cartListHTML.appendChild(newCartItem);
        })
    }
    iconCartCount.innerText = totalProducts;
}

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
        console.log(cart)
        console.log(positionItemInCart)
        cart.splice(positionItemInCart, 1);
        addCartToMemory();
        addCartToHTML();
    }
})

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
}

const initApp = () => {
    // get data product
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addItemsToHTML();

        //get cart from memory JSON file
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}
initApp();