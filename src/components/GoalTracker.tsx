import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, CheckCircle } from "lucide-react";

interface GoalTrackerProps {
  scheduledStudySessions: number;
  completedStudySessions: number;
  totalPoints: number;
}

const GoalTracker = ({ scheduledStudySessions, completedStudySessions, totalPoints }: GoalTrackerProps) => {
  const progressPercentage = scheduledStudySessions > 0 ? (completedStudySessions / scheduledStudySessions) * 100 : 0;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-points-highlight" />
            <CardTitle className="text-2xl font-bold text-foreground">Weekly Goal Tracker</CardTitle>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <span className="text-points-highlight font-bold">{totalPoints}</span> Points
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-goal-progress" />
                <span className="font-semibold text-foreground">
                  Study Progress: {completedStudySessions} / {scheduledStudySessions}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-3 bg-goal-progress-bg"
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-5 w-5 text-completed-task" />
              </div>
              <div className="text-2xl font-bold text-completed-task">{completedStudySessions}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            
            <div className="text-center p-4 bg-card border border-border rounded-lg">
              <div className="text-2xl font-bold text-points-highlight">{totalPoints}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
            
            <div className="text-center p-4 bg-card border border-border rounded-lg">
              <div className="text-2xl font-bold text-foreground">{scheduledStudySessions - completedStudySessions}</div>
              <div className="text-sm text-muted-foreground">Remaining</div>
            </div>
          </div>

          {/* Achievement Message */}
          {scheduledStudySessions > 0 && completedStudySessions >= scheduledStudySessions && (
            <div className="text-center p-4 bg-goal-progress-bg rounded-lg border border-goal-progress">
              <Trophy className="h-8 w-8 text-goal-progress mx-auto mb-2" />
              <p className="text-lg font-semibold text-goal-progress">
                🎉 All Study Sessions Completed! Perfect week!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalTracker;