import { Router } from "express";
import { makeQuery } from "../helpers/functions.mjs";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const partners = await makeQuery("MATCH (p:Partner) RETURN p")

        return res.render("partners/index", { title: "Partners Management", partners: [...partners] })
    } catch (error) {
        return res.status(500).send("Internal Server Error")
    }
})

export default router;