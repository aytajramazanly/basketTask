let addBtns=document.querySelectorAll(".product-add")
let table=document.querySelector("#basket .basket-products table")
let basketBtn=document.querySelector(".basket")
let navLogibBtn=document.querySelector("#main-nav .login .nav-login")
let logoutBtn=document.querySelector("#main-nav .logout .nav-logout")
let mainMenu=document.querySelector("#products")

// register
let newUserFirstName=document.querySelector("#name")
let newUserLastName=document.querySelector("#lastName")
let newUserName=document.querySelector("#username")
let newUserPass=document.querySelector("#password")
let registerBtn=document.querySelector(".register-btn")
let emptyInputAlert=document.querySelector(".alert-empty-input")
let existUsernameAlert=document.querySelector(".alert-exist-username")
let form=document.querySelector("form")
// login
let userNameLogin=document.querySelector("#existUsername")
let passWordLogin=document.querySelector("#existPassword")
let loginBtn=document.querySelector(".login-btn")
let wantBeRegisterBtn=document.querySelector(".register")
let incorrectAlert=document.querySelector(".alert-incorrect-login")
let successRegisterAlert=document.querySelector("#login .alert-success")

if (JSON.parse(storageCheckForsTable().getItem("basket"))) {
    setBasketCount()
}

switch (checkPage()) {
    case "products":
        navLogibBtn.addEventListener("click",(e)=>{
            e.preventDefault()
            document.querySelector("#products").style.display="none"
            document.querySelector("#login").style.display="flex"
            document.querySelector("#register").style.display="none"
            wantBeRegisterBtn.addEventListener("click",()=>{
                document.querySelector("#login").style.display="none"
                document.querySelector("#register").style.display="block"
                registerBtn.addEventListener("click",function(){
                    if (JSON.parse(localStorage.getItem("users"))===null) {
                        localStorage.setItem("users",JSON.stringify([]))
                    }
                    let users=JSON.parse(localStorage.getItem("users"))
                    if (checkForm()===false) {
                        errorAlert(emptyInputAlert)
                    }
                    else if (users.filter(user=>user.userName===newUserName.value).length>0) {
                        errorAlert(existUsernameAlert)
                    }
                    else{
                        createUser(newUserFirstName,newUserLastName,newUserName,newUserPass,users)
                        document.querySelector("#login").style.display="flex"
                        document.querySelector("#register").style.display="none"
                        successRegisterAlert.classList.remove("d-none")
                        loginFormReset()
                    }
                    form.reset()
                 })
            })
            
            loginBtn.addEventListener("click",()=>{
                let user=JSON.parse(localStorage.getItem("users"))?.find(user=>user.userName===userNameLogin.value)
                if (user && user.password===passWordLogin.value) {
                    localStorage.setItem("user","true")
                    document.querySelector("#products").style.display="block"
                    document.querySelector("#login").style.display="none"
                    setBasketCount()
                }
                else(
                   errorAlert(incorrectAlert)
                )
            })
        })
        logoutBtn?.addEventListener("click",()=>{
            localStorage.removeItem('user')
        })
        break;
        case "table":
            if (JSON.parse(storageCheckForsTable().getItem("basket"))) {
                JSON.parse(storageCheckForsTable().getItem("basket")).forEach((obj)=>{
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
                                   <button class="less" data-id="${obj.dataId}"><i class="fas fa-minus"></i></button>
                                   <span class="count-holder d-inline-block">${obj.count}</span>
                                   <button class="more" data-id="${obj.dataId}"><i class="fas fa-plus"></i></button>
                               </div>
                            </div>
                        </td>
                        <td>
                            <span class="price">${obj.price*obj.count}<span class="currency">M</span></span>
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
            table.querySelectorAll(".less").forEach((decreaseBtn)=>{
                decreaseBtn.addEventListener("click",function(){
                changeProductCount("decrease",this)
               })
            })
            table.querySelectorAll(".more").forEach((increaseBtn)=>{
                increaseBtn.addEventListener("click",function(){
                    changeProductCount("increase",this)
                })
             })
        break
    default:
        break;
}



addBtns.forEach((btn)=>{
    btn.addEventListener("click",()=>{
       if (localStorage.getItem("basket"),sessionStorage.getItem("basket")===null) {
           localStorage.setItem("basket",JSON.stringify([]))
           sessionStorage.setItem("basket",JSON.stringify([]))
       }
         setObjToBasket(btn)
    })
})

basketBtn.addEventListener("click",()=>{
    if (localStorage.getItem("user")===true) {
        document.querySelector("#basket-nav .login .nav-login").classList.add("d-none")
        document.querySelector("#basket-nav .login .nav-logout").classList.remove("d-none")
    }
})

document.querySelectorAll(".remove-btn").forEach((btn)=>{
    btn.addEventListener("click", function(){
        let card= this.parentElement.parentElement.parentElement
        card.remove()
        let currentBasket=JSON.parse(storageCheckForsTable().getItem("basket"))
        let newBasket=currentBasket.filter(item=>item.dataId!==this.getAttribute("data-id"))
        storageSet(newBasket)
    })
})

function checkForm() {
    let inputs=document.querySelectorAll("#register form input")
    for (const input of inputs) {
        if (input.value!=="") {
            continue
          }
          return false
    }
}

function errorAlert(span) {
    span.style.opacity="1"
    setTimeout(()=>{
        span.style.opacity="0"
    },5000)
}

function createUser(name,surname,username,password,usersArr) {
    let newUser={
        firstName: name.value,
        lastName: surname.value,
        userName: username.value,
        password: password.value
    }
    usersArr.push(newUser)
    localStorage.setItem("users",JSON.stringify(usersArr))
}

function checkPage() {
    if (table) {
        return "table"
    }
    else if (mainMenu) {
        return "products"
    }
}
function loginFormReset() {
    userNameLogin.value=""
    passWordLogin.value=""
}

function storageSet(basket) {
    storageCheckForsTable().setItem("basket",JSON.stringify(basket))
    setBasketCount()
}

function createProductObj(productImgSrc,productName,productPrice,productId,basket) {
    let productObj={
        img: productImgSrc,
        name: productName,
        price: productPrice,
        dataId: productId,
        count: 1
    }
    basket.push(productObj)
}

function setObjToBasket(btn) {
        let productCard=document.querySelector(`[data-id="${btn.getAttribute("data-btn")}"]`)
        let productId=productCard.getAttribute("data-id")
        let productImgSrc=productCard.querySelector(".imgBox img").getAttribute("src")
        let productName=productCard.querySelector(".product-name").innerText
        let productPrice=productCard.querySelector(".product-price").innerText
        let basket=JSON.parse(storageCheckForsTable().getItem("basket"))
        let existProduct=basket.find(item=>item.dataId===productId)
        if (existProduct) {
            existProduct.count+=1
        }
        else{
            createProductObj(productImgSrc,productName,productPrice,productId,basket) 
        }
        storageSet(basket)
}

function storageCheckForsTable() {
    if (localStorage.getItem("user")===null) {
        return sessionStorage
    }
    else{
        return localStorage
    }
}

function setBasketCount() {
    document.querySelector(".actual-count").innerText=JSON.parse(storageCheckForsTable().getItem("basket")).length
}

function changeProductCount(sibling,btn) {
    let existBasket=JSON.parse(storageCheckForsTable().getItem('basket'))
    switch (sibling) {
        case "increase":
            btn.previousElementSibling.innerText=Number(btn.previousElementSibling.innerText)+1
            existBasket.map(product=>{
               if (product.dataId===btn.getAttribute("data-id")) {
                   product.count=Number(btn.previousElementSibling.innerText)
               }
           })
           storageCheckForsTable().setItem('basket',JSON.stringify(existBasket))
            break;
        case "decrease":
            btn.nextElementSibling.innerText=Number(btn.nextElementSibling.innerText)-1
            existBasket.map(product=>{
               if (product.dataId===btn.getAttribute("data-id")) {
                   product.count=Number(btn.nextElementSibling.innerText)
               }
           })
           storageCheckForsTable().setItem('basket',JSON.stringify(existBasket))
           break
        default:
            break;
    }
}
