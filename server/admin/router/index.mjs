import express from "express";

const router = express.Router();

router.use("/static", express.static("server/admin/public"))

router.get("/", (req, res) => {
    return res.render("home", { title: "Admin Panel" })
})

export default router;