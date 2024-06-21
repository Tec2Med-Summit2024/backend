import express from "express";

const router = express.Router();

router.use("/static", express.static("server/admin/public"))

router.get("/", (req, res) => {
    return res.render("home", { title: "Admin Panel" })
})

router.get("/tickets", (req, res) => {
    return res.render("tickets", { title: "Tickets Management" })
})

router.get("/events", (req, res) => {
    return res.render("events", { title: "Events Management " })
})

router.get("/users", (req, res) => {
    return res.render("users", { title: "Users Management" })
})

router.get("/attendees", (req, res) => {
    return res.render("attendees", { title: "Attendees Management" })
})

router.get("/partners", (req, res) => {
    return res.render("partners", { title: "Partners Management" })
})

export default router;