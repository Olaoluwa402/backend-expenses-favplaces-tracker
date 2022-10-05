import express from 'express'
const router = express.Router();
import {myExpenses, allExpenses, createExpense,deleteExpense,updateExpense,getSingleExpense} from '../controllers/Expenses.js'
import {protect} from '../middleware/auth.js'

router.route('/').get(protect,allExpenses).post(protect,createExpense)
router.route('/my-expenses').get(protect,myExpenses)
router.route('/:expenseId')
    .get(protect,getSingleExpense)
    .put(protect,updateExpense)
    .delete(protect,deleteExpense)



 
export default router