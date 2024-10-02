import express from "express";
import { makeQuery } from "../helpers/functions.mjs";

const router = express.Router();


/**
 * Events Management Page
 */
router.get("/", async (req, res) => {
	try {
		const events = await makeQuery("MATCH (e:Event) RETURN e ORDER BY e.start DESC")
		return res.render("events/index", { title: "Events Management", events: [...events] })
	} catch (error) {
		console.error(error)
		return res.status(500).send("Internal Server Error")
	}
})

/**
 * Endpoint to create a new event
 */
router.post("/", async (req, res) => {
	try {
		return res.redirect("/admin/events")
	} catch (error) {
		console.error(error)
		return res.redirect("/admin/events/new")
	}
})

/**
 * Page to create a new event
 */
router.get("/new", (req, res) => {
	return res.render("events/new", { title: "Create New Event" })
})

/**
 * Page to view event details
 */
router.get("/:id", (req, res) => {
	return res.render("events/details", { title: "Event Details" })
})

/**
 * Endpoint to update event details
 */
router.post("/:id", (req, res) => {
	return res.redirect("/admin/events/:id")
})

/**
 * Page to edit event details
 */
router.get("/:id/edit", (req, res) => {
	return res.render("events/edit", { title: "Edit Event" })
})

/**
 * Endpoint to delete an event
 */
router.post("/:id/delete", (req, res) => {
	return res.redirect("/admin/events")
})


export default router;