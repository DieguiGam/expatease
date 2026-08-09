(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/admin/calendar/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CalendarPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function CalendarPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [requests, setRequests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CalendarPage.useEffect": ()=>{
            checkAdmin();
        }
    }["CalendarPage.useEffect"], []);
    async function checkAdmin() {
        const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
        if (!user) {
            router.push("/admin/login");
            return;
        }
        await loadAppointments();
    }
    async function loadAppointments() {
        setLoading(true);
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("requests").select("*").in("status", [
            "confirmed",
            "completed"
        ]).order("preferred_date", {
            ascending: true
        });
        if (error) {
            console.error("Error loading calendar:", error);
        } else {
            setRequests(data || []);
        }
        setLoading(false);
    }
    const appointmentsByDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CalendarPage.useMemo[appointmentsByDate]": ()=>{
            const grouped = {};
            requests.forEach({
                "CalendarPage.useMemo[appointmentsByDate]": (request)=>{
                    const date = request.preferred_date;
                    if (!grouped[date]) {
                        grouped[date] = [];
                    }
                    grouped[date].push(request);
                }
            }["CalendarPage.useMemo[appointmentsByDate]"]);
            Object.keys(grouped).forEach({
                "CalendarPage.useMemo[appointmentsByDate]": (date)=>{
                    grouped[date].sort({
                        "CalendarPage.useMemo[appointmentsByDate]": (a, b)=>{
                            return getStartMinutes(a.preferred_time) - getStartMinutes(b.preferred_time);
                        }
                    }["CalendarPage.useMemo[appointmentsByDate]"]);
                }
            }["CalendarPage.useMemo[appointmentsByDate]"]);
            return grouped;
        }
    }["CalendarPage.useMemo[appointmentsByDate]"], [
        requests
    ]);
    function formatDate(dateString) {
        if (!dateString) return "";
        const date = new Date(`${dateString}T12:00:00`);
        return new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        }).format(date);
    }
    function statusStyle(status) {
        if (status === "completed") {
            return {
                color: "#175cd3",
                background: "#eff8ff"
            };
        }
        return {
            color: "#157347",
            background: "#ecfdf3"
        };
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        style: {
            minHeight: "100vh",
            background: "#f8fafc",
            padding: "40px 24px",
            fontFamily: "Arial, sans-serif"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                maxWidth: "1200px",
                margin: "0 auto"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "20px",
                        flexWrap: "wrap"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: "#e4b43f",
                                        fontWeight: 800,
                                        marginBottom: "4px"
                                    },
                                    children: "EXPATEASE ADMIN"
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/calendar/page.jsx",
                                    lineNumber: 124,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    style: {
                                        margin: 0,
                                        color: "#07182d",
                                        fontSize: "36px"
                                    },
                                    children: "Calendar"
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/calendar/page.jsx",
                                    lineNumber: 134,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: "#667085",
                                        marginTop: "8px"
                                    },
                                    children: "Confirmed appointments and completed services."
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/calendar/page.jsx",
                                    lineNumber: 144,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/admin/calendar/page.jsx",
                            lineNumber: 123,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/admin",
                            style: {
                                background: "#07182d",
                                color: "#ffffff",
                                padding: "12px 18px",
                                borderRadius: "10px",
                                textDecoration: "none",
                                fontWeight: 700
                            },
                            children: "Back to Dashboard"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/calendar/page.jsx",
                            lineNumber: 154,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/calendar/page.jsx",
                    lineNumber: 114,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginTop: "36px"
                    },
                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyCard, {
                        text: "Loading appointments..."
                    }, void 0, false, {
                        fileName: "[project]/app/admin/calendar/page.jsx",
                        lineNumber: 171,
                        columnNumber: 13
                    }, this) : Object.keys(appointmentsByDate).length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyCard, {
                        text: "No confirmed appointments yet."
                    }, void 0, false, {
                        fileName: "[project]/app/admin/calendar/page.jsx",
                        lineNumber: 173,
                        columnNumber: 13
                    }, this) : Object.entries(appointmentsByDate).map(([date, appointments])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            style: {
                                marginBottom: "32px"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        color: "#07182d",
                                        marginBottom: "14px"
                                    },
                                    children: formatDate(date)
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/calendar/page.jsx",
                                    lineNumber: 183,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "grid",
                                        gap: "14px"
                                    },
                                    children: appointments.map((appointment)=>{
                                        const badge = statusStyle(appointment.status);
                                        const duration = Number(appointment.estimated_duration ?? 60);
                                        const buffer = Number(appointment.buffer_time ?? 30);
                                        const startMinutes = getStartMinutes(appointment.preferred_time);
                                        const endMinutes = startMinutes + duration + buffer;
                                        const startLabel = formatMinutes(startMinutes);
                                        const endLabel = formatMinutes(endMinutes);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                background: "#ffffff",
                                                border: "1px solid #e4e7ec",
                                                borderRadius: "16px",
                                                padding: "22px",
                                                boxShadow: "0 5px 16px rgba(16,24,40,.05)"
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "grid",
                                                    gridTemplateColumns: "minmax(190px, 0.8fr) minmax(220px, 1fr) minmax(200px, 1fr) auto",
                                                    gap: "22px",
                                                    alignItems: "center"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Label, {
                                                                children: "BLOCKED TIME"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/calendar/page.jsx",
                                                                lineNumber: 252,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 800,
                                                                    color: "#07182d",
                                                                    marginTop: "6px",
                                                                    fontSize: "17px"
                                                                },
                                                                children: [
                                                                    startLabel,
                                                                    " → ",
                                                                    endLabel
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/admin/calendar/page.jsx",
                                                                lineNumber: 254,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    color: "#667085",
                                                                    marginTop: "6px",
                                                                    fontSize: "13px"
                                                                },
                                                                children: [
                                                                    "Service:",
                                                                    " ",
                                                                    formatDuration(duration),
                                                                    " + ",
                                                                    "Buffer:",
                                                                    " ",
                                                                    formatDuration(buffer)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/admin/calendar/page.jsx",
                                                                lineNumber: 265,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/admin/calendar/page.jsx",
                                                        lineNumber: 251,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Label, {
                                                                children: "CLIENT"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/calendar/page.jsx",
                                                                lineNumber: 281,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 800,
                                                                    color: "#07182d",
                                                                    marginTop: "5px"
                                                                },
                                                                children: appointment.full_name
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/calendar/page.jsx",
                                                                lineNumber: 283,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    color: "#667085",
                                                                    marginTop: "3px"
                                                                },
                                                                children: appointment.location
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/calendar/page.jsx",
                                                                lineNumber: 293,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/admin/calendar/page.jsx",
                                                        lineNumber: 280,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Label, {
                                                                children: "SERVICE"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/calendar/page.jsx",
                                                                lineNumber: 304,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 700,
                                                                    marginTop: "5px"
                                                                },
                                                                children: appointment.service
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/calendar/page.jsx",
                                                                lineNumber: 306,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    color: "#667085",
                                                                    marginTop: "3px"
                                                                },
                                                                children: appointment.reference
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/calendar/page.jsx",
                                                                lineNumber: 315,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/admin/calendar/page.jsx",
                                                        lineNumber: 303,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: badge.color,
                                                            background: badge.background,
                                                            padding: "8px 12px",
                                                            borderRadius: "999px",
                                                            fontWeight: 800,
                                                            textTransform: "capitalize",
                                                            textAlign: "center"
                                                        },
                                                        children: appointment.status
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/calendar/page.jsx",
                                                        lineNumber: 325,
                                                        columnNumber: 29
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/calendar/page.jsx",
                                                lineNumber: 242,
                                                columnNumber: 27
                                            }, this)
                                        }, appointment.id, false, {
                                            fileName: "[project]/app/admin/calendar/page.jsx",
                                            lineNumber: 230,
                                            columnNumber: 25
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/calendar/page.jsx",
                                    lineNumber: 192,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, date, true, {
                            fileName: "[project]/app/admin/calendar/page.jsx",
                            lineNumber: 177,
                            columnNumber: 17
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/admin/calendar/page.jsx",
                    lineNumber: 169,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/admin/calendar/page.jsx",
            lineNumber: 108,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/admin/calendar/page.jsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
_s(CalendarPage, "bpuuIiu/LTySdbUbXMkA3YJKaJE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = CalendarPage;
function getStartMinutes(preferredTime) {
    if (!preferredTime) return 8 * 60;
    const text = String(preferredTime);
    const match = text.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
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
    const normalized = (totalMinutes % 1440 + 1440) % 1440;
    let hour = Math.floor(normalized / 60);
    const minutes = normalized % 60;
    const period = hour >= 12 ? "PM" : "AM";
    let displayHour = hour % 12;
    if (displayHour === 0) {
        displayHour = 12;
    }
    return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            color: "#667085",
            fontSize: "12px",
            fontWeight: 800
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/app/admin/calendar/page.jsx",
        lineNumber: 438,
        columnNumber: 5
    }, this);
}
_c1 = Label;
function EmptyCard({ text }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            background: "#ffffff",
            padding: "30px",
            borderRadius: "18px",
            border: "1px solid #e4e7ec",
            color: "#667085"
        },
        children: text
    }, void 0, false, {
        fileName: "[project]/app/admin/calendar/page.jsx",
        lineNumber: 452,
        columnNumber: 5
    }, this);
}
_c2 = EmptyCard;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "CalendarPage");
__turbopack_context__.k.register(_c1, "Label");
__turbopack_context__.k.register(_c2, "EmptyCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/supabase.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://xqdhdgbyrkasgsjjbygz.supabase.co");
const supabaseKey = ("TURBOPACK compile-time value", "sb_publishable_ICbi4t1K1LRVoRUwbGvjCA_86-hb37K");
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseKey);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_1wclhz8._.js.map