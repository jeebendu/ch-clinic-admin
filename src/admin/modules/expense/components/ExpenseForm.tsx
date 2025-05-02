
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Expense, ExpenseItem, PaymentType } from '../types/Expense';
import { useToast } from '@/hooks/use-toast';

interface ExpenseFormProps {
  expense?: Expense;
  onSubmit: (expense: Expense) => void;
  onCancel: () => void;
}

const ExpenseForm = ({ expense, onSubmit, onCancel }: ExpenseFormProps) => {
  const { toast } = useToast();
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([
    { id: 1, name: 'Cash' },
    { id: 2, name: 'Bank Transfer' },
    { id: 3, name: 'Card' },
  ]);
  const [formData, setFormData] = useState<Partial<Expense>>({
    items: [],
    subtotal: 0,
    discount: 0,
    grandTotal: 0,
    paymentType: { id: 1, name: 'Cash' },
    status: true,
    approved: false,
  });

  const [items, setItems] = useState<ExpenseItem[]>([
    { id: 1, description: '', price: 0, qty: 1, total: 0 },
  ]);

  useEffect(() => {
    if (expense) {
      setFormData({
        ...expense,
      });
      if (expense.items && expense.items.length > 0) {
        setItems(expense.items);
      }
    }
  }, [expense]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePaymentTypeChange = (value: string) => {
    const selectedType = paymentTypes.find(type => type.id === parseInt(value));
    setFormData({
      ...formData,
      paymentType: selectedType,
    });
  };

  const handleItemChange = (index: number, field: keyof ExpenseItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'description' ? value : parseFloat(value) || 0,
    };

    // Recalculate total for this item
    if (field === 'price' || field === 'qty') {
      updatedItems[index].total = updatedItems[index].price * updatedItems[index].qty;
    }

    setItems(updatedItems);
    calculateTotals(updatedItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: items.length + 1, description: '', price: 0, qty: 1, total: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
      calculateTotals(updatedItems);
    } else {
      toast({
        title: "Cannot remove item",
        description: "At least one item is required",
        variant: "destructive",
      });
    }
  };

  const calculateTotals = (itemsList: ExpenseItem[]) => {
    const subtotal = itemsList.reduce((sum, item) => sum + item.total, 0);
    const discount = formData.discount || 0;
    const grandTotal = subtotal - discount;

    setFormData(prev => ({
      ...prev,
      subtotal,
      grandTotal,
      items: itemsList,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.description) {
      toast({
        title: "Description required",
        description: "Please provide a description for the expense",
        variant: "destructive",
      });
      return;
    }

    if (items.some(item => !item.description)) {
      toast({
        title: "Item description required",
        description: "Please provide a description for all expense items",
        variant: "destructive",
      });
      return;
    }

    // Submit the form
    onSubmit({
      ...formData,
      items,
      expenseTime: formData.expenseTime || new Date(),
      createdTime: formData.createdTime || new Date(),
    } as Expense);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{expense ? 'Edit Expense' : 'Create Expense'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description || ''} 
                onChange={handleChange} 
                className="mt-1"
                placeholder="Expense description" 
              />
            </div>
            
            <div>
              <Label htmlFor="paymentType">Payment Type</Label>
              <Select 
                value={formData.paymentType?.id.toString() || '1'} 
                onValueChange={handlePaymentTypeChange}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="remark">Remarks</Label>
              <Textarea 
                id="remark" 
                name="remark" 
                value={formData.remark || ''} 
                onChange={handleChange} 
                className="mt-1"
                placeholder="Additional remarks" 
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Expense Items</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addItem}
                >
                  Add Item
                </Button>
              </div>
              
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center border p-3 rounded-lg">
                  <div className="col-span-5">
                    <Label htmlFor={`item-description-${index}`}>Description</Label>
                    <Input 
                      id={`item-description-${index}`}
                      value={item.description} 
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="Item description"
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`item-price-${index}`}>Price</Label>
                    <Input 
                      id={`item-price-${index}`}
                      type="number" 
                      value={item.price} 
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                      placeholder="0.00"
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`item-qty-${index}`}>Qty</Label>
                    <Input 
                      id={`item-qty-${index}`}
                      type="number" 
                      value={item.qty} 
                      onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                      placeholder="1"
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Total</Label>
                    <div className="mt-2 font-medium">${item.total.toFixed(2)}</div>
                  </div>
                  <div className="col-span-1 flex items-end justify-center">
                    <Button 
                      type="button" 
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1"
                      onClick={() => removeItem(index)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span>Subtotal:</span>
                <span>${(formData.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Discount:</span>
                <div className="w-32">
                  <Input 
                    type="number" 
                    name="discount"
                    value={formData.discount || 0} 
                    onChange={(e) => {
                      const discountValue = parseFloat(e.target.value) || 0;
                      setFormData({
                        ...formData,
                        discount: discountValue,
                        grandTotal: (formData.subtotal || 0) - discountValue
                      });
                    }}
                    placeholder="0.00"
                    className="text-right"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span>Grand Total:</span>
                <span>${(formData.grandTotal || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {expense ? 'Update Expense' : 'Create Expense'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
