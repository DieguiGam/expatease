"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
const WHATSAPP_NUMBER = "593996021267";
const SERVICE_OPTIONS = [
  "Home Services",
  "Paperwork Assistance",
  "Translation and Interpretation",
  "Grocery and Errand Assistance",
  "Housing Assistance",
  "Other Request",
];

const SERVICES = [
  { icon: "⌂", title: "Home Services", text: "Plumbing, electrical work, repairs, cleaning, painting, gardening, and more." },
  { icon: "▤", title: "Paperwork Assistance", text: "Appointments, government procedures, utilities, internet setup, and local guidance." },
  { icon: "文", title: "Translation and Interpretation", text: "Language support for calls, appointments, documents, and everyday communication." },
  { icon: "▣", title: "Grocery and Errand Assistance", text: "Help with supermarket purchases, errands, and delivery coordination." },
  { icon: "⌂", title: "Housing Assistance", text: "Support with rentals, moving, furniture, utilities, and settling into your new home." },
  { icon: "✦", title: "Other Request", text: "Tell us what you need. We will review your request and help find the right solution." },
];

function pad(value) { return String(value).padStart(2, "0"); }
function isoDate(date) { return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`; }
function humanDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    .format(new Date(`${value}T12:00:00`));
}

function Calendar({ value, onChange }) {
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const cells = Array(first.getDay()).fill(null);
    for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(month.getFullYear(), month.getMonth(), d));
    return cells;
  }, [month]);

  return (
    <div className="calendar" aria-label="Choose a date">
      <div className="calendarHeader">
        <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>‹</button>
        <strong>{new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(month)}</strong>
        <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button>
      </div>
      <div className="weekdays">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(day => <span key={day}>{day}</span>)}</div>
      <div className="calendarGrid">
        {days.map((date, index) => {
          if (!date) return <span key={`blank-${index}`} />;
          const closed = date.getDay() === 0;
          const past = date < today;
          const disabled = closed || past;
          const selected = value === isoDate(date);
          return (
            <button
              key={isoDate(date)} type="button" disabled={disabled}
              className={`${closed ? "closed" : "available"} ${selected ? "selected" : ""}`}
              onClick={() => onChange(isoDate(date))}
              title={closed ? "Closed on Sundays" : "Available"}
            >{date.getDate()}</button>
          );
        })}
      </div>
      <div className="legend"><span><i className="dot availableDot" />Available</span><span><i className="dot closedDot" />Closed</span></div>
    </div>
  );
}

export default function Home() {
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [year, setYear] = useState(2026);
  const [occupiedTimes, setOccupiedTimes] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  useEffect(() => setYear(new Date().getFullYear()), []);
  useEffect(() => {
  async function loadAvailability() {
    if (!date) {
      setOccupiedTimes([]);
      return;
    }

    setLoadingAvailability(true);

    const { data, error } = await supabase.rpc(
      "get_booked_times",
      {
        requested_date: date,
      }
    );

    if (error) {
      console.error(
        "Error loading availability:",
        error
      );

      setOccupiedTimes([]);
      setLoadingAvailability(false);
      return;
    }

    const blockedTimes = [];

    (data || []).forEach((booking) => {
      const start = timeToMinutes(
        booking.preferred_time
      );

      const duration = Number(
        booking.estimated_duration || 60
      );

      const buffer = Number(
        booking.buffer_time || 30
      );

      const end = start + duration + buffer;

      for (
        let minute = start;
        minute < end;
        minute += 30
      ) {
        blockedTimes.push(
          minutesToTime(minute)
        );
      }
    });

    setOccupiedTimes([
      ...new Set(blockedTimes),
    ]);

    setLoadingAvailability(false);
  }

  loadAvailability();
}, [date]);

  const selectedDay = date ? new Date(`${date}T12:00:00`).getDay() : null;
const times = selectedDay === 6
  ? [
      "8:00 AM",
      "8:30 AM",
      "9:00 AM",
      "9:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "12:00 PM",
      "12:30 PM",
      "1:00 PM",
      "1:30 PM",
      "2:00 PM",
      "2:30 PM",
      "3:00 PM",
      "3:30 PM",
      "4:00 PM",
      "4:30 PM",
      "5:00 PM",
      "5:30 PM",
      "6:00 PM",
      "6:30 PM",
      "7:00 PM",
      "7:30 PM",
      "8:00 PM",
    ]
  : [
      "8:00 AM",
      "8:30 AM",
      "9:00 AM",
      "9:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "12:00 PM",
      "12:30 PM",
      "1:00 PM",
      "1:30 PM",
      "2:00 PM",
      "2:30 PM",
      "3:00 PM",
      "3:30 PM",
      "4:00 PM",
      "4:30 PM",
      "5:00 PM",
    ];

  const chooseService = (title) => {
    setSelectedService(title);
    document.getElementById("request")?.scrollIntoView({ behavior: "smooth" });
  };

  const submit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const selected = String(form.get("date") || "");
    if (!selected) { setStatus("Please choose a preferred date."); return; }
    if (new Date(`${selected}T12:00:00`).getDay() === 0) { setStatus("We are closed on Sundays. Please choose Monday through Saturday."); return; }

    const uniqueCode = crypto.randomUUID().split("-")[0].toUpperCase();
const reference = `EX-${new Date().getFullYear()}-${uniqueCode}`;
    const submitted = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeStyle: "short" }).format(new Date());
    const countryCode = String(form.get("countryCode") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const whatsappNumber = `${countryCode} ${phone}`.trim();
    const { error } = await supabase
  .from("requests")
  .insert([
    {
      reference: reference,
      full_name: String(form.get("name") || ""),
      whatsapp: whatsappNumber,
      email: String(form.get("email") || ""),
      location: String(form.get("location") || ""),
      service: String(form.get("service") || ""),
      preferred_date: selected,
      preferred_time: String(form.get("time") || ""),
      details: String(form.get("details") || ""),
      status: "pending",
      price: null,
      internal_notes: null,
    },
  ]);

if (error) {
  console.error("Supabase error:", error);
  setStatus("We couldn't save your request. Please try again.");
  return;
}
    const message = [
      "------------------------------",
      "*NEW SERVICE REQUEST*",
      "------------------------------",
      "",
      `*Reference:* ${reference}`,
      `*Submitted:* ${submitted}`,
      "",
      `*Name:* ${form.get("name")}`,
      `*WhatsApp:* ${whatsappNumber}`,
      `*Email:* ${form.get("email") || "Not provided"}`,
      `*Location:* ${form.get("location")}`,
      `*Service:* ${form.get("service")}`,
      `*Preferred date:* ${humanDate(selected)}`,
      `*Preferred time:* ${form.get("time")}`,
      "",
      "*Details:*",
      String(form.get("details") || ""),
    ].join("\n");

    setStatus(`Request ${reference} is ready. Opening WhatsApp…`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <header className="siteHeader">
        <a className="brand" href="#home" aria-label="ExpatEase home">
          <Image src="/expatease-logo.jpg" alt="ExpatEase logo" width={42} height={42} />
          <span>Expat<em>Ease</em></span>
        </a>
        <nav><a href="#services">Services</a><a href="#how">How it works</a><a href="#request">Request assistance</a></nav>
        <a className="button small" href="#request">Get Assistance</a>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="heroOverlay" />
          <div className="heroContent">
            <span className="eyebrow">LOCAL SUPPORT FOR EXPATS IN ECUADOR</span>
            <h1>Life in Ecuador,<br /><span>made easier.</span></h1>
            <p>Your trusted local assistant for everyday needs, paperwork, translation, housing, errands, and reliable local services.</p>
            <div className="heroActions"><a className="button" href="#request">Request Assistance</a><a className="ghostButton" href="#services">Explore Services</a></div>
            <div className="trustRow"><span>English-speaking support</span><span>Trusted local connections</span><span>Personalized assistance</span></div>
          </div>
        </section>

        <section id="services" className="section servicesSection">
          <div className="sectionIntro"><span className="eyebrow dark">WHAT DO YOU NEED TODAY?</span><h2>One trusted contact.<br />Many local solutions.</h2><p>Choose the service that best matches your need. You can explain the details in the request form.</p></div>
          <div className="serviceGrid">
            {SERVICES.map(service => <button key={service.title} type="button" className={`serviceCard ${service.title === "Other Request" ? "featured" : ""}`} onClick={() => chooseService(service.title)}><span className="serviceIcon">{service.icon}</span><h3>{service.title}</h3><p>{service.text}</p><b>Request this service →</b></button>)}
          </div>
        </section>

        <section id="how" className="section howSection">
          <div className="sectionIntro centered"><span className="eyebrow dark">SIMPLE AND PERSONAL</span><h2>How it works</h2></div>
          <div className="steps"><article><span>01</span><h3>Tell us what you need</h3><p>Choose a service and submit your preferred date, time, and contact details.</p></article><article><span>02</span><h3>We review your request</h3><p>We assess the request, location, schedule, and the appropriate local solution.</p></article><article><span>03</span><h3>We confirm everything</h3><p>We contact you through WhatsApp to confirm details, availability, and next steps.</p></article></div>
        </section>

        <section className="confidenceSection"><div><span className="eyebrow">WHY EXPATEASE?</span><h2>Local knowledge.<br />Personal support.</h2></div><div className="confidenceGrid"><span><b>English</b>Friendly communication</span><span><b>Monday–Saturday</b>Flexible weekly availability</span><span><b>Trusted</b>Independent local providers</span><span><b>Personalized</b>Support based on your request</span></div></section>

        <section id="request" className="section requestSection">
          <div className="requestIntro"><span className="eyebrow dark">REQUEST ASSISTANCE</span><h2>Tell us how we can help.</h2><p>Complete the form. Your information will be organized into a WhatsApp message for faster confirmation.</p><div className="hours"><strong>Opening hours</strong><span>Monday–Friday: 8:00 AM–5:00 PM</span><span>Saturday: 8:00 AM–8:00 PM</span><span>Sunday: Closed</span></div></div>
          <form className="requestForm" onSubmit={submit}>
            <div className="formGrid">
              <label><span>Full name</span><input name="name" required autoComplete="name" placeholder="John Smith" /></label>
              <label>
                <span>WhatsApp number</span>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span>(</span>
                  <input
                    name="countryCode"
                    type="tel"
                    inputMode="tel"
                    required
                    placeholder="+1"
                    aria-label="Country code"
                    style={{ width: "78px", textAlign: "center", flex: "0 0 78px" }}
                  />
                  <span>)</span>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    required
                    autoComplete="tel"
                    placeholder="555 000 0000"
                    aria-label="WhatsApp phone number"
                    style={{ flex: 1, minWidth: 0 }}
                  />
                </div>
                <small>Enter your country code in parentheses, then your WhatsApp number.</small>
              </label>
              <label><span>Email</span><input name="email" type="email" autoComplete="email" placeholder="john@email.com" /></label>
              <label><span>Location</span><input name="location" required placeholder="Cuenca, El Centro" /></label>
              <label><span>Service</span><select name="service" required value={selectedService} onChange={e => setSelectedService(e.target.value)}><option value="">Choose a service</option>{SERVICE_OPTIONS.map(option => <option key={option}>{option}</option>)}</select></label>
              <div className="dateField"><span>Preferred date</span><input type="hidden" name="date" value={date} /><div className="dateDisplay">{date ? humanDate(date) : "Select a date below"}</div><Calendar value={date} onChange={setDate} /></div>
              <label><span>Preferred time</span><select
  name="time"
  required
  disabled={!date || loadingAvailability}
><option value="">
  {!date
    ? "Select a date first"
    : loadingAvailability
    ? "Checking availability..."
    : "Choose a time"}
</option>{date &&
  times.map((time) => {
    const isOccupied = occupiedTimes.includes(time);

    return (
      <option
        key={time}
        value={time}
        disabled={isOccupied}
      >
        {isOccupied ? `${time} — Already occupied` : time}
      </option>
    );
  })}</select><small>{selectedDay === 6 ? "Saturday hours: 8:00 AM–8:00 PM" : "Monday–Friday hours: 8:00 AM–5:00 PM"}</small></label>
              <label className="full"><span>Describe what you need</span><textarea name="details" rows={5} required placeholder="Please describe the situation, what you need, and any important details..." /></label>
              <label className="checkbox full"><input name="consent" type="checkbox" required /><span>I authorize ExpatEase to contact me regarding this request.</span></label>
            </div>
            <button className="button submitButton" type="submit">Submit Request</button>
            <p className={`formStatus ${status.toLowerCase().includes("please") || status.toLowerCase().includes("closed") ? "error" : ""}`}>{status}</p>
          </form>
        </section>
      </main>

      <footer><div className="footerGrid"><div><strong>ExpatEase</strong><p>Your trusted local assistant in Ecuador.</p></div><div><strong>Contact</strong><a href="https://wa.me/593996021267" target="_blank" rel="noreferrer">WhatsApp Business: 0996021267</a><span>Cuenca, Ecuador</span></div><div><strong>Important</strong><p>ExpatEase coordinates assistance and independent local providers. Final prices are confirmed after service.</p></div></div><div className="footerBottom">© {year} ExpatEase. All rights reserved.</div></footer>
    </>
  );
}
function timeToMinutes(time) {
  if (!time) return 0;

  const match = String(time).match(
    /(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i
  );

  if (!match) return 0;

  let hour = Number(match[1]);
  const minutes = Number(match[2] || 0);
  const period = match[3].toUpperCase();

  if (period === "AM" && hour === 12) {
    hour = 0;
  }

  if (period === "PM" && hour !== 12) {
    hour += 12;
  }

  return hour * 60 + minutes;
}

function minutesToTime(totalMinutes) {
  let hour = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const period = hour >= 12 ? "PM" : "AM";

  let displayHour = hour % 12;

  if (displayHour === 0) {
    displayHour = 12;
  }

  return `${displayHour}:${String(
    minutes
  ).padStart(2, "0")} ${period}`;
}