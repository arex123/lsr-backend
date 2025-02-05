import express from 'express'
import { getTodaysProblem, isSolved, unCheck } from '../controllers/problemController.js'
const router = express.Router()

router.get('/check',isSolved)
router.post('/uncheck',unCheck)
router.get('/getTodaysProblem/:email',getTodaysProblem)

export default router