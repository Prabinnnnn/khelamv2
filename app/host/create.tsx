import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { Game, useGames } from "@/context/GamesContext";
import { useColors } from "@/hooks/useColors";

const SPORTS = ["Futsal", "Football", "Cricket", "Basketball", "Badminton", "Volleyball", "E-Sports"];

function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDateForDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
}

function formatTimeForDisplay(timeStr: string): string {
  if (!timeStr) return "";
  // Assume timeStr is in format like "6:00 PM"
  return timeStr;
}

function validateDuration(value: number): string | null {
  if (value < 1) return "Minimum 1 minute";
  if (value > 300) return "Maximum 300 minutes";
  return null;
}

function validateFormat(value: number): string | null {
  if (value < 1) return "Minimum 1 player";
  if (value > 15) return "Maximum 15 players";
  return null;
}

export default function CreateGameScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { addHostedGame, draftGame, setDraftGame } = useGames();

  const [sport, setSport] = useState("Futsal");
  const [venue, setVenue] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState<number>(60);
  const [formatLeft, setFormatLeft] = useState("5");
  const [formatRight, setFormatRight] = useState("5");
  const [slots, setSlots] = useState("10");
  const [price, setPrice] = useState("");
  const [rules, setRules] = useState("");
  const [notes, setNotes] = useState("");
  const [isIndoor, setIsIndoor] = useState(true);
  const [loading, setLoading] = useState(false);
  const [durationError, setDurationError] = useState<string | null>(null);

  // Pre-fill from draft if exists
  React.useEffect(() => {
    if (draftGame) {
      setSport(draftGame.sport);
      setVenue(draftGame.venue);
      setAddress(draftGame.address);
      setDate(draftGame.date);
      setTime(draftGame.time);
      setDuration(parseInt(draftGame.duration.split(' ')[0]) || 60);
      const [left, right] = draftGame.format.split(' vs ');
      setFormatLeft(left || "5");
      setFormatRight(right || "5");
      setSlots(String(draftGame.slots));
      setPrice(String(draftGame.price));
      setRules(draftGame.rules);
      setNotes(draftGame.notes);
      setIsIndoor(draftGame.isIndoor);
    }
  }, [draftGame]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDurationChange = (value: string) => {
    const sanitized = value.replace(/[^0-9]/g, "");
    const numeric = sanitized === "" ? 0 : parseInt(sanitized, 10);
    setDuration(numeric);
    setDurationError(validateDuration(numeric));
  };

  const handleFormatChange = (side: "left" | "right") => (value: string) => {
    const sanitized = value.replace(/[^0-9]/g, "");
    const numeric = sanitized === "" ? 0 : parseInt(sanitized, 10);
    const constrained = numeric > 15 ? "15" : sanitized;

    if (side === "left") {
      setFormatLeft(constrained);
    } else {
      setFormatRight(constrained);
    }
  };

  const handleSubmit = async () => {
    if (!venue || !date || !time || !price || duration < 1) {
      Alert.alert("Required", "Please fill in venue, date, time, duration, and price.");
      return;
    }

    const durationValidation = validateDuration(duration);
    if (durationValidation) {
      Alert.alert("Invalid Duration", durationValidation);
      return;
    }

    const leftNumber = parseInt(formatLeft, 10);
    const rightNumber = parseInt(formatRight, 10);
    if (
      isNaN(leftNumber) ||
      isNaN(rightNumber) ||
      validateFormat(leftNumber) ||
      validateFormat(rightNumber)
    ) {
      Alert.alert(
        "Invalid Format",
        "Please enter both team sizes between 1 and 15 for the game format."
      );
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    const newGame: Game = {
      id: `hg_${Date.now()}`,
      title: `${sport} at ${venue}`,
      sport,
      venue,
      address,
      date,
      dateLabel: formatDateForDisplay(date),
      time,
      duration: `${duration} min`,
      format: `${parseInt(formatLeft, 10)} vs ${parseInt(formatRight, 10)}`,
      slots: parseInt(slots) || 10,
      filledSlots: 0,
      price: parseInt(price) || 0,
      isIndoor,
      hostId: user?.id ?? "user_1",
      hostName: user?.name ?? "Host",
      hostAvatar: "",
      hostBio: "",
      image: "",
      status: "open",
      rules,
      notes,
      kitToBring: [],
      players: [],
      city: user?.city ?? "Kathmandu",
    };

    setDraftGame(newGame);
    setLoading(false);
    router.push("/host/review");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.nav, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            style={[styles.navBtn, { backgroundColor: colors.card }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: colors.foreground }]}>Host a Game</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Sport Selector */}
          <SectionTitle title="Sport" colors={colors} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportScroll}>
            {SPORTS.map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.sportChip,
                  {
                    backgroundColor: sport === s ? "#1A1A1A" : colors.card,
                    borderColor: sport === s ? "#1A1A1A" : colors.border,
                  },
                ]}
                onPress={() => setSport(s)}
              >
                <Text style={[styles.sportChipText, { color: sport === s ? "#C8F248" : colors.mutedForeground }]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Venue */}
          <SectionTitle title="Venue" colors={colors} />
          <FormField
            icon="business-outline"
            placeholder="Venue name"
            value={venue}
            onChangeText={setVenue}
            colors={colors}
          />
          <FormField
            icon="location-outline"
            placeholder="Full address"
            value={address}
            onChangeText={setAddress}
            colors={colors}
          />

          {/* Indoor / Outdoor */}
          <View style={styles.toggleRow}>
            {[true, false].map((val) => (
              <TouchableOpacity
                key={String(val)}
                style={[
                  styles.toggleBtn,
                  {
                    backgroundColor: isIndoor === val ? "#1A1A1A" : colors.card,
                    borderColor: isIndoor === val ? "#1A1A1A" : colors.border,
                    flex: 1,
                  },
                ]}
                onPress={() => setIsIndoor(val)}
              >
                <Ionicons
                  name={val ? "home-outline" : "sunny-outline"}
                  size={16}
                  color={isIndoor === val ? "#C8F248" : colors.mutedForeground}
                />
                <Text
                  style={[
                    styles.toggleText,
                    { color: isIndoor === val ? "#C8F248" : colors.mutedForeground },
                  ]}
                >
                  {val ? "Indoor" : "Outdoor"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Date & Time */}
          <SectionTitle title="Date & Time" colors={colors} />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={16} color={colors.mutedForeground} />
                <Text style={[styles.input, { color: date ? colors.foreground : colors.mutedForeground }]}>
                  {date ? formatDateForDisplay(date) : "Select date"}
                </Text>
                <Ionicons name="chevron-down" size={14} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={16} color={colors.mutedForeground} />
                <Text style={[styles.input, { color: time ? colors.foreground : colors.mutedForeground }]}>
                  {time ? formatTimeForDisplay(time) : "Select time"}
                </Text>
                <Ionicons name="chevron-down" size={14} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Duration & Format */}
          <SectionTitle title="Duration & Format" colors={colors} />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <View style={styles.durationRow}>
                <View style={{ flex: 1 }}>
                  <FormField
                    icon="hourglass-outline"
                    placeholder="Duration"
                    value={duration > 0 ? String(duration) : ""}
                    onChangeText={handleDurationChange}
                    keyboardType="number-pad"
                    colors={colors}
                  />
                </View>
                <Text style={[styles.minLabel, { color: colors.mutedForeground }]}>min</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.formatSplitRow}>
                <View style={{ flex: 1 }}>
                  <FormField
                    icon="people-outline"
                    placeholder="5"
                    value={formatLeft}
                    onChangeText={handleFormatChange("left")}
                    keyboardType="number-pad"
                    colors={colors}
                  />
                </View>
                <Text style={[styles.vsLabel, { color: colors.mutedForeground }]}>vs</Text>
                <View style={{ flex: 1 }}>
                  <FormField
                    icon="people-outline"
                    placeholder="5"
                    value={formatRight}
                    onChangeText={handleFormatChange("right")}
                    keyboardType="number-pad"
                    colors={colors}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Slots & Price */}
          <SectionTitle title="Slots & Pricing" colors={colors} />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <FormField
                icon="person-add-outline"
                placeholder="Total slots"
                value={slots}
                onChangeText={setSlots}
                keyboardType="number-pad"
                colors={colors}
              />
            </View>
            <View style={{ flex: 1 }}>
              <FormField
                icon="cash-outline"
                placeholder="Price (NPR)"
                value={price}
                onChangeText={setPrice}
                keyboardType="number-pad"
                colors={colors}
              />
            </View>
          </View>

          {/* Rules & Notes */}
          <SectionTitle title="Rules & Notes" colors={colors} />
          <View style={[styles.textArea, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TextInput
              style={[styles.textAreaInput, { color: colors.foreground }]}
              placeholder="Game rules..."
              placeholderTextColor={colors.mutedForeground}
              value={rules}
              onChangeText={setRules}
              multiline
              numberOfLines={3}
            />
          </View>
          <View style={[styles.textArea, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TextInput
              style={[styles.textAreaInput, { color: colors.foreground }]}
              placeholder="Additional notes (optional)..."
              placeholderTextColor={colors.mutedForeground}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Image Upload */}
          <SectionTitle title="Cover Image" colors={colors} />
          <TouchableOpacity
            style={[styles.imageUpload, { backgroundColor: colors.card, borderColor: "#C8F24860" }]}
          >
            <Ionicons name="image-outline" size={32} color="#C8F248" />
            <Text style={[styles.uploadText, { color: colors.foreground }]}>Upload Cover Photo</Text>
            <Text style={[styles.uploadSub, { color: colors.mutedForeground }]}>Optional · Recommended 16:9</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.publishBtn, { backgroundColor: loading ? "#A0C43A" : "#C8F248" }]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Ionicons name="send-outline" size={20} color="#0D0D0D" />
            <Text style={styles.publishText}>{loading ? "Submitting..." : "Submit"}</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Date Picker Modal */}
        <DatePickerModal
          visible={showDatePicker}
          selectedDate={date}
          onSelectDate={setDate}
          onClose={() => setShowDatePicker(false)}
          colors={colors}
          insets={insets}
        />

        {/* Time Picker Modal */}
        <TimePickerModal
          visible={showTimePicker}
          selectedTime={time}
          onSelectTime={setTime}
          onClose={() => setShowTimePicker(false)}
          colors={colors}
          insets={insets}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

function DatePickerModal({
  visible,
  selectedDate,
  onSelectDate,
  onClose,
  colors,
  insets,
}: {
  visible: boolean;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onClose: () => void;
  colors: ReturnType<typeof useColors>;
  insets: ReturnType<typeof useSafeAreaInsets>;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 3);

  const [calMonth, setCalMonth] = React.useState(() => {
    if (selectedDate) {
      const date = new Date(selectedDate + "T00:00:00");
      return new Date(date.getFullYear(), date.getMonth(), 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const bottomInset = insets.bottom > 0 ? insets.bottom : 8;

  const goToPrevMonth = () => {
    const prev = new Date(calMonth);
    prev.setMonth(prev.getMonth() - 1);
    const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    if (prev >= minMonth) setCalMonth(prev);
  };

  const goToNextMonth = () => {
    const next = new Date(calMonth);
    next.setMonth(next.getMonth() + 1);
    const maxMonth = new Date(today.getFullYear(), today.getMonth() + 3, 1);
    if (next <= maxMonth) setCalMonth(next);
  };

  const calDays = React.useMemo(() => {
    const year = calMonth.getFullYear();
    const month = calMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = firstDay.getDay();
    const offset = startDow === 0 ? 6 : startDow - 1;
    const days: (Date | null)[] = [];
    for (let i = 0; i < offset; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [calMonth]);

  const handleDayPress = (day: Date) => {
    if (day < today || day > maxDate) return;
    const dateStr = toDateString(day);
    onSelectDate(dateStr);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const isSelected = (day: Date | null): boolean => {
    if (!day || !selectedDate) return false;
    return toDateString(day) === selectedDate;
  };

  const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.sheet, { backgroundColor: colors.background, paddingBottom: bottomInset + 16 }]}
        >
          <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
          <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Select Date</Text>

          <View style={[calStyles.calContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Month nav */}
            <View style={calStyles.monthNav}>
              <TouchableOpacity onPress={goToPrevMonth} style={calStyles.navBtn}>
                <Ionicons name="chevron-back" size={18} color={colors.foreground} />
              </TouchableOpacity>
              <Text style={[calStyles.monthLabel, { color: colors.foreground }]}>
                {MONTH_NAMES[calMonth.getMonth()]} {calMonth.getFullYear()}
              </Text>
              <TouchableOpacity onPress={goToNextMonth} style={calStyles.navBtn}>
                <Ionicons name="chevron-forward" size={18} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            {/* Day headers */}
            <View style={calStyles.dayHeaderRow}>
              {DAY_LABELS.map((d) => (
                <Text key={d} style={[calStyles.dayHeaderText, { color: colors.mutedForeground }]}>{d}</Text>
              ))}
            </View>

            {/* Day grid */}
            <View style={calStyles.grid}>
              {calDays.map((day, idx) => {
                if (!day) {
                  return <View key={`empty-${idx}`} style={calStyles.dayCell} />;
                }
                const isPast = day < today;
                const isFuture = day > maxDate;
                const disabled = isPast || isFuture;
                const selected = isSelected(day);
                const isToday = toDateString(day) === toDateString(today);

                return (
                  <TouchableOpacity
                    key={toDateString(day)}
                    style={[
                      calStyles.dayCell,
                      selected && { backgroundColor: "#C8F248" },
                    ]}
                    onPress={() => !disabled && handleDayPress(day)}
                    activeOpacity={disabled ? 1 : 0.7}
                  >
                    <Text style={[
                      calStyles.dayText,
                      { color: disabled ? colors.border : selected ? "#0D0D0D" : colors.foreground },
                      isToday && !selected && { color: "#C8F248", fontWeight: "700" },
                    ]}>
                      {day.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[calStyles.hint, { color: colors.mutedForeground }]}>
              Select a date up to 3 months in the future
            </Text>
          </View>

          {selectedDate && (
            <TouchableOpacity
              style={[styles.clearBtn, { borderColor: colors.border }]}
              onPress={() => {
                onSelectDate("");
                onClose();
              }}
            >
              <Text style={[styles.clearText, { color: colors.mutedForeground }]}>Clear date</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

function TimePickerModal({
  visible,
  selectedTime,
  onSelectTime,
  onClose,
  colors,
  insets,
}: {
  visible: boolean;
  selectedTime: string;
  onSelectTime: (time: string) => void;
  onClose: () => void;
  colors: ReturnType<typeof useColors>;
  insets: ReturnType<typeof useSafeAreaInsets>;
}) {
  const bottomInset = insets.bottom > 0 ? insets.bottom : 8;

  // Generate time slots from 4:00 AM to 12:00 AM (midnight) in 30-minute intervals
  const timeSlots = React.useMemo(() => {
    const slots: string[] = [];
    for (let hour = 4; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const timeStr = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
        slots.push(timeStr);
      }
    }
    return slots;
  }, []);

  const handleTimeSelect = (timeStr: string) => {
    onSelectTime(timeStr);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.sheet, { backgroundColor: colors.background, paddingBottom: bottomInset + 16 }]}
        >
          <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
          <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Select Time</Text>

          <ScrollView
            style={timeStyles.timeList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={timeStyles.timeListContent}
          >
            {timeSlots.map((timeStr) => {
              const isSelected = selectedTime === timeStr;
              return (
                <TouchableOpacity
                  key={timeStr}
                  style={[
                    timeStyles.timeOption,
                    {
                      backgroundColor: isSelected ? "#C8F24820" : colors.card,
                      borderColor: isSelected ? "#C8F248" : colors.border,
                    },
                  ]}
                  onPress={() => handleTimeSelect(timeStr)}
                  activeOpacity={0.8}
                >
                  <Text style={[timeStyles.timeText, { color: isSelected ? "#1A1A1A" : colors.foreground, fontWeight: isSelected ? "700" : "500" }]}>
                    {timeStr}
                  </Text>
                  {isSelected && <Ionicons name="checkmark-circle" size={20} color="#1A1A1A" />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {selectedTime && (
            <TouchableOpacity
              style={[styles.clearBtn, { borderColor: colors.border }]}
              onPress={() => {
                onSelectTime("");
                onClose();
              }}
            >
              <Text style={[styles.clearText, { color: colors.mutedForeground }]}>Clear time</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

function SectionTitle({ title, colors }: { title: string; colors: ReturnType<typeof useColors> }) {
  return (
    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
  );
}

function FormField({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  colors,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: TextInput["props"]["keyboardType"];
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Ionicons name={icon} size={16} color={colors.mutedForeground} />
      <TextInput
        style={[styles.input, { color: colors.foreground }]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: { flex: 1, fontSize: 18, fontWeight: "700", textAlign: "center" },
  scroll: { paddingHorizontal: 20, gap: 10 },
  sportScroll: { marginBottom: 4 },
  sportChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
    marginRight: 8,
  },
  sportChipText: { fontSize: 13, fontWeight: "600" },
  sectionTitle: { fontSize: 14, fontWeight: "700", marginTop: 10, marginBottom: 2 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  input: { flex: 1, fontSize: 14 },
  row: { flexDirection: "row", gap: 10 },
  toggleRow: { flexDirection: "row", gap: 10, marginTop: 4 },
  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  toggleText: { fontSize: 14, fontWeight: "600" },
  textArea: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  textAreaInput: { fontSize: 14, minHeight: 60, textAlignVertical: "top" },
  imageUpload: {
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: "dashed",
    padding: 28,
    alignItems: "center",
    gap: 8,
  },
  uploadText: { fontSize: 15, fontWeight: "600" },
  uploadSub: { fontSize: 12 },
  publishBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 100,
    marginTop: 8,
  },
  publishText: { fontSize: 16, fontWeight: "800", color: "#0D0D0D" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    gap: 10,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 8,
  },
  sheetTitle: { fontSize: 18, fontWeight: "800" },
  clearBtn: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    marginTop: 4,
  },
  clearText: { fontSize: 14, fontWeight: "600" },
  errorText: { fontSize: 12, marginTop: 4, fontWeight: "500" },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  minLabel: {
    fontSize: 14,
    fontWeight: "700",
    paddingBottom: 8,
  },
  formatSplitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  vsLabel: {
    fontSize: 14,
    fontWeight: "700",
    paddingBottom: 8,
  },
});

const calStyles = StyleSheet.create({
  calContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginTop: 4,
  },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  navBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: "700",
  },
  dayHeaderRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  dayHeaderText: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  dayText: {
    fontSize: 13,
    fontWeight: "500",
  },
  hint: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 8,
  },
});

const timeStyles = StyleSheet.create({
  timeList: {
    maxHeight: 300,
  },
  timeListContent: {
    gap: 8,
  },
  timeOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  timeText: {
    fontSize: 15,
  },
});
