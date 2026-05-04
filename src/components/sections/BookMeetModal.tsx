"use client";

import { useEffect, useState } from "react";
import styles from "./BookMeetModal.module.css";

interface BookMeetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookMeetModal({
  isOpen,
  onClose,
  onSuccess,
}: BookMeetModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // calendar state
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const resetFormState = () => {
    setName("");
    setEmail("");
    setSelectedTime(null);
    setSelectedDay(null);
    setBookedSlots([]);
  };

  const handleCloseModal = () => {
    resetFormState();
    onClose();
  };

  // ===== ESC CLOSE =====
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // ===== FETCH BOOKED SLOTS WHEN DAY SELECTED OR MODAL OPENS =====
  useEffect(() => {
    if (!isOpen || !selectedDay) {
      setBookedSlots([]);
      return;
    }

    const fetchBookedSlots = async () => {
      setLoadingSlots(true);
      try {
        const selectedDate = new Date(year, month, selectedDay);
        const response = await fetch("/api/available-slots", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: selectedDate.toISOString() }),
        });

        const data = await response.json();
        if (data.success && data.bookedSlots) {
          setBookedSlots(data.bookedSlots);
        }
      } catch (err) {
        console.error("Failed to fetch booked slots:", err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchBookedSlots();
  }, [isOpen, selectedDay, year, month]);

  if (!isOpen) return null;

  // ===== CALENDAR GENERATION =====

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Monday-first calendar
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const calendarDays = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const goPrevMonth = () =>
    setCurrentDate(new Date(year, month - 1, 1));

  const goNextMonth = () =>
    setCurrentDate(new Date(year, month + 1, 1));

  // ===== BOOKING =====

  const handleBooking = async () => {
    if (!selectedDay || !selectedTime || !name || !email) {
      alert("Please complete all fields");
      return;
    }

    try {
      setLoading(true);

      const [hour, minute] = selectedTime.split(":");

      const start = new Date(
        year,
        month,
        selectedDay,
        Number(hour),
        Number(minute)
      );

      const response = await fetch("/api/book-meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          dateTime: start.toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Booking failed");
      }

      // Refetch booked slots to update the UI
      if (selectedDay) {
        const selectedDate = new Date(year, month, selectedDay);
        const slotsResponse = await fetch("/api/available-slots", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: selectedDate.toISOString() }),
        });
        const slotsData = await slotsResponse.json();
        if (slotsData.success && slotsData.bookedSlots) {
          setBookedSlots(slotsData.bookedSlots);
        }
      }

      resetFormState();
      onClose();
      onSuccess();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ===== UI =====

  return (
    <div
      className={styles.meetModalOverlay}
      onClick={handleCloseModal}
      role="presentation"
    >
      <div
        className={styles.meetModal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className={styles.meetModalClose}
          onClick={handleCloseModal}
        >
          ×
        </button>

        <div className={styles.meetModalTop}>
          {/* INFO */}
          <div className={styles.meetInfoCol}>
            <h4 className={styles.meetName}>RIMANTE</h4>
            <ul className={styles.meetMetaList}>
              <li>Confirmation required</li>
              <li>30 min session</li>
              <li>Google Meet</li>
              <li>SE, Stockholm</li>
            </ul>
          </div>

          {/* CALENDAR */}
          <div className={styles.meetCalendarCol}>
            <div className={styles.meetMonthHeader}>
              <h4 className={styles.meetMonthTitle}>
                {currentDate
                  .toLocaleString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                  .toUpperCase()}
              </h4>

              <div className={styles.meetMonthArrows}>
                <span onClick={goPrevMonth}>‹</span>
                <span onClick={goNextMonth}>›</span>
              </div>
            </div>

            <div className={styles.meetWeekHead}>
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>

            <div className={styles.meetCalendarGrid}>
              {calendarDays.map((day, i) => {
                if (day === null) {
                  return <span key={`empty-${i}`}></span>;
                }

                // Check if this day is a weekend
                const dateToCheck = new Date(year, month, day);
                const dayOfWeek = dateToCheck.getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                return (
                  <button
                    type="button"
                    key={`day-${day}`}
                    className={
                      selectedDay === day
                        ? styles.meetDayActive
                        : isWeekend
                        ? styles.meetDayWeekend
                        : styles.meetDay
                    }
                    onClick={() => setSelectedDay(day)}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TIME SLOTS */}
          <div className={styles.meetSlotsCol}>
            <h4 className={styles.meetSlotsTitle}>AVAILABLE SLOTS</h4>
            <p className={styles.meetTimezone}>Times shown in GMT+1</p>

            {loadingSlots ? (
              <p style={{ color: "#8f97ad", fontSize: "0.9rem", marginTop: "20px" }}>
                Loading slots...
              </p>
            ) : !selectedDay ? (
              <p style={{ color: "#8f97ad", fontSize: "0.9rem", marginTop: "40px" }}>
                Please select a date to be able to choose a time slot for our meeting.
              </p>
            ) : (() => {
                // Check if selected day is a weekday (Mon-Fri)
                const selectedDate = new Date(year, month, selectedDay);
                const dayOfWeek = selectedDate.getDay();
                const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

                if (!isWeekday) {
                  return (
                    <p style={{ color: "#8f97ad", fontSize: "0.9rem", marginTop: "20px" }}>
                      Time to reset and reload! I'm away on weekends.
                    </p>
                  );
                }

                // Generate slots: 10:00-11:30, then 13:00-15:30 (skip 12:00-12:30 lunch)
                const allSlots = [
                  "10:00", "10:30", "11:00", "11:30",
                  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"
                ];

                return (
                  <div className={styles.meetSlotsList}>
                    {allSlots.map((time) => {
                      const isBooked = bookedSlots.includes(time);
                      return (
                        <button
                          type="button"
                          key={time}
                          className={
                            isBooked
                              ? styles.bookedSlot
                              : selectedTime === time
                              ? styles.activeSlot
                              : ""
                          }
                          onClick={() => !isBooked && setSelectedTime(time)}
                          disabled={isBooked}
                        >
                          {time} {isBooked && "(Booked)"}
                        </button>
                      );
                    })}
                  </div>
                );
              })()}
          </div>
        </div>

        {/* FORM */}
        <div className={styles.meetModalBottom}>
          <div className={styles.meetFieldWrap}>
            <label>FULL NAME</label>
            <input
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.meetFieldWrap}>
            <label>EMAIL</label>
            <input
              type="email"
              placeholder="john.doe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={handleBooking}
            disabled={loading}
            className={styles.meetConfirmBtn}
          >
            {loading ? "BOOKING..." : "CONFIRM BOOKING"}
          </button>
        </div>

      </div>
    </div>
  );
}