import express from "express";

const router = express.Router();

router.use("/static", express.static("server/admin/public"))

router.get("/", (req, res) => {
    return res.render("home", { title: "Admin Panel" })
})

router.get("/tickets", (req, res) => {
    return res.render("tickets", { title: "Tickets Management" })
})

/**
 * Events Management Page
 */
router.get("/events", (req, res) => {
    return res.render("events/index", { title: "Events Management " })
})

/**
 * Endpoint to create a new event
 */
router.post("/events", (req, res) => {
    return res.redirect("/admin/events")
})

/**
 * Page to create a new event
 */
router.get("/events/new", (req, res) => {
    return res.render("events/new", { title: "Create New Event" })
})

/**
 * Page to view event details
 */
router.get("/events/:id", (req, res) => {
    return res.render("events/details", { title: "Event Details" })
})

/**
 * Endpoint to update event details
 */
router.post("/events/:id", (req, res) => {
    return res.redirect("/admin/events/:id")
})

/**
 * Page to edit event details
 */
router.get("/events/:id/edit", (req, res) => {
    return res.render("events/edit", { title: "Edit Event" })
})

/**
 * Endpoint to delete an event
 */
router.post("/events/:id/delete", (req, res) => {
    return res.redirect("/admin/events")
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