import { Router } from "express";
import { makeQuery } from "../helpers/functions.mjs";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const participant = await makeQuery("MATCH (u:Participant) RETURN u")

        return res.render("participants/index", { title: "Participants Management", participants: [...participant] })
    } catch (error) {
        return res.status(500).send("Internal Server Error")
    }
})

export default router;