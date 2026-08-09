"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
  const router = useRouter();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState("all");

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

    await loadRequests();
  }

  async function loadRequests() {
    setLoading(true);

    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading requests:", error);
    } else {
      setRequests(data || []);
    }

    setLoading(false);
  }

  async function updateStatus(id, newStatus) {
  const currentRequest = requests.find(
    (request) => request.id === id
  );

  if (!currentRequest) {
    alert("Request not found.");
    return;
  }

  if (newStatus === "confirmed") {
    const conflict = findScheduleConflict(currentRequest);

    if (conflict) {
      alert(
        `Schedule conflict detected!\n\n` +
          `${conflict.full_name}\n` +
          `${conflict.preferred_date}\n` +
          `${getBlockedRange(conflict)}\n\n` +
          `Please choose another time before confirming this request.`
      );

      return;
    }
  }

  setUpdatingId(id);

  const { error } = await supabase
    .from("requests")
    .update({
      status: newStatus,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating request:", error);
    alert("The request could not be updated.");
    setUpdatingId(null);
    return;
  }

  setRequests((currentRequests) =>
    currentRequests.map((request) =>
      request.id === id
        ? {
            ...request,
            status: newStatus,
          }
        : request
    )
  );

  setUpdatingId(null);
}
  async function saveRequestDetails(
    id,
    price,
    internalNotes,
    estimatedDuration,
    bufferTime
  ) {
    setUpdatingId(id);

    const priceValue =
      price === "" || price === null
        ? null
        : Number(price);

    const durationValue = Number(estimatedDuration);
    const bufferValue = Number(bufferTime);

    const { error } = await supabase
      .from("requests")
      .update({
        price: priceValue,
        internal_notes: internalNotes,
        estimated_duration: durationValue,
        buffer_time: bufferValue,
      })
      .eq("id", id);

    if (error) {
      console.error("Error saving request details:", error);
      alert("The changes could not be saved.");
      setUpdatingId(null);
      return;
    }

    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === id
          ? {
              ...request,
              price: priceValue,
              internal_notes: internalNotes,
              estimated_duration: durationValue,
              buffer_time: bufferValue,
            }
          : request
      )
    );

    setUpdatingId(null);
    alert("Changes saved successfully.");
  }

  function openWhatsApp(phone) {
    const number = String(phone || "").replace(/\D/g, "");

    if (!number) {
      alert("This client does not have a WhatsApp number.");
      return;
    }

    window.open(
      `https://wa.me/${number}`,
      "_blank",
      "noopener,noreferrer"
    );
  }
function findScheduleConflict(currentRequest) {
  const currentStart = timeToMinutes(
    currentRequest.preferred_time
  );

  const currentDuration = Number(
    currentRequest.estimated_duration ?? 60
  );

  const currentBuffer = Number(
    currentRequest.buffer_time ?? 30
  );

  const currentEnd =
    currentStart + currentDuration + currentBuffer;

  return requests.find((otherRequest) => {
    if (otherRequest.id === currentRequest.id) {
      return false;
    }

    if (otherRequest.status !== "confirmed") {
      return false;
    }

    if (
      otherRequest.preferred_date !==
      currentRequest.preferred_date
    ) {
      return false;
    }

    const otherStart = timeToMinutes(
      otherRequest.preferred_time
    );

    const otherDuration = Number(
      otherRequest.estimated_duration ?? 60
    );

    const otherBuffer = Number(
      otherRequest.buffer_time ?? 30
    );

    const otherEnd =
      otherStart + otherDuration + otherBuffer;

    return (
      currentStart < otherEnd &&
      currentEnd > otherStart
    );
  });
}

function getBlockedRange(request) {
  const start = timeToMinutes(
    request.preferred_time
  );

  const end =
    start +
    Number(request.estimated_duration ?? 60) +
    Number(request.buffer_time ?? 30);

  return `${minutesToTime(start)} → ${minutesToTime(end)}`;
}
  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  function statusColor(status) {
    if (status === "confirmed") return "#157347";
    if (status === "completed") return "#175cd3";
    if (status === "cancelled") return "#b42318";

    return "#b54708";
  }

  function statusBackground(status) {
    if (status === "confirmed") return "#ecfdf3";
    if (status === "completed") return "#eff8ff";
    if (status === "cancelled") return "#fef3f2";

    return "#fffaeb";
  }

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter(
          (request) => request.status === filter
        );

  const counts = {
    all: requests.length,

    pending: requests.filter(
      (request) => request.status === "pending"
    ).length,

    confirmed: requests.filter(
      (request) => request.status === "confirmed"
    ).length,

    completed: requests.filter(
      (request) => request.status === "completed"
    ).length,

    cancelled: requests.filter(
      (request) => request.status === "cancelled"
    ).length,
  };

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
              Dashboard
            </h1>

            <p
              style={{
                marginTop: "8px",
                color: "#667085",
              }}
            >
              Manage your service requests and appointments.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/admin/calendar"
              style={{
                background: "#e4b43f",
                color: "#07182d",
                padding: "11px 18px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              Calendar
            </Link>

            <button
              type="button"
              onClick={logout}
              style={{
                border: "1px solid #d0d5dd",
                background: "#ffffff",
                color: "#344054",
                padding: "10px 18px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Log Out
            </button>
          </div>
        </div>

        {/* FILTERS */}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "35px",
            marginBottom: "35px",
          }}
        >
          <FilterButton
            label="All"
            count={counts.all}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />

          <FilterButton
            label="Pending"
            count={counts.pending}
            active={filter === "pending"}
            onClick={() => setFilter("pending")}
          />

          <FilterButton
            label="Confirmed"
            count={counts.confirmed}
            active={filter === "confirmed"}
            onClick={() => setFilter("confirmed")}
          />

          <FilterButton
            label="Completed"
            count={counts.completed}
            active={filter === "completed"}
            onClick={() => setFilter("completed")}
          />

          <FilterButton
            label="Cancelled"
            count={counts.cancelled}
            active={filter === "cancelled"}
            onClick={() => setFilter("cancelled")}
          />
        </div>

        {/* REQUESTS */}

        {loading ? (
          <EmptyCard text="Loading requests..." />
        ) : filteredRequests.length === 0 ? (
          <EmptyCard text="No requests found in this category." />
        ) : (
          <div
            style={{
              display: "grid",
              gap: "20px",
            }}
          >
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                style={{
                  border: "1px solid #e4e7ec",
                  borderRadius: "18px",
                  padding: "24px",
                  background: "#ffffff",
                  boxShadow: "0 6px 20px rgba(16,24,40,.06)",
                }}
              >
                {/* REQUEST HEADER */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "#667085",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      REFERENCE
                    </div>

                    <h3
                      style={{
                        margin: "4px 0 0",
                        color: "#07182d",
                      }}
                    >
                      {request.reference}
                    </h3>
                  </div>

                  <span
                    style={{
                      color: statusColor(request.status),
                      background: statusBackground(request.status),
                      padding: "8px 13px",
                      borderRadius: "999px",
                      fontWeight: 800,
                      textTransform: "capitalize",
                    }}
                  >
                    {request.status || "pending"}
                  </span>
                </div>

                {/* CLIENT INFO */}

                <div
                  style={{
                    marginTop: "22px",
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "16px 30px",
                  }}
                >
                  <Info
                    label="Name"
                    value={request.full_name}
                  />

                  <Info
                    label="WhatsApp"
                    value={request.whatsapp}
                  />

                  <Info
                    label="Email"
                    value={request.email}
                  />

                  <Info
                    label="Location"
                    value={request.location}
                  />

                  <Info
                    label="Service"
                    value={request.service}
                  />

                  <Info
                    label="Preferred Date"
                    value={request.preferred_date}
                  />

                  <Info
                    label="Preferred Time"
                    value={request.preferred_time}
                  />
                </div>

                {/* DETAILS */}

                <div
                  style={{
                    marginTop: "20px",
                    padding: "16px",
                    background: "#f8fafc",
                    borderRadius: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      color: "#667085",
                      marginBottom: "6px",
                    }}
                  >
                    CLIENT DETAILS
                  </div>

                  <div
                    style={{
                      color: "#344054",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {request.details || "No details provided"}
                  </div>
                </div>

                {/* SCHEDULING */}

                <div
                  style={{
                    marginTop: "24px",
                    paddingTop: "22px",
                    borderTop: "1px solid #e4e7ec",
                  }}
                >
                  <h4
                    style={{
                      marginTop: 0,
                      marginBottom: "18px",
                      color: "#07182d",
                    }}
                  >
                    Scheduling
                  </h4>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "18px",
                    }}
                  >
                    <div>
                      <FieldLabel
                        htmlFor={`duration-${request.id}`}
                      >
                        Estimated Duration
                      </FieldLabel>

                      <select
                        id={`duration-${request.id}`}
                        defaultValue={
                          request.estimated_duration ?? 60
                        }
                        style={inputStyle}
                      >
                        <option value="30">
                          30 minutes
                        </option>

                        <option value="60">
                          1 hour
                        </option>

                        <option value="90">
                          1 hour 30 minutes
                        </option>

                        <option value="120">
                          2 hours
                        </option>

                        <option value="150">
                          2 hours 30 minutes
                        </option>

                        <option value="180">
                          3 hours
                        </option>

                        <option value="240">
                          4 hours
                        </option>
                      </select>
                    </div>

                    <div>
                      <FieldLabel
                        htmlFor={`buffer-${request.id}`}
                      >
                        Travel / Buffer Time
                      </FieldLabel>

                      <select
                        id={`buffer-${request.id}`}
                        defaultValue={
                          request.buffer_time ?? 30
                        }
                        style={inputStyle}
                      >
                        <option value="0">
                          No buffer
                        </option>

                        <option value="15">
                          15 minutes
                        </option>

                        <option value="30">
                          30 minutes
                        </option>

                        <option value="45">
                          45 minutes
                        </option>

                        <option value="60">
                          1 hour
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* PRICE + NOTES */}

                <div
                  style={{
                    marginTop: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "minmax(180px, 250px) minmax(250px, 1fr)",
                      gap: "20px",
                    }}
                  >
                    <div>
                      <FieldLabel
                        htmlFor={`price-${request.id}`}
                      >
                        Price ($)
                      </FieldLabel>

                      <input
                        id={`price-${request.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={request.price ?? ""}
                        placeholder="Example: 25.00"
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <FieldLabel
                        htmlFor={`notes-${request.id}`}
                      >
                        Internal Notes
                      </FieldLabel>

                      <textarea
                        id={`notes-${request.id}`}
                        defaultValue={
                          request.internal_notes ?? ""
                        }
                        placeholder="Private notes about this request..."
                        rows={4}
                        style={{
                          ...inputStyle,
                          resize: "vertical",
                          fontFamily: "Arial, sans-serif",
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const price =
                        document.getElementById(
                          `price-${request.id}`
                        )?.value ?? "";

                      const notes =
                        document.getElementById(
                          `notes-${request.id}`
                        )?.value ?? "";

                      const duration =
                        document.getElementById(
                          `duration-${request.id}`
                        )?.value ?? "60";

                      const buffer =
                        document.getElementById(
                          `buffer-${request.id}`
                        )?.value ?? "30";

                      saveRequestDetails(
                        request.id,
                        price,
                        notes,
                        duration,
                        buffer
                      );
                    }}
                    disabled={updatingId === request.id}
                    style={{
                      border: "none",
                      background: "#07182d",
                      color: "#ffffff",
                      padding: "11px 18px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: 700,
                      marginTop: "14px",
                    }}
                  >
                    {updatingId === request.id
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>

                {/* ACTIONS */}

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginTop: "24px",
                    paddingTop: "20px",
                    borderTop: "1px solid #e4e7ec",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      openWhatsApp(request.whatsapp)
                    }
                    style={buttonStyle(
                      "#25D366",
                      "#ffffff"
                    )}
                  >
                    Open WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        request.id,
                        "confirmed"
                      )
                    }
                    disabled={updatingId === request.id}
                    style={buttonStyle(
                      "#157347",
                      "#ffffff"
                    )}
                  >
                    Confirm
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        request.id,
                        "completed"
                      )
                    }
                    disabled={updatingId === request.id}
                    style={buttonStyle(
                      "#175cd3",
                      "#ffffff"
                    )}
                  >
                    Complete
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        request.id,
                        "cancelled"
                      )
                    }
                    disabled={updatingId === request.id}
                    style={buttonStyle(
                      "#b42318",
                      "#ffffff"
                    )}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
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

  return `${displayHour}:${String(minutes).padStart(
    2,
    "0"
  )} ${period}`;
}
function Info({ label, value }) {
  return (
    <div>
      <div
        style={{
          fontSize: "12px",
          fontWeight: 800,
          color: "#667085",
        }}
      >
        {label.toUpperCase()}
      </div>

      <div
        style={{
          marginTop: "4px",
          color: "#101828",
          fontWeight: 600,
        }}
      >
        {value || "Not provided"}
      </div>
    </div>
  );
}

function FieldLabel({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: "block",
        fontWeight: 700,
        color: "#344054",
        marginBottom: "7px",
      }}
    >
      {children}
    </label>
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

function buttonStyle(background, color) {
  return {
    border: "none",
    background,
    color,
    padding: "11px 17px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 700,
  };
}

const inputStyle = {
  width: "100%",
  padding: "11px",
  border: "1px solid #d0d5dd",
  borderRadius: "10px",
  outline: "none",
  boxSizing: "border-box",
  background: "#ffffff",
};

function FilterButton({
  label,
  count,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: active
          ? "2px solid #e4b43f"
          : "1px solid #e4e7ec",

        background: active
          ? "#fff8e6"
          : "#ffffff",

        padding: "14px 18px",
        borderRadius: "14px",
        cursor: "pointer",
        minWidth: "130px",
        textAlign: "left",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          color: "#667085",
          fontWeight: 700,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "26px",
          marginTop: "4px",
          fontWeight: 800,
          color: "#07182d",
        }}
      >
        {count}
      </div>
    </button>
  );
}