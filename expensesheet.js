const logout = document.getElementById('logout');

logout.addEventListener('click' , (e) => {
    e.preventDefault(); 
    const data = confirm('Are you sure you want to log out ?')
    if(data == true){
        return window.location.href='./login.html';
    }  
    else
        return false;            
})

const my_form=document.querySelector('#my_form');
const msg=document.querySelector('.msg');
const userList=document.querySelector('#Users');

my_form.addEventListener('submit',onsubmit);
function onsubmit(e){
    e.preventDefault();
    const amt=document.getElementById('amt');
    const descr=document.getElementById('descr');
    const categ=document.getElementById('categ');

    if(amt.value==='' || descr.value==='' || categ.value==='none'){
        msg.classList.add('error');
        msg.innerHTML='please enter all fields';
        setTimeout(()=>msg.remove(),3000);
    }
    else{
        //const li=document.createElement('li');
        const obj = {
            amount : amt.value,
            description : descr.value,
            category : categ.value
        }
        amt.value=""
        descr.value=""
        categ.value=""
        const token = localStorage.getItem('token');
        console.log(obj);
        console.log(token);
        axios.post("http://localhost:3000/user/addexpense",obj,{headers:{'authorization': token}})
        .then(res=>{
          alert(res.data.message)
        })
        .catch(err=>{
          console.log(err)
        })
    }    
}    
