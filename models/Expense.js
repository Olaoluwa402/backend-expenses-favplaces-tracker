import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }, 
    amount:{type:Number, required:[true, 'Amount is required']},
    description:{type:String, required:[true, 'Description is required']},
    date:{type:Date, required:[true, 'Date is required'], default:new Date()},
},{
    timestamps:true
})


const Expense = mongoose.model('Expense', expenseSchema)
export default Expense