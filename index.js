import { products } from './products.js'

const itemListHtml = document.getElementById('item-list')
const cart = document.getElementById('cart')
const cartTotal = document.getElementById('cartTotal')
const jumpToCart = document.getElementById('jump-to-cart')
const reciept = document.getElementById('reciept')
const orderBtn = document.getElementById('order-btn')
const modal = document.getElementById('modal')
const modalExitBtn = document.getElementById('modal-exit-btn')
const selectedItems = []

function createItemListHtml(products) {
    return products.map(function(product){
        return `
            <div class="item">
                <img src="${product.image}" class="item-img">
                <div class="item-content">
                    <h2>${product.brand} ${product.model}</h2>
                    <p>
                        ${product.description}
                    </p>
                    <p>Rental price (per day) - <span class="emphasise">£${product.pricePerDayGBP}</span></p>
                    <p>Max rental length - <span class="emphasise">${product.maxRentalLengthDays} days</span></p>
                </div>
                <div class="item-btns">
                    <select class="size-selector" name="size" required>
                        <option disabled selected class="disabled-selector">Select your size</option>
                        ${product.sizes.map(function(size){
                            return `
                            <option value="${size}">${size}</option>
                            `
                        }).join('')}
                    </select>
                    <label for="rental-length" class="length-selector">Rental Length:
                    <input type="number" class="rental-length" id="rental-length" max="${product.maxRentalLengthDays}" min="1" required></label>
                    <button class="add-to-cart" type="submit" data-product-id="${product.id}"><i class="fa-solid fa-cart-arrow-down"></i></button>
                </div>
            </div>
        `
    }).join('')
}

function renderItems() {
    itemListHtml.innerHTML = createItemListHtml(products)
}

itemListHtml.addEventListener('click', function(e){
    const buttonEl = e.target.closest('button')
    if (!buttonEl) return
        const itemEl = buttonEl.closest('.item')
        const selectedSize = itemEl.querySelector('.size-selector').value
        const selectedLength = Number(itemEl.querySelector('.rental-length').value)
        const clickedProductId = buttonEl.dataset.productId
        const product = products.find(p => p.id == clickedProductId)
        if (selectedSize && selectedLength >= 1 && selectedLength <= product.maxRentalLengthDays){
            selectedItems.push({ ...product, selectedSize, selectedLength })
            createCart(selectedItems)
        }
    }
)

cart.addEventListener('click', function(e){
    const buttonEl = e.target.closest('.remove-btn')
    if (!buttonEl) return
    const clickedIndex = buttonEl.dataset.index
    selectedItems.splice(clickedIndex, 1)
    createCart(selectedItems)
})

function createCart(items){
    cart.innerHTML = items.map(function(item, index){
        return `
        <tr class="reciept-item">
            <td class="align-left">${item.brand} ${item.model} <button class="remove-btn" data-index="${index}"><i class="fa-solid fa-circle-xmark"></i></button></td>
            <td>${item.selectedSize}</td>
            <td>${item.selectedLength} days</td>
            <td>£${item.pricePerDayGBP * item.selectedLength}</td>
        </tr>
        `
    }).join('')
    const totalSpend = selectedItems.reduce(function(total, item){
        return total + (item.pricePerDayGBP * item.selectedLength)
    }, 0)
    cartTotal.innerHTML = '£' + totalSpend
    if (selectedItems.length === 0){
        jumpToCart.classList.add('hidden')
        reciept.classList.add('hidden')
    } else {
        jumpToCart.classList.remove('hidden')
        reciept.classList.remove('hidden')
    }
}

orderBtn.addEventListener('click', function(){
    modal.classList.remove('hidden')
})

modalExitBtn.addEventListener('click', function(){
    modal.classList.add('hidden')
})

renderItems()
