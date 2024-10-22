import { Router } from "express";
import { makeQuery } from "../helpers/functions.mjs";

const router = Router();

router.get("/", async (req, res) => {
    try {

        const participant = await makeQuery("MATCH (u:Participant) RETURN u")
        const partners = await makeQuery("MATCH (p:Partner) RETURN p")

        console.log(...participant)


        return res.render("users/index", { title: "Users Management", participants: [...participant], partners: [...partners] })
    } catch (error) {
        return res.status(500).send("Internal Server Error")
    }
})

export default router;