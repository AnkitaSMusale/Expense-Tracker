document.body.classList.toggle("dark")

const toggle = document.getElementById("toggle");

toggle.addEventListener("change", (e) => {
    document.body.classList.toggle("dark", e.target.unchecked);
});


const my_form = document.querySelector('#my_form');
const msg = document.querySelector('.msg');
const userList = document.querySelector('#Users');
const Addexpense = document.getElementById('btn1')

btn1.addEventListener('click', onsubmit);
function onsubmit(e) {
    e.preventDefault();
    const amt = document.getElementById('amt');
    const descr = document.getElementById('descr');
    const categ = document.getElementById('categ');

    if (amt.value === '' || descr.value === '' || categ.value === 'none') {
        msg.classList.add('error');
        msg.innerHTML = 'please enter all fields!!...';
        setTimeout(() => msg.remove(), 3000);
    }
    else {
        //const li=document.createElement('li');
        const obj = {
            amount: amt.value,
            description: descr.value,
            category: categ.value
        }
        amt.value = ""
        descr.value = ""
        categ.value = ""
        const token = localStorage.getItem('token');
        console.log(obj);
        console.log(token);
        axios.post("http://localhost:3000/user/addexpense", obj, { headers: { 'authorization': token } })
            .then(res => {
                alert(res.data.message)
            })
            .catch(err => {
                console.log(err)
            })
    }
}

const getExpense = document.getElementById('getExpense')
getExpense.addEventListener('click', () => {
    const token = localStorage.getItem('token');
    axios.get("http://localhost:3000/user/getexpenses", { headers: { 'authorization': token } })
        .then(res => {

            const res1 = res.data.expense;
            console.log(res1);
            for (let i = 0; i < res.data.expense.length; i++) {
                const parentNode = document.getElementById('Users');
                const childHTML = `<li id=${res1[i].id}>❖ &nbsp;<span> ${res1[i].updatedAt.slice(0, 10)}</span> &nbsp;- &nbsp;<span>${res1[i].description}</span>&nbsp;-&nbsp;<span>${res1[i].category}</span>&nbsp;-&nbsp; <span>$${res1[i].amount}</span> 
                    <button id="dltbtn" style='margin-right:50px;float:right;Background-color:red;color:white'>X</button></li>`;
                //onclick=deleteUser('${res1[i]._id}'
                parentNode.innerHTML += childHTML;
            }
        })
        .catch(err => {
            console.log(err)
        })
})



Expenselist = document.getElementById('Users')
Expenselist.addEventListener('click', (e) => {
    if (e.target.id == 'dltbtn') {
        const liId = e.target.parentNode.id;
        console.log(liId);
        const li = e.target.parentNode
        console.log(li)
        li.remove()
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:3000/user/deleteexpense/${liId}`, { li }, { headers: { 'authorization': token } })
            .then((res) => {
                const parentNode = document.getElementById('Users');
                if (li) {
                    parentNode.removeChild(li);
                }
                li.remove()
                notifyUser(res.data.message)
            })
            .catch(err => { console.log(err) })
    }
})

const logout = document.getElementById('logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    const data = confirm('Are you sure you want to log out ?')
    if (data == true) {
        return window.location.href = './login.html';
    }
    else
        return false;
})

const print = document.getElementById("print");
const list = document.getElementById("Users")
print.addEventListener('click', () => {
    window.print(list);
})

const downloadfile = document.getElementById('dwnldbtn')
downloadfile.addEventListener('click', () => {
    const token = localStorage.getItem('token');
    const data = confirm('Do you want to download this expense sheet?')
    if (data == false) {
        //return window.location.href = './login.html';
        return false;
    }
    else{
        return axios.get(`http://localhost:3000/user/download`, { headers: { 'authorization': token } })
        .then((res) => {

            window.open(res.data.fileURL, '_blank')
            console.log(res)
        })
        .catch(err => { console.log(err) })
    }
    
})
