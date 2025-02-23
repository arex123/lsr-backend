import express from 'express'
import { getSolvedProblems, handleNewProblem,  handleRevisionProblem,  newGetTodaysProblem } from '../controllers/new.js'
const router = express.Router()

router.get('/getTodaysProblem/:email',newGetTodaysProblem)

router.post('/api/newProblemSolved',handleNewProblem)

router.post('/api/revisionProblemSolved',handleRevisionProblem)

router.get('/api/solvedProblemIds/:email',getSolvedProblems)

export default router