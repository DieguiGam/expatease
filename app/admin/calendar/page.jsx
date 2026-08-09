"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default function CalendarPage() {
  const router = useRouter();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/admin/login");
      return;
    }

    await loadAppointments();
  }

  async function loadAppointments() {
    setLoading(true);

    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .in("status", ["confirmed", "completed"])
      .order("preferred_date", { ascending: true });

    if (error) {
      console.error("Error loading calendar:", error);
    } else {
      setRequests(data || []);
    }

    setLoading(false);
  }

  const appointmentsByDate = useMemo(() => {
    const grouped = {};

    requests.forEach((request) => {
      const date = request.preferred_date;

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(request);
    });

    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) => {
        return getStartMinutes(a.preferred_time) -
          getStartMinutes(b.preferred_time);
      });
    });

    return grouped;
  }, [requests]);

  function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(`${dateString}T12:00:00`);

    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  function statusStyle(status) {
    if (status === "completed") {
      return {
        color: "#175cd3",
        background: "#eff8ff",
      };
    }

    return {
      color: "#157347",
      background: "#ecfdf3",
    };
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px 24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                color: "#e4b43f",
                fontWeight: 800,
                marginBottom: "4px",
              }}
            >
              EXPATEASE ADMIN
            </p>

            <h1
              style={{
                margin: 0,
                color: "#07182d",
                fontSize: "36px",
              }}
            >
              Calendar
            </h1>

            <p
              style={{
                color: "#667085",
                marginTop: "8px",
              }}
            >
              Confirmed appointments and completed services.
            </p>
          </div>

          <Link
            href="/admin"
            style={{
              background: "#07182d",
              color: "#ffffff",
              padding: "12px 18px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Back to Dashboard
          </Link>
        </div>

        <div style={{ marginTop: "36px" }}>
          {loading ? (
            <EmptyCard text="Loading appointments..." />
          ) : Object.keys(appointmentsByDate).length === 0 ? (
            <EmptyCard text="No confirmed appointments yet." />
          ) : (
            Object.entries(appointmentsByDate).map(
              ([date, appointments]) => (
                <section
                  key={date}
                  style={{
                    marginBottom: "32px",
                  }}
                >
                  <h2
                    style={{
                      color: "#07182d",
                      marginBottom: "14px",
                    }}
                  >
                    {formatDate(date)}
                  </h2>

                  <div
                    style={{
                      display: "grid",
                      gap: "14px",
                    }}
                  >
                    {appointments.map((appointment) => {
                      const badge = statusStyle(
                        appointment.status
                      );

                      const duration =
                        Number(
                          appointment.estimated_duration ??
                            60
                        );

                      const buffer =
                        Number(
                          appointment.buffer_time ??
                            30
                        );

                      const startMinutes =
                        getStartMinutes(
                          appointment.preferred_time
                        );

                      const endMinutes =
                        startMinutes + duration + buffer;

                      const startLabel =
                        formatMinutes(startMinutes);

                      const endLabel =
                        formatMinutes(endMinutes);

                      return (
                        <div
                          key={appointment.id}
                          style={{
                            background: "#ffffff",
                            border:
                              "1px solid #e4e7ec",
                            borderRadius: "16px",
                            padding: "22px",
                            boxShadow:
                              "0 5px 16px rgba(16,24,40,.05)",
                          }}
                        >
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns:
                                "minmax(190px, 0.8fr) minmax(220px, 1fr) minmax(200px, 1fr) auto",
                              gap: "22px",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <Label>BLOCKED TIME</Label>

                              <div
                                style={{
                                  fontWeight: 800,
                                  color: "#07182d",
                                  marginTop: "6px",
                                  fontSize: "17px",
                                }}
                              >
                                {startLabel} → {endLabel}
                              </div>

                              <div
                                style={{
                                  color: "#667085",
                                  marginTop: "6px",
                                  fontSize: "13px",
                                }}
                              >
                                Service:{" "}
                                {formatDuration(duration)}
                                {" + "}
                                Buffer:{" "}
                                {formatDuration(buffer)}
                              </div>
                            </div>

                            <div>
                              <Label>CLIENT</Label>

                              <div
                                style={{
                                  fontWeight: 800,
                                  color: "#07182d",
                                  marginTop: "5px",
                                }}
                              >
                                {appointment.full_name}
                              </div>

                              <div
                                style={{
                                  color: "#667085",
                                  marginTop: "3px",
                                }}
                              >
                                {appointment.location}
                              </div>
                            </div>

                            <div>
                              <Label>SERVICE</Label>

                              <div
                                style={{
                                  fontWeight: 700,
                                  marginTop: "5px",
                                }}
                              >
                                {appointment.service}
                              </div>

                              <div
                                style={{
                                  color: "#667085",
                                  marginTop: "3px",
                                }}
                              >
                                {appointment.reference}
                              </div>
                            </div>

                            <span
                              style={{
                                color: badge.color,
                                background:
                                  badge.background,
                                padding: "8px 12px",
                                borderRadius: "999px",
                                fontWeight: 800,
                                textTransform: "capitalize",
                                textAlign: "center",
                              }}
                            >
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )
            )
          )}
        </div>
      </div>
    </main>
  );
}

function getStartMinutes(preferredTime) {
  if (!preferredTime) return 8 * 60;

  const text = String(preferredTime);

  const match = text.match(
    /(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i
  );

  if (!match) {
    if (text.toLowerCase().includes("morning")) {
      return 8 * 60;
    }

    if (text.toLowerCase().includes("afternoon")) {
      return 12 * 60;
    }

    if (text.toLowerCase().includes("evening")) {
      return 17 * 60;
    }

    return 8 * 60;
  }

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

function formatMinutes(totalMinutes) {
  const normalized =
    ((totalMinutes % 1440) + 1440) % 1440;

  let hour = Math.floor(normalized / 60);
  const minutes = normalized % 60;

  const period = hour >= 12 ? "PM" : "AM";

  let displayHour = hour % 12;

  if (displayHour === 0) {
    displayHour = 12;
  }

  return `${displayHour}:${String(minutes).padStart(
    2,
    "0"
  )} ${period}`;
}

function formatDuration(minutes) {
  const value = Number(minutes || 0);

  if (value === 0) {
    return "None";
  }

  const hours = Math.floor(value / 60);
  const remainingMinutes = value % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} hr${hours === 1 ? "" : "s"}`;
  }

  return `${hours} hr${hours === 1 ? "" : "s"} ${remainingMinutes} min`;
}

function Label({ children }) {
  return (
    <div
      style={{
        color: "#667085",
        fontSize: "12px",
        fontWeight: 800,
      }}
    >
      {children}
    </div>
  );
}

function EmptyCard({ text }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "30px",
        borderRadius: "18px",
        border: "1px solid #e4e7ec",
        color: "#667085",
      }}
    >
      {text}
    </div>
  );
}