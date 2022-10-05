import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import Expense from './Expense.js'

const userSchema = new mongoose.Schema({
    email:{type:String, unique:true, required:[true, 'Email is required']},
    username:{type:String, unique:true, required:[true, 'username is required']},
    role:{type:String, required:true, enum:['admin','user'], default:'user'} ,
    password:{type:String, required:[true, 'password is required']}
},{ 
    timestamps:true
})

userSchema.methods.matchedPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.pre('remove', async function(next){
    Expense.find({user: this.id}, (err, expenses) => {
        if(err){
            next(err);
        } else if(expenses.length > 0){
            next(new Error("This user has expenses record still"));
        } else {
            next();
        }
});
})

const User = mongoose.model('User', userSchema)
export default User