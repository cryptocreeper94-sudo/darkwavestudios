import { useState } from "react";
import { Link } from "wouter";
import { 
  ArrowRight, ArrowLeft, Calendar, Clock, Video, Phone, 
  CheckCircle2, Loader2, ChevronLeft, ChevronRight, Zap, User, Mail, Check
} from "lucide-react";

import videoCallImg from "@assets/generated_images/video_call_meeting_laptop.png";
import phoneImg from "@assets/generated_images/phone_consultation_screen.png";
import portfolioImg from "@assets/generated_images/portfolio_presentation_screen.png";

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
];

const meetingTypes = [
  { id: "discovery", name: "Discovery Call", duration: "30 min", icon: Video, desc: "Let's discuss your project goals", image: videoCallImg },
  { id: "consultation", name: "Technical Consultation", duration: "45 min", icon: Phone, desc: "Deep dive into requirements", image: phoneImg },
  { id: "demo", name: "Portfolio Demo", duration: "20 min", icon: Calendar, desc: "See our work in action", image: portfolioImg }
];

export default function Book() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState("discovery");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState<"type" | "date" | "time" | "details">("type");

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = date.getDay();
    return date >= today && day !== 0 && day !== 6;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !formData.name || !formData.email) return;

    setLoading(true);
    try {
      const bookingDate = new Date(selectedDate);
      const [time, period] = selectedTime.split(" ");
      const [hours, minutes] = time.split(":");
      let hour = parseInt(hours);
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
      bookingDate.setHours(hour, parseInt(minutes));

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          date: bookingDate.toISOString(),
          timeSlot: selectedTime,
          type: selectedType,
          notes: formData.notes || null
        })
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    const today = new Date();
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    if (newMonth >= new Date(today.getFullYear(), today.getMonth())) {
      setCurrentMonth(newMonth);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
      
      <header className="sticky top-0 z-50 glass-strong border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl lg:text-2xl font-bold gradient-text">
            DarkWave
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/services" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Services</Link>
            <Link href="/projects" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Projects</Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</Link>
            <Link href="/compare" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Compare</Link>
            <Link href="/contact" className="btn-glow bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold">
              Get Quote
            </Link>
          </nav>
          <Link href="/" className="lg:hidden text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-primary mb-6">
            <Calendar className="w-4 h-4" />
            <span>Free 30-Minute Call</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold font-display mb-4">
            <span className="gradient-text">Book a Discovery Call</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Let's discuss your project. No sales pitch — just an honest conversation about what we can build together.
          </p>
        </div>

        {submitted ? (
          <div className="max-w-2xl mx-auto glass-card rounded-3xl p-8 lg:p-12 gradient-border text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold font-display mb-3 gradient-text">You're Booked!</h2>
            <p className="text-muted-foreground mb-6">
              {formatDate(selectedDate!)} at {selectedTime}
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Check your email for a calendar invite and meeting link. We're looking forward to talking with you!
            </p>
            <Link 
              href="/"
              className="btn-glow inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold"
            >
              Back to Home
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 lg:grid-cols-12 gap-4 lg:gap-6">
            {/* Progress Steps */}
            <div className="col-span-3 lg:col-span-12 glass-card rounded-2xl p-4 gradient-border mb-4">
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                {["type", "date", "time", "details"].map((s, i) => (
                  <div key={s} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step === s ? "bg-primary text-primary-foreground" : 
                      ["type", "date", "time", "details"].indexOf(step) > i ? "bg-primary/20 text-primary" : 
                      "bg-white/10 text-muted-foreground"
                    }`}>
                      {i + 1}
                    </div>
                    {i < 3 && <div className={`w-16 lg:w-24 h-1 mx-2 rounded ${
                      ["type", "date", "time", "details"].indexOf(step) > i ? "bg-primary/50" : "bg-white/10"
                    }`} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-3 lg:col-span-8 glass-card rounded-2xl lg:rounded-3xl p-6 lg:p-8 gradient-border card-3d">
              
              {/* Step 1: Meeting Type */}
              {step === "type" && (
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold font-display mb-6">Choose Meeting Type</h2>
                  <div className="space-y-4">
                    {meetingTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => { setSelectedType(type.id); setStep("date"); }}
                        className={`w-full rounded-xl border-2 transition-all text-left relative overflow-hidden h-28 lg:h-32 group ${
                          selectedType === type.id 
                            ? "border-primary" 
                            : "border-white/10 hover:border-white/20"
                        }`}
                        data-testid={`button-meeting-${type.id}`}
                      >
                        <div 
                          className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity"
                          style={{ backgroundImage: `url(${type.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
                        <div className="relative z-10 h-full flex items-center gap-4 p-5">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-sm flex items-center justify-center">
                            <type.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-white">{type.name}</div>
                            <div className="text-sm text-muted-foreground">{type.desc}</div>
                          </div>
                          <div className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm text-sm">{type.duration}</div>
                        </div>
                        {selectedType === type.id && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Date Selection */}
              {step === "date" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <button onClick={() => setStep("type")} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                      <ChevronLeft className="w-5 h-5" /> Back
                    </button>
                    <h2 className="text-xl font-bold font-display">Select a Date</h2>
                    <div className="w-20" />
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-white/10">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h3 className="font-bold">
                      {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </h3>
                    <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-white/10">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center text-xs text-muted-foreground py-2">{day}</div>
                    ))}
                    {getDaysInMonth(currentMonth).map((date, i) => (
                      <div key={i}>
                        {date ? (
                          <button
                            onClick={() => { if (isDateAvailable(date)) { setSelectedDate(date); setStep("time"); } }}
                            disabled={!isDateAvailable(date)}
                            className={`w-full aspect-square rounded-lg flex items-center justify-center text-sm transition-all ${
                              selectedDate?.toDateString() === date.toDateString()
                                ? "bg-primary text-primary-foreground"
                                : isDateAvailable(date)
                                ? "hover:bg-white/10"
                                : "text-muted-foreground/30 cursor-not-allowed"
                            }`}
                          >
                            {date.getDate()}
                          </button>
                        ) : (
                          <div />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Time Selection */}
              {step === "time" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <button onClick={() => setStep("date")} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                      <ChevronLeft className="w-5 h-5" /> Back
                    </button>
                    <h2 className="text-xl font-bold font-display">Select a Time</h2>
                    <div className="w-20" />
                  </div>

                  <p className="text-center text-muted-foreground mb-6">{formatDate(selectedDate!)}</p>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => { setSelectedTime(time); setStep("details"); }}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          selectedTime === time 
                            ? "border-primary bg-primary/10" 
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                        data-testid={`button-time-${time.replace(/[:\s]/g, "-")}`}
                      >
                        <Clock className="w-4 h-4 mx-auto mb-1 text-primary" />
                        <div className="text-sm font-medium">{time}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Contact Details */}
              {step === "details" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <button onClick={() => setStep("time")} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                      <ChevronLeft className="w-5 h-5" /> Back
                    </button>
                    <h2 className="text-xl font-bold font-display">Your Details</h2>
                    <div className="w-20" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 mb-6">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium">{formatDate(selectedDate!)}</div>
                        <div className="text-sm text-muted-foreground">{selectedTime} • {meetingTypes.find(t => t.id === selectedType)?.name}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                            placeholder="Your name"
                            required
                            data-testid="input-booking-name"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                            placeholder="your@email.com"
                            required
                            data-testid="input-booking-email"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Phone (optional)</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                          placeholder="(555) 123-4567"
                          data-testid="input-booking-phone"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">What would you like to discuss?</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none resize-none"
                        rows={3}
                        placeholder="Brief description of your project or questions..."
                        data-testid="textarea-booking-notes"
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={!formData.name || !formData.email || loading}
                      className="btn-glow w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid="button-confirm-booking"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Booking...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Confirm Booking
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="col-span-3 lg:col-span-4 space-y-4 lg:space-y-6">
              <div className="glass-card rounded-2xl lg:rounded-3xl p-6 gradient-border card-3d">
                <h3 className="font-bold text-lg mb-4 gradient-text">What to Expect</h3>
                <div className="space-y-4">
                  {[
                    { icon: Zap, title: "No Sales Pitch", text: "Just an honest conversation about your needs" },
                    { icon: Video, title: "Video or Phone", text: "We'll send you a Zoom link or call your number" },
                    { icon: Clock, title: "Come Prepared", text: "Think about your goals and timeline" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 gradient-border bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎯</div>
                  <div className="font-bold text-lg">100% Free</div>
                  <div className="text-sm text-muted-foreground">No obligation, no pressure. Cancel anytime.</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="glass-strong mt-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-display text-xl font-bold gradient-text">DarkWave Studios</div>
          <div className="text-muted-foreground text-sm">© 2025. Built with passion, priced with honesty.</div>
        </div>
      </footer>
    </div>
  );
}
