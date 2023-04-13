import { Api } from "./data.js";

let elBody = document.getElementById("body");
let elLogOut = document.getElementById("logOut");
let cardList = document.getElementById("cardList");
let userAddForm = document.getElementById("userAddForm");

//log in 
let token = localStorage.getItem("token") || false
if (!token) {
    window.location.replace("login.html")
}
elLogOut.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.replace("login.html");
})
elBody.addEventListener("click", evt => {
    if (evt.target.tagName == "BUTTON") {
        let btnValue = evt.target
        // console.log(btnValue.textContent);
        if (btnValue.textContent.trim() == "+Add user") {
            userAddForm.classList.add("class", "flex");
            userAddForm.classList.remove("class", "hidden");
        } else if (btnValue.textContent.trim() == "Close") {
            userAddForm.classList.remove("class", "flex");
            userAddForm.classList.add("class", "hidden");
        }
    }
});


//    Render Funksiya
//render function



async function renderFunc(element, data) {

    if (data) {
        // console.log(data);
        data.forEach(user => {
            let newLi = document.createElement("li")
            let newh3Name = document.createElement("h3")
            let newpId = document.createElement("p")
            let newpZipCode = document.createElement("p")
            let newh4UserName = document.createElement("h4")
            let newh5City = document.createElement("h5")
            let newspanEmailCallSpan = document.createElement("span")
            let newaCall = document.createElement("a")
            let newaCallImg = document.createElement("img")
            let newaEmail = document.createElement("a")
            let newaEmailImg = document.createElement("img")
            let newpStreet = document.createElement("p")
            let newbtnDelete = document.createElement("button")

            newLi.dataset.id = user.id;
            newLi.setAttribute("class", "flex  items-center gap-4 px-4 py-2  border border-t-2 ")
            newh3Name.setAttribute("class", "w-[255px] p-1")
            newpId.setAttribute("class", "w-[60px ] p-1 mr-2")
            newpZipCode.setAttribute("class", "w-[120px] p-1")
            newh4UserName.setAttribute("class", "w-[200px] p-1")
            newh5City.setAttribute("class", "w-[120px] p-1")

            newspanEmailCallSpan.setAttribute("class", "w - [100px] flex items - center gap - 2")
            newaCall.setAttribute("class", "bg-gray-300 rounded-full p-1 hover:bg-gray-400")
            newaCallImg.setAttribute("src", "./img/Vector.svg")
            newaCallImg.setAttribute("width", "20px")
            newaCallImg.setAttribute("height", "20px")
            newaEmail.setAttribute("class", "bg-gray-300 rounded-full p-1 hover:bg-gray-400")
            newaEmailImg.setAttribute("src", "./img/Email.svg")
            newaEmailImg.setAttribute("width", "20px")
            newaEmailImg.setAttribute("height", "20px")

            newpStreet.setAttribute("class", "w-[100px] p-1")
            newbtnDelete.setAttribute("class", "w-[100px] uppercase bg-red-600 rounded-md text-white hover:text-red-600 hover:bg-red-300")

            newh3Name.textContent = user.name
            newpId.textContent = user.id
            newpZipCode.textContent = user.address.zipcode
            newh4UserName.textContent = user.username
            newh5City.textContent = user.address.city.trim()
            newaEmail.href = `mailto:${user.email}`

            newaCall.href = `tel:+${user.phone}`
            newpStreet.textContent = user.address.street
            newbtnDelete.textContent = "DELETE"

            newbtnDelete.addEventListener("click", evt => {
                let parentLI = evt.target.parentNode;
                let parentUL = parentLI.parentNode;
                parentUL.removeChild(parentLI)
            })




            newaCall.append(newaCallImg)
            newaEmail.append(newaEmailImg)
            newspanEmailCallSpan.append(newaCall, newaEmail)
            newLi.append(newh3Name, newpId, newpZipCode, newh4UserName, newh5City, newspanEmailCallSpan, newpStreet, newbtnDelete);
            element.appendChild(newLi);



        });
    }
}
let data = await Api.GET("users");
renderFunc(cardList, data)

//add users

userAddForm.addEventListener("submit", async (evt) => {

    evt.preventDefault();
    let { Enter_name, Enter_ID, Enter_Zip_Code, Enter_Username, Call_number, Email, Enter_City, Street } = evt.target.elements
    let newUser = {
        id: `${Enter_ID.value.trim()}`,
        name: `${Enter_name.value.trim()}`,
        address: {
            zipcode: `${Enter_Zip_Code.value.trim()}`,
            city: `${Enter_City.value.trim()}`,
            street: `${Street.value.trim()}`,
        },
        username: `${Enter_Username.value.trim()}`,
        phone: `${Call_number.value.trim()}`,
        email: `${Email.value.trim()}`,
    };
    let addUserApi = await Api.POST("users", newUser);
    console.log(addUserApi);
    if (addUserApi) {
        // let postData = await Api.GET("users");
        let newData = [addUserApi, ...data];
        console.log(newData);
        cardList.innerHTML = null
        renderFunc(cardList, newData);
        userAddForm.classList.remove("class", "flex");
        userAddForm.classList.add("class", "hidden");
    }
    // renderFunc(cardList, "users")
});



let searchInput = document.querySelector("#search")

searchInput.addEventListener("input", async (evt) => {
    const inputValue = evt.target.value.toLowerCase()
    console.log(inputValue);
    let data = await Api.GET("users");
    data = data.filter((user) => user.name.toLowerCase().includes(inputValue))
    console.log(data);
    cardList.textContent = null
    renderFunc(cardList, data)


})

