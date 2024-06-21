import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    return res.render("home", { title: "Admin Panel" })
})

export default router;