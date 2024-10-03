import express from "express";
import { makeQuery } from "../helpers/functions.mjs";

const router = express.Router();


/**
 * Events Management Page
 */
router.get("/", async (req, res) => {
	try {
		const events = await makeQuery("MATCH (e:Event) RETURN e ORDER BY e.start DESC")
		console.log("Events => ", events)
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
		console.log("Request Body", req.body)

		const {
			description,
			topics,
			materials,
			name,
			start_time,
			building_and_room,
			company,
			end_time,
			speaker,
		} = req.body

		if (!description || !topics || !materials || !name || !start_time || !building_and_room || !company || !end_time || !speaker) {
			console.error("Create Event => Missing Fields")
			return res.redirect("/admin/events/new")
		}

		// Create a new event node
		const response = await makeQuery(`CREATE (n: Event { description_about: $description_about, topics_covered: $topics_covered, materials_to_bring: $materials_to_bring, name: $name, start: $start, building_and_room: $building_and_room, company: $company, end: $end, speaker_instructions: $speaker_instructors })`, {
			description_about: description,
			topics_covered: topics.split(";").map(t => t.trim()),
			materials_to_bring: materials.split(";").map(m => m.trim()),
			name,
			start: new Date(start_time).toISOString(),
			building_and_room,
			company,
			end: new Date(end_time).toISOString(),
			speaker_instructors: speaker,
		})

		console.log("Query Response => ", response)

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
router.get("/:id", async (req, res) => {
	try {

		const { id } = req.params

		const event = await makeQuery("MATCH (e:Event) WHERE ID(e) = $id RETURN e", { id: id })

		return res.render("events/details", { title: "Event Details", event })
	} catch (error) {
		console.error(error)
		return res.status(500).send("Internal Server Error")
	}
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
router.get("/:id/edit", async (req, res) => {
	try {
		const { id } = req.params

		const event = await makeQuery("MATCH (e:Event) WHERE ID(e) = $id RETURN e", { id: id })
		return res.render("events/edit", { title: "Edit Event", event })
	} catch (error) {
		console.error(error)
		return res.status(500).send("Internal Server Error")
	}
})

/**
 * Endpoint to delete an event
 */
router.post("/:id/delete", (req, res) => {
	return res.redirect("/admin/events")
})


export default router;