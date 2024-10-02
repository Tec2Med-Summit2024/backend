import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
    try {
        return res.render("tickets/index", { title: "Tickets Management" })
    } catch (error) {
        return res.status(500).send("Internal Server Error")
    }
})

router.get("/new", async (req, res) => {
    try {
        return res.render("tickets/new", { title: "Create New Ticket" })
    } catch (error) {
        return res.status(500).send("Internal Server Error")
    }
})



export default router;