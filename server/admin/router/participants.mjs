import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
    try {
        return res.render("participants/index", { title: "Participants Management" })
    } catch (error) {
        return res.status(500).send("Internal Server Error")
    }
})

export default router;