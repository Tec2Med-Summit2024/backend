import { Router } from "express";
import { makeQuery } from "../helpers/functions.mjs";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const participants = await makeQuery("MATCH (u:Participant) RETURN u")

        console.log(participants[0])

        return res.render("participants/index", { title: "Participants Management", participants: [...participants] })
    } catch (error) {
        return res.status(500).send("Internal Server Error")
    }
})

router.get("/create", async (req, res) => {
    try {
        return res.render("participants/create", { title: "Create New Participant" })
    } catch (error) {
        return res.status(500).send("Internal Server Error")
    }
})

router.post("/create", async (req, res) => {
    try {
        return res.redirect("/admin/participants")
    } catch (error) {
        return res.status(500).send("Internal Server Error")
    }
})

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params

        const participant = await makeQuery("MATCH (u:Participant) WHERE ID(u) = $id RETURN u", { id: id })

        return res.render("participants/details", { title: "Participant Details", participant })
    } catch (error) {
        console.error(error)
        return res.status(500).send("Internal Server Error")
    }
})

router.get("/:id/edit", (req, res) => {
    return res.redirect("/admin/participants/:id")
})

router.post("/:id/edit", (req, res) => {
    return res.redirect("/admin/participants/:id")
})

export default router;