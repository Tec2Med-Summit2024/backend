import { Router } from "express";
import { makeQuery } from "../helpers/functions.mjs";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const partners = await makeQuery("MATCH (p:Partner) RETURN p")

        console.log(partners[0])

        return res.render("partners/index", { title: "Partners Management", partners: [...partners] })
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
        return res.redirect("/admin/partners")
    } catch (error) {
        return res.status(500).send("Internal Server Error")
    }
})

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params

        const partner = await makeQuery("MATCH (p:Partner) WHERE ID(p) = $id RETURN p", { id: id })

        return res.render("partners/details", { title: "Partner Details", partner })
    } catch (error) {
        console.error(error)
        return res.status(500).send("Internal Server Error")
    }
})

router.get("/:id/edit", (req, res) => {
    return res.redirect("/admin/partners/:id")
})

router.post("/:id/edit", (req, res) => {
    return res.redirect("/admin/partners/:id")
})

export default router;