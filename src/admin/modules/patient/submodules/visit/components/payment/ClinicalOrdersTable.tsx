
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ClinicalOrderItem } from '../../types/PaymentTypes';

interface ClinicalOrdersTableProps {
  orders: ClinicalOrderItem[];
  onAddOrder?: () => void;
  onEditOrder?: (orderId: string) => void;
  onDeleteOrder?: (orderId: string) => void;
  readOnly?: boolean;
}

const ClinicalOrdersTable: React.FC<ClinicalOrdersTableProps> = ({
  orders,
  onAddOrder,
  onEditOrder,
  onDeleteOrder,
  readOnly = false
}) => {
  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getServiceTypeIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'consultation': return '👨‍⚕️';
      case 'procedure': return '🏥';
      case 'medication': return '💊';
      case 'lab_test': return '🧪';
      case 'imaging': return '📸';
      default: return '📋';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Clinical Orders</CardTitle>
          {!readOnly && (
            <Button 
              onClick={onAddOrder}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Service
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-700">Service</th>
                <th className="text-right py-3 px-2 font-medium text-gray-700">Unit Price</th>
                <th className="text-center py-3 px-2 font-medium text-gray-700">Qty</th>
                <th className="text-right py-3 px-2 font-medium text-gray-700">Total</th>
                <th className="text-center py-3 px-2 font-medium text-gray-700">Status</th>
                {!readOnly && <th className="text-center py-3 px-2 font-medium text-gray-700">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={readOnly ? 5 : 6} className="text-center py-8 text-gray-500">
                    No clinical orders added yet
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{getServiceTypeIcon(order.serviceType)}</span>
                        <div>
                          <div className="font-medium text-gray-900">{order.serviceName}</div>
                          {order.description && (
                            <div className="text-sm text-gray-500 mt-1">{order.description}</div>
                          )}
                          <div className="text-xs text-gray-400 mt-1">
                            Added: {order.addedDate.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right font-medium">₹{order.unitPrice.toFixed(2)}</td>
                    <td className="py-3 px-2 text-center">{order.quantity}</td>
                    <td className="py-3 px-2 text-right font-semibold">₹{order.totalAmount.toFixed(2)}</td>
                    <td className="py-3 px-2 text-center">
                      {getStatusBadge(order.status)}
                    </td>
                    {!readOnly && (
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditOrder?.(order.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteOrder?.(order.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
            {orders.length > 0 && (
              <tfoot className="border-t-2 border-gray-300">
                <tr className="bg-gray-50">
                  <td colSpan={3} className="py-3 px-2 font-semibold text-right">Grand Total:</td>
                  <td className="py-3 px-2 text-right font-bold text-lg">
                    ₹{orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
                  </td>
                  <td colSpan={readOnly ? 1 : 2}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClinicalOrdersTable;
