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
            console.log(res)
            for (let i = 0; i < res.data.expense.length; i++) {
                const parentNode = document.getElementById('Users');
                const childHTML = `<li id=${res1[i].id}> ${res1[i].amount} - ${res1[i].description} - ${res1[i].category} 
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
        const data = confirm('Do you want to delete this item ?')
        if (data == true) {
            //return window.location.href='./login.html';
            const liId = e.target.parentNode.id;
            console.log(liId);
            const li = e.target.parentNode;
            console.log(li)
            li.remove()
            const token = localStorage.getItem('token');
            axios.post(`http://localhost:3000/user/deleteexpense/${liId}`, { li }, { headers: { 'authorization': token } })
                .then((res) => {
                    console.log(res);
                })
                .catch(err => { console.log(err) })
        }
        else {
            return false;
        }
    }
})

function download() {
    axios.get('http://localhost:3000/user/download', { headers: { "Authorization": token } })
        .then((response) => {
            if (response.status === 201) {
                //the bcakend is essentially sending a download link
                //  which if we open in browser, the file would download
                var a = document.createElement("a");
                a.href = response.data.fileUrl;
                a.download = 'myexpense.csv';
                a.click();
            } else {
                throw new Error(response.data.message)
            }

        })
        .catch((err) => {
            showError(err)
        });
}

const downloadfile = document.getElementById('dwnldbtn');
downloadfile.addEventListener('click', e => {
    e.preventDefault();
    alert('To download this Expense Sheet, you have to buy the Premium Membership !')
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



const premiumBtn = document.getElementById("premium");
const payBtn = document.getElementById('pay')
const close = document.getElementById("close");
const container = document.getElementById("popup-container");
const amount = 49900
let orderId;

premiumBtn.addEventListener("click", () => {
    container.classList.add("active");
    const token = localStorage.getItem('token');
    axios.post('http://localhost:3000/premium/create/order', { amount: amount }, { headers: { 'authorization': token } })
        .then(response => {
            orderId = response.data.order.id;
            payBtn.style = "display:block"
        })
        .catch(err => {
            console.log(err)
        })
});

close.addEventListener("click", () => {
    container.classList.remove("active");
    payBtn.style = "display:none"
});


let paymentId;
let signature;
payBtn.addEventListener('click', (e) => {
    container.classList.remove("active");
    const token = localStorage.getItem('token');
    payBtn.style = "display:none"
    var options = {
        "key": "rzp_test_eiQJejPth9OkeB", // Enter the Key ID generated from the Dashboard
        "amount": `${amount}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Expense Tracker",
        "description": "Premium",
        "image": "https://media.istockphoto.com/photos/smiling-business-woman-working-with-laptop-while-looking-at-camera-in-picture-id1348209421?b=1&k=20&m=1348209421&s=170667a&w=0&h=p0WEj_TWXcf_ctAXoabpnN7_HHmH6Hs2O70QxQKYx-U=",
        "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {
            paymentId = response.razorpay_payment_id;
            signature = response.razorpay_signature;
            alert(`Payment successful`);
            window.location.href = "./premium.html"

            axios.post('http://localhost:3000/transaction/detail', { orderId: orderId, paymentId: paymentId }, { headers: { 'authorization': token } })
                .then()
                .catch(err => {
                    console.log(err)
                })
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response) {
        alert(response.error.description);
    });
    rzp1.open();
    e.preventDefault();

})


