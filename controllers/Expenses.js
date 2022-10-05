import Expense from "../models/Expense.js";
import asyncHandler from "express-async-handler";


//@desc: create  expense
//route: POST /api/v1/expenses
//access: private - user
const createExpense = async(req,res, next)=> {
    const {description,amount,date} = req.body.expenseData;
    console.log(description, amount, date)
    try{
        const expense = await Expense.create({
            user:req.user._id, 
            amount,
            description,
            date
        })
 
        res.status(201).json({
            status:'success',
            expense
        })

    }catch(err){
        res.status(400).json({
            message:err.message
        })
    }
}

//@desc: get single  expense
//route: GET /api/v1/expenses/:expenseId
//access: private - user
const getSingleExpense = async(req,res)=> {
    const {expenseId} = req.params
 
    try{
        
        const expense = await Expense.findById({_id:expenseId})
        if(!expense){
            res.status(404)
            throw new Error('Expense not found')
        }

        res.status(200).json({
            status:'success',
            expense
        })

    }catch(err){
        res.status(400).json({
            status:'error',
            message:err.message
        })
    }
}

//@desc: create  expense
//route: PUT /api/v1/expenses/:expenseId
//access: private - user
const updateExpense = async(req,res)=> {
    const {expenseId} = req.params
    const {description,amount,date} = req.body;
    try{
        
        const expense = await Expense.findById({_id:expenseId})
        if(!expense){
            res.status(404)
            throw new Error('Expense not found')
        }

        if(description){
            expense.description = description
        }
        if(amount){
            expense.amount = amount
        }

        if(date){
            expense.date = date
        }

       const updatedExpense = await expense.save();

        res.status(201).json({
            status:'success',
            updatedExpense
        })

    }catch(err){
        res.status(400).json({
            status:'error',
            message:err.message
        })
    }
}


//@desc: delete  expense
//route: DELETE /api/v1/expenses/:expenseId
//access: private - user
const deleteExpense = async(req,res)=> {
    const {expenseId} = req.params
    try{
        
        const expense = await Expense.findById({_id:expenseId})
        if(!expense){
            res.status(404)
            throw new Error('Expense not found')
        }

        await expense.remove();

        res.status(201).json({
            status:'success',
            message:'Expense successfully deleted'
        })

    }catch(err){
        res.status(400).json({
            status:'error',
            message:err.message
        })
    }
}


//@desc: get all users expenses
//route: GET /api/v1/expenses
//access: private - admin

const allExpenses = async(req,res)=> {
    try{
        const expenses = await Expense.find({}).sort({_id:-1})

        res.status(200).json({
            status:'success',
            expenses
        })

    }catch(err){
        res.status(404).json({
            message:err.message
        })
        
    }
}

//@desc: get user specific expenses
//route: GET /api/v1/expenses/my-expenses
//access: private - user
const myExpenses = async(req,res)=> {
    try{
        const expenses = await Expense.find({user:req.user._id}).sort({_id:-1})
         
        console.log(expenses)
        res.status(200).json({
            status:'success',
            expenses
        })

    }catch(err){
        console.log(err)
        res.status(400).json({ 
            status:'error',
            message:err.message
        })
    }
}

 
export {
    myExpenses,
    allExpenses,
    createExpense,
    deleteExpense,
    updateExpense,
    getSingleExpense
}