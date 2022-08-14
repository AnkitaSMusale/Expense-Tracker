
const createAcc = document.getElementById('signup');
const form = document.getElementById('signup-form');
const msg = document.getElementById('msg');
//console.log(createAcc);

createAcc.addEventListener('click', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const password = document.getElementById('password');

    if(name.value=="" || email.value=="" || phone.value=="" || password.value==""){
        msg.classList.add('error');
        msg.innerHTML='please enter all fields';
        setTimeout(()=>msg.remove(),3000);
    }
   else{
        let obj = {
            name: name.value,
            email: email.value,
            phone:phone.value,
            password: password.value
        }
        console.log(obj);
        // axios.post('http://localhost:3000/user/signup',obj)
        //     .then(res=>{
        //         alert(res.data.message)
        //     })
        //     .catch(err=>{
        //         console.log(err.response.data.message)
        //     })
         //axios.post('http://localhost:3000', obj)
         axios.post('http://localhost:3000/user/signup',obj)
            .then(res => {
                console.log(res)
                alert("successfully signed up")
            }).catch(err => {
                alert("user alreaady exist! Please login");
                console.log(err)
            })
    }
});


