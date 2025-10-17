import express from 'express'
import { getSolvedProblems, handleNewProblem,  handleRevisionProblem,  newGetTodaysProblem, getProblemScheduleDetails, deleteProblemSchedule, resetProblemSchedule, getNotes, addNote, updateNote, deleteNote } from '../controllers/new.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

router.get('/getTodaysProblem',newGetTodaysProblem)

router.post('/api/newProblemSolved',handleNewProblem)

router.post('/api/revisionProblemSolved',handleRevisionProblem)

router.get('/api/solvedProblemIds',getSolvedProblems)

router.get('/api/problemSchedule/:problemId',getProblemScheduleDetails)

router.post('/api/problemSchedule/:problemId/reset',resetProblemSchedule)

router.delete('/api/problemSchedule/:problemId',deleteProblemSchedule)

// Notes routes
router.get('/api/problemSchedule/:problemId/notes', getNotes)
router.post('/api/problemSchedule/:problemId/notes', addNote)
router.put('/api/problemSchedule/:problemId/notes/:noteId', updateNote)
router.delete('/api/problemSchedule/:problemId/notes/:noteId', deleteNote)

export default router