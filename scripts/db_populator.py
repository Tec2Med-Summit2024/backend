import csv
import random
from faker import Faker
from datetime import datetime, timedelta

fake = Faker()

# Define possible values for expertise, interests, event types, etc.
expertise_options = ["3D Printing", "3D Modelling", "Aerospace medicine", "Artificial reality", 
                     "Artificial Intelligence", "Biomaterials", "Biomedical imaging", "Bionic systems",
                     "Biosignals", "Cell & Tissue Engineering", "Cleantech", "Data modelling", 
                     "Data science", "Dentistry", "Exoskeletons", "Epidemics", "Ethics", "Genetics", 
                     "Hardware & robotics", "Integrative medicine", "Machine Learning", "Neuroscience", 
                     "Nuclear medicine", "Psychiatry", "Scientific writing", "Surgery", 
                     "Telecommunications", "Virtual reality"]

EVENT_TYPES = ["Masterclass", "Debate", "Roundtable", "Workshop", "Talk"]

# Create Participants
def generate_participant(participant_id):
    return {
        "participant_id": participant_id,
        "name": fake.name(),
        "website": fake.url(),
        "photo_id": fake.uuid4(),
        "facebook": fake.url(),
        "biography": fake.text(),
        "instagram": fake.url(),
        "linkedin": fake.url(),
        "ticket_id": fake.uuid4(),
        "expertise": random.sample(expertise_options, random.randint(1, 3)),
        "type": random.sample(["Attendee", "Speaker", "Instructor"], random.randint(1, 3)),
        "field_of_study_work_research": fake.job(),
        "institution": fake.company(),
        "qr_code": fake.uuid4(),
        "interests": random.sample(expertise_options, random.randint(1, 5)),
        "current_location": fake.city(),
        "username": fake.user_name()
    }


# Random dates for events
def random_event_date():
    start_date = datetime(2024, 10, 9, 9)  # Starting from 9:00 AM on October 9th, 2024
    total_half_hours = (5 * 8 * 2)  # Total half-hour slots in 5 days (8 hours * 2 half-hour slots per hour)
    
    # Pick a random half-hour slot within the working hours (9:00 AM to 5:00 PM)
    random_half_hour = random.randint(0, total_half_hours - 1)
    random_minutes = random_half_hour * 30
    
    # Add the random minutes to the start date
    return start_date + timedelta(minutes=random_minutes)

# Create Events
def generate_event(event_id, speakers_instructors):
    start = random_event_date()
    
    # Choose a duration of 1 hour, 1.5 hours, or 2 hours
    event_duration = random.choice([60, 90, 120])
    
    # Calculate the end time
    end = start + timedelta(minutes=event_duration)
    
    # Ensure the event ends by 5:00 PM (17:00) at the latest
    end_limit = start.replace(hour=17, minute=0, second=0, microsecond=0)
    
    # If the calculated end time exceeds 5:00 PM, adjust it to 5:00 PM
    if end > end_limit:
        end = end_limit
        
    return {
        "event_id": event_id,
        "name": f"Event {event_id}",
        "description_about": fake.text(),
        "topics_covered": random.sample(expertise_options, random.randint(1, 5)),
        "materials_to_bring": fake.words(3),
        "start": start.strftime('%Y/%m/%dT%H:%M'),
        "end": end.strftime('%Y/%m/%dT%H:%M'),
        "building_and_room": fake.address(),
        "company": fake.company(),
        "speakers_instructors": random.sample(speakers_instructors, random.randint(1, 5))  # Select instructors/speakers for event
    }

def generate_event_type(event_type):
    return {
        "name": event_type
    }

# Create Partners
def generate_partner(partner_id):
    return {
        "partner_id": partner_id,
        "name": fake.company(),
        "website_link": fake.url(),
        "area_sector": fake.bs(),
        "headquarters": fake.city(),
        "logo_id": fake.uuid4(),
        "facebook_link": fake.url(),
        "instagram_link": fake.url(),
        "linkedin_link": fake.url(),
        "biography": fake.text(),
        "interests": random.sample(expertise_options, random.randint(1, 5)),
        "username": fake.user_name()
    }

# Create Certificates
def generate_certificate(event_id, username):
    return {
        "cert_id": f"{event_id}e#{username}"
    }

# Create Questions
def generate_question(question_id, event_id):
    return {
        "question_id": question_id,
        "content": fake.sentence(),
        "event_id": event_id  # Link question to an event
    }

# Generate the CSVs for nodes and relationships
def export_to_csv(participants, events, event_types, partners, certificates, questions, relationships):
    # Export Participants
    with open('participants.csv', 'w', newline='') as csvfile:
        fieldnames = participants[0].keys()
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for participant in participants:
            writer.writerow(participant)

    # Export Events
    with open('events.csv', 'w', newline='') as csvfile:
        fieldnames = events[0].keys()
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for event in events:
            writer.writerow(event)

    # Export EventTypes
    with open('event_types.csv', 'w', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer = csv.writer(csvfile)
        writer.writerow(["Event", "Type"])
        for event in events:
            writer.writerow([event["name"], random.choice(event_types)])

    # Export Partners
    with open('partners.csv', 'w', newline='') as csvfile:
        fieldnames = partners[0].keys()
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for partner in partners:
            writer.writerow(partner)

    # Export Certificates
    with open('certificates.csv', 'w', newline='') as csvfile:
        fieldnames = certificates[0].keys()
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for certificate in certificates:
            writer.writerow(certificate)

    # Export Questions
    with open('questions.csv', 'w', newline='') as csvfile:
        fieldnames = questions[0].keys()
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for question in questions:
            writer.writerow(question)

    # Export Relationships
    with open('relationships.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["StartNode", "Relationship", "EndNode"])
        for rel in relationships:
            writer.writerow(rel)

# Main generator
def generate_data():
    num_participants = 10000
    num_events = 3000
    num_partners = 500
    num_questions = 5000
    participants = [generate_participant(i) for i in range(1, num_participants+1)]
    partners = [generate_partner(i) for i in range(1, num_partners+1)]
    
    # Collect participants with "Speaker" or "Instructor" roles for events
    speakers_instructors = [p["username"] for p in participants if "Speaker" in p["type"] or "Instructor" in p["type"]]
    
    events = [generate_event(i, speakers_instructors) for i in range(1, num_events+1)]

    event_types = [generate_event_type(et) for et in EVENT_TYPES]
    
    certificates = []
    relationships = []

    # Question counter for each event
    event_question_counts = {event["event_id"]: 0 for event in events}

    # Generate relationships    
    for p in participants:
        # Participant FOLLOWS Partner
        for _ in range(random.randint(1, 5)):
            relationships.append((p["username"], "FOLLOWS", random.choice(partners)["username"]))

        # Participant GOES_TO Event
        event_count = random.randint(1, 11)
        chosen_events = random.sample(events, event_count)
        for event in chosen_events:
            if p["username"] not in event["speakers_instructors"]:
                relationships.append((p["username"], "GOES_TO", event["event_id"]))
                # Generate Certificates if necessary
                certificate = generate_certificate(event["event_id"], p["username"])
                certificates.append(certificate)
                relationships.append((p["username"], "GETS", certificate["cert_id"]))
                relationships.append((event["event_id"], "GIVES", certificate["cert_id"]))

    # Speaker/Instructor PRESENTS Event
    for si in speakers_instructors:
        for event in events:
            if si in event["speakers_instructors"]:
                relationships.append((si, "PRESENTS", event["event_id"]))
    questions = []
    # Create Questions and their relationships
    for _ in range(1, num_questions + 1):
        event = random.choice(events)
        event_id = event["event_id"]
        event_question_counts[event_id] += 1  # Increment question count for this event

        question_number = event_question_counts[event_id]
        question = generate_question(event_id, question_number)
        questions.append(question)
        relationships.append((question["question_id"], "ASKED_IN", event["event_id"]))

     # Generate Partner relationships with Events
    for partner in partners:
        event_count = random.randint(1, 5)
        chosen_events = random.sample(events, event_count)
        for event in chosen_events:
            relationships.append((partner["username"], "HOSTS", event["event_id"]))

    # Create Event Types and relationships
    for event in events:
        event_type = random.choice(event_types)
        relationships.append((event["event_id"], "IN_TYPE", event_type["name"]))

    # Limit relationships to 85,000
    if len(relationships) > 85000:
        print("Limiting relationships to 85,000")
        relationships = random.sample(relationships, 85000)

    export_to_csv(participants, events, event_types, partners, certificates, questions, relationships)

# Generate data and export to CSV
generate_data()
