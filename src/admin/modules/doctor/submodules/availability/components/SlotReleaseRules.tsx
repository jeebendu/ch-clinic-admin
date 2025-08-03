
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Target, Plus, Trash2 } from "lucide-react";
import { DoctorBranch } from "@/admin/modules/appointments/types/DoctorClinic";
import { TimeRange } from "../types/DoctorAvailability";

interface SlotReleaseRule {
  id?: number;
  scope: 'default' | 'weekday' | 'time_range';
  weekday?: number;
  timeRangeId?: number;
  releaseDaysBefore: number;
  releaseTime: string;
  releaseMinutesBeforeSlot?: number;
  isActive: boolean;
}

interface SlotReleaseRulesProps {
  doctorBranch: DoctorBranch;
  timeRanges: Record<string, TimeRange[]>;
  onSave: (rules: SlotReleaseRule[]) => void;
  className?: string;
}

const WEEKDAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

const SlotReleaseRules: React.FC<SlotReleaseRulesProps> = ({
  doctorBranch,
  timeRanges,
  onSave,
  className
}) => {
  const [rules, setRules] = useState<SlotReleaseRule[]>([]);
  const [weekdayRulesEnabled, setWeekdayRulesEnabled] = useState(false);
  const [timeRangeRulesEnabled, setTimeRangeRulesEnabled] = useState(false);

  // Initialize with default rule
  useEffect(() => {
    const defaultRule: SlotReleaseRule = {
      scope: 'default',
      releaseDaysBefore: 1,
      releaseTime: '06:00',
      isActive: true
    };
    
    setRules([defaultRule]);
  }, []);

  // Get all available time ranges from all days
  const getAllTimeRanges = () => {
    const allRanges: (TimeRange & { dayOfWeek: string })[] = [];
    Object.entries(timeRanges).forEach(([day, ranges]) => {
      ranges.forEach(range => {
        allRanges.push({ ...range, dayOfWeek: day });
      });
    });
    return allRanges;
  };

  const handleDefaultRuleChange = (field: keyof SlotReleaseRule, value: any) => {
    setRules(prev => prev.map(rule => 
      rule.scope === 'default' 
        ? { ...rule, [field]: value }
        : rule
    ));
  };

  const handleWeekdayToggle = (enabled: boolean) => {
    setWeekdayRulesEnabled(enabled);
    if (enabled) {
      // Add weekday rules for each day that has time ranges
      const weekdayRules: SlotReleaseRule[] = Object.keys(timeRanges).map(day => ({
        scope: 'weekday' as const,
        weekday: WEEKDAYS.findIndex(wd => wd.label.toLowerCase() === day.toLowerCase()),
        releaseDaysBefore: 0,
        releaseTime: '05:30',
        isActive: true
      }));
      
      setRules(prev => [
        ...prev.filter(rule => rule.scope !== 'weekday'),
        ...weekdayRules
      ]);
    } else {
      setRules(prev => prev.filter(rule => rule.scope !== 'weekday'));
    }
  };

  const handleTimeRangeToggle = (enabled: boolean) => {
    setTimeRangeRulesEnabled(enabled);
    if (enabled) {
      // Add one sample time range rule
      const allRanges = getAllTimeRanges();
      if (allRanges.length > 0) {
        const timeRangeRule: SlotReleaseRule = {
          scope: 'time_range',
          timeRangeId: allRanges[0].id,
          releaseMinutesBeforeSlot: 60,
          releaseDaysBefore: 0,
          releaseTime: '00:00',
          isActive: true
        };
        
        setRules(prev => [
          ...prev.filter(rule => rule.scope !== 'time_range'),
          timeRangeRule
        ]);
      }
    } else {
      setRules(prev => prev.filter(rule => rule.scope !== 'time_range'));
    }
  };

  const handleWeekdayRuleChange = (weekday: number, field: keyof SlotReleaseRule, value: any) => {
    setRules(prev => prev.map(rule => 
      rule.scope === 'weekday' && rule.weekday === weekday
        ? { ...rule, [field]: value }
        : rule
    ));
  };

  const handleTimeRangeRuleChange = (timeRangeId: number, field: keyof SlotReleaseRule, value: any) => {
    setRules(prev => prev.map(rule => 
      rule.scope === 'time_range' && rule.timeRangeId === timeRangeId
        ? { ...rule, [field]: value }
        : rule
    ));
  };

  const addTimeRangeRule = () => {
    const allRanges = getAllTimeRanges();
    const usedRangeIds = rules
      .filter(rule => rule.scope === 'time_range')
      .map(rule => rule.timeRangeId);
    
    const availableRange = allRanges.find(range => !usedRangeIds.includes(range.id));
    
    if (availableRange) {
      const newRule: SlotReleaseRule = {
        scope: 'time_range',
        timeRangeId: availableRange.id,
        releaseMinutesBeforeSlot: 60,
        releaseDaysBefore: 0,
        releaseTime: '00:00',
        isActive: true
      };
      
      setRules(prev => [...prev, newRule]);
    }
  };

  const removeTimeRangeRule = (timeRangeId: number) => {
    setRules(prev => prev.filter(rule => 
      !(rule.scope === 'time_range' && rule.timeRangeId === timeRangeId)
    ));
  };

  const handleSave = () => {
    onSave(rules);
  };

  const defaultRule = rules.find(rule => rule.scope === 'default');
  const weekdayRules = rules.filter(rule => rule.scope === 'weekday');
  const timeRangeRules = rules.filter(rule => rule.scope === 'time_range');

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Slot Release Rules
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Default Rule - Always Enabled */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            <Label className="font-medium">Default Rule</Label>
            <Badge variant="secondary">Always Active</Badge>
          </div>
          
          {defaultRule && (
            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-blue-50/50">
              <div>
                <Label htmlFor="default-days">Release Days Before</Label>
                <Input
                  id="default-days"
                  type="number"
                  min="0"
                  max="30"
                  value={defaultRule.releaseDaysBefore}
                  onChange={(e) => handleDefaultRuleChange('releaseDaysBefore', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="default-time">Release Time</Label>
                <Input
                  id="default-time"
                  type="time"
                  value={defaultRule.releaseTime}
                  onChange={(e) => handleDefaultRuleChange('releaseTime', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>

        {/* Weekday-specific Rules */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-500" />
              <Label className="font-medium">Weekday-specific Rules</Label>
            </div>
            <Switch
              checked={weekdayRulesEnabled}
              onCheckedChange={handleWeekdayToggle}
            />
          </div>
          
          {weekdayRulesEnabled && (
            <div className="space-y-3">
              {weekdayRules.map((rule) => {
                const weekdayLabel = WEEKDAYS.find(wd => wd.value === rule.weekday)?.label;
                return (
                  <div key={rule.weekday} className="grid grid-cols-3 gap-3 p-3 border rounded-lg bg-green-50/50">
                    <div>
                      <Label className="text-sm font-medium">{weekdayLabel}</Label>
                    </div>
                    <div>
                      <Label className="text-xs">Days Before</Label>
                      <Input
                        type="number"
                        min="0"
                        max="7"
                        value={rule.releaseDaysBefore}
                        onChange={(e) => handleWeekdayRuleChange(
                          rule.weekday!,
                          'releaseDaysBefore',
                          parseInt(e.target.value)
                        )}
                        className="mt-1 h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Release Time</Label>
                      <Input
                        type="time"
                        value={rule.releaseTime}
                        onChange={(e) => handleWeekdayRuleChange(
                          rule.weekday!,
                          'releaseTime',
                          e.target.value
                        )}
                        className="mt-1 h-8"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Time Range-specific Rules */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <Label className="font-medium">Time Range-specific Rules</Label>
            </div>
            <Switch
              checked={timeRangeRulesEnabled}
              onCheckedChange={handleTimeRangeToggle}
            />
          </div>
          
          {timeRangeRulesEnabled && (
            <div className="space-y-3">
              {timeRangeRules.map((rule) => {
                const allRanges = getAllTimeRanges();
                const timeRange = allRanges.find(tr => tr.id === rule.timeRangeId);
                
                return (
                  <div key={rule.timeRangeId} className="grid grid-cols-4 gap-3 p-3 border rounded-lg bg-purple-50/50">
                    <div>
                      <Label className="text-xs">Time Range</Label>
                      <select
                        value={rule.timeRangeId}
                        onChange={(e) => handleTimeRangeRuleChange(
                          rule.timeRangeId!,
                          'timeRangeId',
                          parseInt(e.target.value)
                        )}
                        className="w-full mt-1 h-8 text-sm border rounded px-2"
                      >
                        {allRanges.map(tr => (
                          <option key={tr.id} value={tr.id}>
                            {tr.dayOfWeek} ({tr.startTime}-{tr.endTime})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs">Minutes Before</Label>
                      <Input
                        type="number"
                        min="0"
                        max="1440"
                        value={rule.releaseMinutesBeforeSlot || 0}
                        onChange={(e) => handleTimeRangeRuleChange(
                          rule.timeRangeId!,
                          'releaseMinutesBeforeSlot',
                          parseInt(e.target.value)
                        )}
                        className="mt-1 h-8"
                      />
                    </div>
                    <div>
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={(checked) => handleTimeRangeRuleChange(
                          rule.timeRangeId!,
                          'isActive',
                          checked
                        )}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTimeRangeRule(rule.timeRangeId!)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              {timeRangeRules.length < getAllTimeRanges().length && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addTimeRangeRule}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Time Range Rule
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave}>
            Save Release Rules
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SlotReleaseRules;
