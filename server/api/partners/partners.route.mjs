import express from "express"
// remove this comment and add your controller functions
import { } from "./partners.controller.mjs"

const router = express.Router();

router.get('/:username', (req, res) => {
    res.json({ message: 'Hello World' })
})

router.post('/:username/cvs', (req, res) => {
    res.send('User List')
})

router.get('/:username/cvs/:id', (req, res) => {
    res.send('Returning CV with id='+res.param.id)
})

export default router;
