
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Activity, DollarSign } from "lucide-react";

const statsCards = [
  {
    title: "Total Patients",
    value: "2,854",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "text-blue-500 bg-blue-100",
  },
  {
    title: "Appointments Today",
    value: "42",
    change: "+3.2%",
    trend: "up",
    icon: Calendar,
    color: "text-green-500 bg-green-100",
  },
  {
    title: "Average Wait Time",
    value: "14min",
    change: "-2.3%",
    trend: "down",
    icon: Activity,
    color: "text-orange-500 bg-orange-100",
  },
  {
    title: "Revenue this Month",
    value: "$24,685",
    change: "+8.1%",
    trend: "up",
    icon: DollarSign,
    color: "text-purple-500 bg-purple-100",
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.color}`}>
                <card.icon size={16} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className={`text-xs ${card.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {card.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div 
                  key={item} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-600">
                        {String.fromCharCode(64 + item)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">Patient {item}</p>
                      <p className="text-sm text-gray-500">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className={`px-2 py-1 rounded-full ${
                      item % 3 === 0 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : item % 2 === 0 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item % 3 === 0 
                        ? 'Waiting' 
                        : item % 2 === 0 
                          ? 'Completed'
                          : 'In Progress'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[9, 10, 11, 14, 16].map((hour, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="min-w-[60px] text-right">
                    <span className="text-sm font-medium">{`${hour}:00`}</span>
                  </div>
                  <div className={`flex-1 p-3 rounded-lg ${
                    index % 3 === 0 
                      ? 'bg-clinic-accent border-l-4 border-clinic-primary' 
                      : 'bg-gray-50'
                  }`}>
                    {index % 3 === 0 ? (
                      <>
                        <p className="font-medium">{`Appointment ${index + 1}`}</p>
                        <p className="text-sm text-gray-500">Dr. Johnson • Room 3</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">Available</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
