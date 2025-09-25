import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import GoalTracker from "./GoalTracker";

type SessionType = 'study' | 'work' | 'exam';

interface ScheduleSlot {
  day: number;
  time: string;
  scheduled: boolean;
  completed?: boolean;
  type: SessionType;
}

const WeeklySchedule = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);
  const [selectedSessionType, setSelectedSessionType] = useState<SessionType>('study');

  // Generate time slots (45-minute intervals from 6 AM to 10 PM)
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 6;
    const endHour = 22;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 45) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Get week days
  const getWeekDays = () => {
    const startOfWeek = new Date(currentWeek);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }
    return weekDays;
  };

  const weekDays = getWeekDays();
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const toggleSlot = (dayIndex: number, time: string) => {
    const existingSlot = schedule.find(s => s.day === dayIndex && s.time === time);
    
    if (existingSlot) {
      setSchedule(schedule.filter(s => !(s.day === dayIndex && s.time === time)));
    } else {
      setSchedule([...schedule, { 
        day: dayIndex, 
        time, 
        scheduled: true, 
        completed: false,
        type: selectedSessionType
      }]);
    }
  };

  const markAsCompleted = (dayIndex: number, time: string) => {
    setSchedule(schedule.map(slot => 
      slot.day === dayIndex && slot.time === time 
        ? { ...slot, completed: !slot.completed }
        : slot
    ));
  };

  const isSlotScheduled = (dayIndex: number, time: string) => {
    return schedule.some(s => s.day === dayIndex && s.time === time);
  };

  const isSlotCompleted = (dayIndex: number, time: string) => {
    return schedule.some(s => s.day === dayIndex && s.time === time && s.completed);
  };

  const getSlotType = (dayIndex: number, time: string): SessionType | null => {
    const slot = schedule.find(s => s.day === dayIndex && s.time === time);
    return slot?.type || null;
  };

  const getScheduledStudySessions = () => {
    return schedule.filter(s => s.type === 'study').length;
  };

  const getCompletedStudySessions = () => {
    return schedule.filter(s => s.type === 'study' && s.completed).length;
  };

  const getTotalPoints = () => {
    return getCompletedStudySessions() * 10; // Only study sessions give points
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatWeekRange = () => {
    const firstDay = weekDays[0];
    const lastDay = weekDays[6];
    return `${firstDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${lastDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-background min-h-screen">
      <GoalTracker 
        scheduledStudySessions={getScheduledStudySessions()}
        completedStudySessions={getCompletedStudySessions()}
        totalPoints={getTotalPoints()}
      />
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-bold text-foreground">Study Schedule</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek('prev')}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-lg font-semibold text-foreground">
                {formatWeekRange()}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek('next')}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Session Type Selector */}
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm font-medium text-foreground">Session Type:</span>
            <div className="flex gap-2">
              {(['study', 'work', 'exam'] as SessionType[]).map((type) => (
                <Button
                  key={type}
                  variant={selectedSessionType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSessionType(type)}
                  className={`capitalize ${
                    selectedSessionType === type 
                      ? type === 'study' ? 'bg-study-slot text-study-slot-foreground' 
                        : type === 'work' ? 'bg-work-session text-work-session-foreground'
                        : 'bg-exam-session text-exam-session-foreground'
                      : ''
                  }`}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-8 gap-0">
            {/* Time column header */}
            <div className="bg-time-grid border-r border-border p-4 text-center font-semibold text-muted-foreground">
              Time
            </div>
            
            {/* Day headers */}
            {weekDays.map((date, index) => (
              <div
                key={index}
                className={`p-4 text-center font-semibold border-r border-border last:border-r-0 ${
                  isToday(date)
                    ? 'bg-today-highlight text-primary'
                    : 'bg-time-grid text-week-header'
                }`}
              >
                <div className="text-sm">{dayNames[index]}</div>
                <div className="text-xs opacity-75">{date.getDate()}</div>
              </div>
            ))}

            {/* Time slots */}
            {timeSlots.map((time) => (
              <div key={time} className="contents">
                {/* Time label */}
                <div className="bg-time-grid border-r border-t border-border p-3 text-sm font-medium text-muted-foreground text-center">
                  {time}
                </div>
                
                {/* Day slots */}
                {weekDays.map((_, dayIndex) => {
                  const slotType = getSlotType(dayIndex, time);
                  const isCompleted = isSlotCompleted(dayIndex, time);
                  const isScheduled = isSlotScheduled(dayIndex, time);
                  
                  let bgColor = 'bg-card hover:bg-accent';
                  let textColor = 'text-foreground';
                  
                  if (isCompleted) {
                    bgColor = 'bg-completed-task text-white';
                  } else if (isScheduled) {
                    switch (slotType) {
                      case 'study':
                        bgColor = 'bg-study-slot text-study-slot-foreground hover:bg-study-slot-hover';
                        break;
                      case 'work':
                        bgColor = 'bg-work-session text-work-session-foreground hover:bg-work-session/80';
                        break;
                      case 'exam':
                        bgColor = 'bg-exam-session text-exam-session-foreground hover:bg-exam-session/80';
                        break;
                    }
                  }

                  return (
                    <div
                      key={`${dayIndex}-${time}`}
                      className={`h-12 border-r border-t border-border last:border-r-0 transition-all duration-200 ${bgColor}`}
                    >
                      {isScheduled && (
                        <div className="flex flex-col h-full">
                          <button
                            onClick={() => toggleSlot(dayIndex, time)}
                            className="flex-1 text-xs font-medium hover:opacity-80 capitalize"
                          >
                            {isCompleted ? '✓ Done' : slotType}
                          </button>
                          {!isCompleted && (
                            <button
                              onClick={() => markAsCompleted(dayIndex, time)}
                              className="text-xs bg-black/20 hover:bg-black/30 transition-colors"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      )}
                      {!isScheduled && (
                        <button
                          onClick={() => toggleSlot(dayIndex, time)}
                          className="w-full h-full hover:bg-accent"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-center">
        <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-study-slot rounded"></div>
            <span>Study Session</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-work-session rounded"></div>
            <span>Work Session</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-exam-session rounded"></div>
            <span>Exam Session</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-completed-task rounded"></div>
            <span>Completed (+10 pts for study)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;