const {Schema, model} = require('mongoose')

const UserSchema = {
  first_name:{type: String, required:true},
  username:{type: String, required:true},
  id: {type: Number,required:true, unique:true}
}


const User = model("User", UserSchema);
module.exports=User