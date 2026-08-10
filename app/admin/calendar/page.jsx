"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

const START_MINUTES = 8 * 60;
const END_MINUTES = 20 * 60;
const SLOT_MINUTES = 30;
const SLOT_HEIGHT = 44;

export default function CalendarPage() {
  const router = useRouter();

  const [weekStart, setWeekStart] = useState(() =>
    getMonday(new Date())
  );

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const days = Array.from({ length: 6 }, (_, index) =>
    addDays(weekStart, index)
  );

  const slots = Array.from(
    {
      length:
        (END_MINUTES - START_MINUTES) /
        SLOT_MINUTES,
    },
    (_, index) =>
      START_MINUTES + index * SLOT_MINUTES
  );

  useEffect(() => {
    loadWeek();
  }, [weekStart]);

  async function loadWeek() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/admin/login");
      return;
    }

    const startDate = dateKey(weekStart);
    const endDate = dateKey(addDays(weekStart, 5));

    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .in("status", ["confirmed", "completed"])
      .gte("preferred_date", startDate)
      .lte("preferred_date", endDate)
      .order("preferred_date", {
        ascending: true,
      })
      .order("preferred_time", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Error loading calendar:",
        error
      );
      setAppointments([]);
    } else {
      setAppointments(data || []);
    }

    setLoading(false);
  }

  function previousWeek() {
    setWeekStart((current) =>
      addDays(current, -7)
    );
  }

  function nextWeek() {
    setWeekStart((current) =>
      addDays(current, 7)
    );
  }

  function goToToday() {
    setWeekStart(getMonday(new Date()));
  }

  function appointmentsForDay(day) {
    const key = dateKey(day);

    return appointments.filter(
      (appointment) =>
        appointment.preferred_date === key
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "36px 24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1500px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

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
                letterSpacing: "1px",
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
              Weekly Calendar
            </h1>

            <p
              style={{
                color: "#667085",
                marginTop: "8px",
              }}
            >
              Confirmed appointments and blocked
              working time.
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

        {/* WEEK CONTROLS */}

        <div
          style={{
            marginTop: "30px",
            marginBottom: "18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                color: "#667085",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: ".5px",
              }}
            >
              CURRENT VIEW
            </div>

            <h2
              style={{
                margin: "5px 0 0",
                color: "#07182d",
              }}
            >
              {formatWeekRange(weekStart)}
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <CalendarButton
              onClick={previousWeek}
            >
              ← Previous week
            </CalendarButton>

            <CalendarButton onClick={goToToday}>
              Today
            </CalendarButton>

            <CalendarButton onClick={nextWeek}>
              Next week →
            </CalendarButton>
          </div>
        </div>

        {/* LEGEND */}

        <div
          style={{
            display: "flex",
            gap: "18px",
            flexWrap: "wrap",
            marginBottom: "16px",
            color: "#667085",
            fontSize: "13px",
          }}
        >
          <LegendDot background="#ecfdf3">
            Confirmed
          </LegendDot>

          <LegendDot background="#eff8ff">
            Completed
          </LegendDot>

          <LegendDot background="#f2f4f7">
            Closed hours
          </LegendDot>
        </div>

        {/* CALENDAR */}

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e4e7ec",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow:
              "0 8px 24px rgba(16,24,40,.06)",
          }}
        >
          {loading ? (
            <div
              style={{
                padding: "35px",
                color: "#667085",
              }}
            >
              Loading appointments...
            </div>
          ) : (
            <div
              style={{
                overflowX: "auto",
              }}
            >
              <div
                style={{
                  minWidth: "1180px",
                }}
              >
                {/* DAY HEADERS */}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "90px repeat(6, minmax(170px, 1fr))",
                    borderBottom:
                      "1px solid #e4e7ec",
                  }}
                >
                  <div
                    style={{
                      background: "#f8fafc",
                      borderRight:
                        "1px solid #e4e7ec",
                    }}
                  />

                  {days.map((day) => {
                    const today = isToday(day);

                    return (
                      <div
                        key={dateKey(day)}
                        style={{
                          padding: "16px 12px",
                          textAlign: "center",
                          borderRight:
                            "1px solid #e4e7ec",
                          background: today
                            ? "#fff8e6"
                            : "#ffffff",
                        }}
                      >
                        <div
                          style={{
                            color: "#667085",
                            fontSize: "12px",
                            fontWeight: 800,
                            textTransform:
                              "uppercase",
                          }}
                        >
                          {formatWeekday(day)}
                        </div>

                        <div
                          style={{
                            marginTop: "5px",
                            fontSize: "24px",
                            fontWeight: 800,
                            color: today
                              ? "#b54708"
                              : "#07182d",
                          }}
                        >
                          {day.getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* TIMELINE */}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "90px repeat(6, minmax(170px, 1fr))",
                  }}
                >
                  {/* TIME COLUMN */}

                  <div
                    style={{
                      position: "relative",
                      height:
                        slots.length *
                        SLOT_HEIGHT,
                      background: "#f8fafc",
                      borderRight:
                        "1px solid #e4e7ec",
                    }}
                  >
                    {slots.map((minute) => (
                      <div
                        key={minute}
                        style={{
                          height: `${SLOT_HEIGHT}px`,
                          borderBottom:
                            "1px solid #eef1f4",
                          boxSizing:
                            "border-box",
                          paddingTop: "6px",
                          paddingRight: "10px",
                          textAlign: "right",
                          color:
                            minute % 60 === 0
                              ? "#344054"
                              : "#98a2b3",
                          fontWeight:
                            minute % 60 === 0
                              ? 700
                              : 500,
                          fontSize:
                            minute % 60 === 0
                              ? "12px"
                              : "11px",
                        }}
                      >
                        {formatMinutes(minute)}
                      </div>
                    ))}
                  </div>

                  {/* DAYS */}

                  {days.map((day, dayIndex) => {
                    const dayAppointments =
                      appointmentsForDay(day);

                    const isSaturday =
                      day.getDay() === 6;

                    return (
                      <div
                        key={dateKey(day)}
                        style={{
                          position: "relative",
                          height:
                            slots.length *
                            SLOT_HEIGHT,
                          borderRight:
                            "1px solid #e4e7ec",
                          background:
                            "repeating-linear-gradient(to bottom, transparent 0px, transparent 43px, #eef1f4 43px, #eef1f4 44px)",
                        }}
                      >
                        {/* CLOSED AREA MON-FRI */}

                        {!isSaturday && (
                          <div
                            style={{
                              position:
                                "absolute",
                              left: 0,
                              right: 0,
                              top: `${
                                ((17 * 60 -
                                  START_MINUTES) /
                                  SLOT_MINUTES) *
                                SLOT_HEIGHT
                              }px`,
                              bottom: 0,
                              background:
                                "rgba(242,244,247,.82)",
                              borderTop:
                                "1px dashed #98a2b3",
                              zIndex: 1,
                            }}
                          >
                            <div
                              style={{
                                padding:
                                  "10px",
                                color:
                                  "#98a2b3",
                                fontSize:
                                  "11px",
                                fontWeight:
                                  800,
                                textAlign:
                                  "center",
                              }}
                            >
                              CLOSED
                            </div>
                          </div>
                        )}

                        {/* APPOINTMENTS */}

                        {dayAppointments.map(
                          (appointment) => {
                            const start =
                              getStartMinutes(
                                appointment.preferred_time
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

                            const totalBlocked =
                              duration +
                              buffer;

                            const end =
                              start +
                              totalBlocked;

                            const top =
                              ((start -
                                START_MINUTES) /
                                SLOT_MINUTES) *
                              SLOT_HEIGHT;

                            const rawHeight =
                              (totalBlocked /
                                SLOT_MINUTES) *
                              SLOT_HEIGHT;

                            const height =
                              Math.max(
                                rawHeight,
                                SLOT_HEIGHT
                              );

                            const completed =
                              appointment.status ===
                              "completed";

                            return (
                              <div
                                key={
                                  appointment.id
                                }
                                title={`${appointment.full_name} — ${appointment.service}`}
                                style={{
                                  position:
                                    "absolute",
                                  top: `${Math.max(
                                    top,
                                    0
                                  )}px`,
                                  left: "6px",
                                  right: "6px",
                                  height: `${height}px`,
                                  zIndex: 3,
                                  boxSizing:
                                    "border-box",
                                  borderRadius:
                                    "12px",
                                  border:
                                    completed
                                      ? "1px solid #84caff"
                                      : "1px solid #75e0a7",
                                  background:
                                    completed
                                      ? "#eff8ff"
                                      : "#ecfdf3",
                                  padding:
                                    "9px 10px",
                                  overflow:
                                    "hidden",
                                  boxShadow:
                                    "0 4px 12px rgba(16,24,40,.08)",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize:
                                      "11px",
                                    fontWeight:
                                      800,
                                    color:
                                      completed
                                        ? "#175cd3"
                                        : "#157347",
                                    textTransform:
                                      "uppercase",
                                  }}
                                >
                                  {appointment.status}
                                </div>

                                <div
                                  style={{
                                    marginTop:
                                      "3px",
                                    fontWeight:
                                      800,
                                    color:
                                      "#07182d",
                                    fontSize:
                                      "13px",
                                    whiteSpace:
                                      "nowrap",
                                    overflow:
                                      "hidden",
                                    textOverflow:
                                      "ellipsis",
                                  }}
                                >
                                  {
                                    appointment.full_name
                                  }
                                </div>

                                <div
                                  style={{
                                    marginTop:
                                      "2px",
                                    color:
                                      "#344054",
                                    fontSize:
                                      "12px",
                                    whiteSpace:
                                      "nowrap",
                                    overflow:
                                      "hidden",
                                    textOverflow:
                                      "ellipsis",
                                  }}
                                >
                                  {
                                    appointment.service
                                  }
                                </div>

                                <div
                                  style={{
                                    marginTop:
                                      "5px",
                                    fontSize:
                                      "11px",
                                    fontWeight:
                                      700,
                                    color:
                                      "#667085",
                                  }}
                                >
                                  {formatMinutes(
                                    start
                                  )}{" "}
                                  →{" "}
                                  {formatMinutes(
                                    end
                                  )}
                                </div>

                                {height >=
                                  SLOT_HEIGHT *
                                    2 && (
                                  <div
                                    style={{
                                      marginTop:
                                        "4px",
                                      fontSize:
                                        "10px",
                                      color:
                                        "#667085",
                                    }}
                                  >
                                    Service{" "}
                                    {formatDuration(
                                      duration
                                    )}
                                    {" + "}
                                    buffer{" "}
                                    {formatDuration(
                                      buffer
                                    )}
                                  </div>
                                )}

                                {height >=
                                  SLOT_HEIGHT *
                                    2.5 && (
                                  <div
                                    style={{
                                      marginTop:
                                        "4px",
                                      fontSize:
                                        "10px",
                                      color:
                                        "#98a2b3",
                                    }}
                                  >
                                    {
                                      appointment.reference
                                    }
                                  </div>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <p
          style={{
            marginTop: "14px",
            color: "#667085",
            fontSize: "12px",
          }}
        >
          Monday–Friday: 8:00 AM–5:00 PM.
          Saturday: 8:00 AM–8:00 PM. Sunday:
          Closed.
        </p>
      </div>
    </main>
  );
}

/* -------------------------------
   CALENDAR COMPONENTS
-------------------------------- */

function CalendarButton({
  children,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: "1px solid #d0d5dd",
        background: "#ffffff",
        color: "#344054",
        padding: "10px 14px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: 700,
      }}
    >
      {children}
    </button>
  );
}

function LegendDot({
  background,
  children,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
      }}
    >
      <span
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "4px",
          background,
          border:
            "1px solid rgba(16,24,40,.08)",
        }}
      />

      {children}
    </div>
  );
}

/* -------------------------------
   DATE HELPERS
-------------------------------- */

function getMonday(date) {
  const result = new Date(date);

  result.setHours(12, 0, 0, 0);

  const day = result.getDay();

  const difference =
    day === 0 ? -6 : 1 - day;

  result.setDate(
    result.getDate() + difference
  );

  return result;
}

function addDays(date, amount) {
  const result = new Date(date);

  result.setHours(12, 0, 0, 0);

  result.setDate(
    result.getDate() + amount
  );

  return result;
}

function dateKey(date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatWeekday(date) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "short",
    }
  ).format(date);
}

function formatWeekRange(start) {
  const end = addDays(start, 5);

  const sameMonth =
    start.getMonth() === end.getMonth();

  const sameYear =
    start.getFullYear() ===
    end.getFullYear();

  if (sameMonth && sameYear) {
    const month =
      new Intl.DateTimeFormat(
        "en-US",
        {
          month: "long",
        }
      ).format(start);

    return `${month} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`;
  }

  const startText =
    new Intl.DateTimeFormat(
      "en-US",
      {
        month: "short",
        day: "numeric",
      }
    ).format(start);

  const endText =
    new Intl.DateTimeFormat(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    ).format(end);

  return `${startText} – ${endText}`;
}

function isToday(date) {
  const today = new Date();

  return (
    date.getFullYear() ===
      today.getFullYear() &&
    date.getMonth() ===
      today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/* -------------------------------
   TIME HELPERS
-------------------------------- */

function getStartMinutes(preferredTime) {
  if (!preferredTime) {
    return START_MINUTES;
  }

  const text = String(preferredTime);

  const match = text.match(
    /(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i
  );

  if (!match) {
    return START_MINUTES;
  }

  let hour = Number(match[1]);

  const minutes = Number(
    match[2] || 0
  );

  const period =
    match[3].toUpperCase();

  if (
    period === "AM" &&
    hour === 12
  ) {
    hour = 0;
  }

  if (
    period === "PM" &&
    hour !== 12
  ) {
    hour += 12;
  }

  return hour * 60 + minutes;
}

function formatMinutes(totalMinutes) {
  const normalized =
    ((totalMinutes % 1440) + 1440) %
    1440;

  let hour = Math.floor(
    normalized / 60
  );

  const minutes =
    normalized % 60;

  const period =
    hour >= 12 ? "PM" : "AM";

  let displayHour =
    hour % 12;

  if (displayHour === 0) {
    displayHour = 12;
  }

  return `${displayHour}:${String(
    minutes
  ).padStart(2, "0")} ${period}`;
}

function formatDuration(minutes) {
  const value = Number(
    minutes || 0
  );

  if (value === 0) {
    return "None";
  }

  const hours =
    Math.floor(value / 60);

  const remainingMinutes =
    value % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} hr${
      hours === 1 ? "" : "s"
    }`;
  }

  return `${hours} hr${
    hours === 1 ? "" : "s"
  } ${remainingMinutes} min`;
}