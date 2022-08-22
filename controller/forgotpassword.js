
const sgMail = require("@sendgrid/mail");
const ForgetPassword = require("../models/forgotpassword");
const User = require("../models/user");

const uuid = require("uuid");

const bcrypt = require("bcrypt");
const forgotPassword = async (req, res) => {
    var email = req.body.email;
  
    console.log(req.body.email);
    await User.findOne({ where: { email: email } })
    .then((user) => {
      if (user) {
        const id = uuid.v4();
        console.log(id);
        user.createForgotpassword({ id, active: true })
          .catch((err) => {
            throw new Error(err);
          });
          res.status(200).send(`http://localhost:3000/resetpassword/${id}`);
        }
    })
}
const resetPassword=(req,res)=>{
   const id=req.params.id
   ForgetPassword.findOne({where:{id:id}}).then(forgotPassword=>{
     if(forgotPassword){

       //console.log(forgotPassword.active)
       if(!forgotPassword.active){
        res.status(200).send(
          `
          <html>
          <h1> link has expired <h1>
          </html>`
        )
       }
      forgotPassword.update({active:false});
      res.status(200).send(`<html>
      <script>
          function formsubmitted(e){
              e.preventDefault();
              console.log('called')
          }
      </script>
      <body style="text-align:center;	background: linear-gradient(to bottom, #040409,  #07130a, #23234f); color:white;" >
      <form action="/updatepassword/${id}" method="get">
        
          <input placeholder="Enter new password" name="newpassword" type="password" required></input> <br>
          <button style="color:white; background-color: #ac0c54" >reset password</button>
      </form>
      </body>
  </html>`
  ) 
   res.end()
     }
     else{
      
     }
   })

}

const updatePassword=(req,res)=>{
  const newpassword=req.query.newpassword;
  //console.log(req.body)
  const id=req.params.id

  ForgetPassword.findOne({where:{id}}).then(forgotpassword=>{
    // console.log(forgotpassword.userId)
    User.findOne({where:{id:forgotpassword.userId}}).then(async(user)=>{
      // console.log(user)
      if(user){
        const saltRounds=10;
        bcrypt.hash(newpassword, saltRounds, function (err, hash) {
          
          
          //console.log(hash)
          user.update({
              password: hash
             
            })
              .then(() => {
                res.status(200).send(
                  `
                 Your Password has successfully changed !
                 `
                )
              }
              )
              .catch((err) => {
                console.log(err);
               
              });
        });
      }
      else{
        res.json({msg:"user doesnt exists"})
      }
    })
  })
  .catch(err=>{
    console.log(err)
  })


}

module.exports = {forgotPassword, resetPassword, updatePassword}
