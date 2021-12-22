let addBtns=document.querySelectorAll(".product-add")

let table=document.querySelector("#basket .basket-products table")
let basketBtn=document.querySelector(".basket")

if (JSON.parse(localStorage.getItem("basket"))) {
    document.querySelector(".actual-count").innerText=JSON.parse(localStorage.getItem("basket")).length
}

if (table) {
    JSON.parse(localStorage.getItem("basket")).forEach((obj)=>{
        table.innerHTML+=` <tbody data-tr="${obj.dataId}>
        <tr class="product-holder" ">
            <td>
                <div class="img-box">
                    <img src="${obj.img}" alt="${obj.name}">
                </div>
            </td>
            <td><span class="name">${obj.name}</span></td>
            <td>
                <div class="count text-center d-flex flex-column gap-2">
                    <span>Miqdar:</span>
                   <div class="count-box">
                       <button class="less"><i class="fas fa-minus"></i></button>
                       <span class="count-holder d-inline-block">${obj.count}</span>
                       <button class="more"><i class="fas fa-plus"></i></button>
                   </div>
                </div>
            </td>
            <td>
                <span class="price">${obj.price}<span class="currency">M</span></span>
            </td>
            <td>
                <button class="remove-btn" data-id="${obj.dataId}">
                    <i class="fas fa-trash-alt" ></i>
                </button>
            </td>
        </tr>
    </tbody>`
    })
}

addBtns.forEach((btn)=>{
    btn.addEventListener("click",()=>{
       if (localStorage.getItem("basket")===null) {
           localStorage.setItem("basket", JSON.stringify([]))
       }
        let productCard=document.querySelector(`[data-id="${btn.getAttribute("data-btn")}"]`)
        let productId=productCard.getAttribute("data-id")
        let productImgSrc=document.querySelector(".imgBox img").getAttribute("src")
        let productName=productCard.querySelector(".product-name").innerText
        let basket=JSON.parse(localStorage.getItem("basket"))
        let productPrice=productCard.querySelector(".product-price").innerText
        let existProduct=basket.find(item=>item.dataId===productId)
        if (existProduct) {
            existProduct.count+=1
        }
        else{
            let productObj={
                img: productImgSrc,
                name: productName,
                price: productPrice,
                dataId: productId,
                count: 1
            }
            basket.push(productObj)
        }
        localStorage.setItem("basket",JSON.stringify(basket))
        document.querySelector(".actual-count").innerText=JSON.parse(localStorage.getItem("basket")).length
    })
})

document.querySelectorAll(".remove-btn").forEach((btn)=>{
    btn.addEventListener("click", function(){
        let card= this.parentElement.parentElement.parentElement
        card.remove()
        let currentBasket=JSON.parse(localStorage.getItem("basket"))
        let newBasket=currentBasket.filter(item=>item.dataId!==this.getAttribute("data-id"))
        localStorage.setItem("basket",JSON.stringify(newBasket))
    })
})

