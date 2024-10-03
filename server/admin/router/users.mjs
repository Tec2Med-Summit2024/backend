import { Router } from "express";
import { makeQuery } from "../helpers/functions.mjs";

const router = Router();

router.get("/", async (req, res) => {
    try {

        const attendees = await makeQuery("MATCH (u:Attendee) RETURN u")
        const partners = await makeQuery("MATCH (p:Partner) RETURN p")

        console.log(...attendees)


        return res.render("users/index", { title: "Users Management", attendees: [...attendees], partners: [...partners] })
    } catch (error) {
        return res.status(500).send("Internal Server Error")
    }
})

export default router;