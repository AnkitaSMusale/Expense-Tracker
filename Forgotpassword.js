const forgotpassword = document.getElementById('forgotpassword');
const msg = document.getElementById('msg');
// const myform = document.getElementById('forgotpassword-form');

forgotpassword.addEventListener('click', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email');
    if(email.value==""){
        msg.classList.add('error');
        msg.innerHTML='please enter an e-mail id';
        setTimeout(()=>msg.remove(),3000);
    }
   else{

    let obj = {
        email: email.value
    }
    console.log(obj);
    axios.post('http://localhost:3000/forgotpassword',obj)
    .then(res => {
        console.log(res.data);
        // if(res.status === 202){
        //     document.body.innerHTML += 'Mail Successfully sent !'
        // }
        // else{
        //     throw new Error('Something went wrong');
        // }
    })
    .catch(err => {
        console.log(err);
    })
    //window.location.href='./resetpassword.html';
   }    
});