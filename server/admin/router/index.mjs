import express from "express";

import participantsRouter from "./participants.mjs"
import eventsRouter from "./events.mjs"
import partnersRouter from "./partners.mjs"
import ticketsRouter from "./tickets.mjs"
import usersRouter from "./users.mjs"

const router = express.Router();

router.use((req, res, next) => {
    next()
})

router.use(express.urlencoded({ extended: false }))
router.use(express.json())
router.use("/static", express.static("server/admin/public"))


router.use("/participants", participantsRouter)
router.use("/events", eventsRouter)
router.use("/partners", partnersRouter)
router.use("/tickets", ticketsRouter)
router.use("/users", usersRouter)

router.get("/", (req, res) => {
    return res.render("home", { title: "Admin Panel" })
})

export default router;