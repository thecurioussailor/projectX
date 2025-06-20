import { usePaymentMethod } from "../../hooks/usePaymentMethod";
import { useState, useEffect } from "react";
import { useToast } from "../ui/Toast";
import { FaSpinner, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { CreatePaymentMethodData, UpdatePaymentMethodData, PaymentMethod as PaymentMethodType } from "../../store/usePaymentMethodStore";

const PaymentMethod = () => {
  const {
    paymentMethods,
    isLoading,
    error,
    createPaymentMethod,
    getUserPaymentMethods,
    updatePaymentMethod,
    deletePaymentMethod,
    clearError,
    hasPrimaryBankAccount,
    hasPrimaryUPI,
    bankAccounts,
    upiMethods
  } = usePaymentMethod();
  
  const { showToast } = useToast();
  
  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethodType | null>(null);
  const [formData, setFormData] = useState<CreatePaymentMethodData>({
    type: 'BANK',
    priority: 'SECONDARY',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    upiId: '',
    upiName: ''
  });



  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      clearError();
    }
  }, [error]);

  const resetForm = () => {
    setFormData({
      type: 'BANK',
      priority: 'SECONDARY',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      upiId: '',
      upiName: ''
    });
    setShowAddForm(false);
    setEditingMethod(null);
  };

  const handleSubmit = async () => {
    // Validation
    if (formData.type === 'BANK') {
      if (!formData.bankName?.trim() || !formData.accountNumber?.trim() || 
          !formData.ifscCode?.trim() || !formData.accountHolderName?.trim()) {
        showToast('Please fill all bank account details', 'error');
        return;
      }
    } else if (formData.type === 'UPI') {
      if (!formData.upiId?.trim() || !formData.upiName?.trim()) {
        showToast('Please fill all UPI details', 'error');
        return;
      }
    }

    try {
      if (editingMethod) {
        const updateData: UpdatePaymentMethodData = {
          priority: formData.priority,
          ...(formData.type === 'BANK' ? {
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifscCode,
            accountHolderName: formData.accountHolderName
          } : {
            upiId: formData.upiId,
            upiName: formData.upiName
          })
        };
        
        const result = await updatePaymentMethod(editingMethod.id, updateData);
        if (result.success) {
          showToast('Payment method updated successfully!', 'success');
          resetForm();
          getUserPaymentMethods();
        }
      } else {
        const result = await createPaymentMethod(formData);
        if (result.success) {
          showToast('Payment method added successfully!', 'success');
          resetForm();
          getUserPaymentMethods();
        }
      }
    } catch {
      showToast('Operation failed. Please try again.', 'error');
    }
  };

  const handleEdit = (method: PaymentMethodType) => {
    setEditingMethod(method);
    setFormData({
      type: method.type,
      priority: method.priority,
      bankName: method.bankName || '',
      accountNumber: method.accountNumber || '',
      ifscCode: method.ifscCode || '',
      accountHolderName: method.accountHolderName || '',
      upiId: method.upiId || '',
      upiName: method.upiName || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (methodId: string) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      try {
        const result = await deletePaymentMethod(methodId);
        if (result.success) {
          showToast('Payment method deleted successfully!', 'success');
          getUserPaymentMethods();
        }
      } catch {
        showToast('Failed to delete payment method. Please try again.', 'error');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'text-green-600 bg-green-100';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'PRIMARY' ? 'text-blue-600 bg-blue-100' : 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="flex justify-between gap-4 bg-white rounded-[3rem] w-full overflow-clip shadow-lg shadow-purple-100">
      <div className="flex flex-col gap-4 w-full">
        <div className="relative ml-8 mt-8">
          <div className="absolute rounded-full bg-[#7E37D8] h-14 w-14 -top-6 -left-16"></div>
          <div className="absolute rounded-full bg-[#7E37D8] h-1 w-1 top-2 left-4"></div>
          <div className="absolute rounded-full bg-[#FE80B2] h-8 w-8 top-4 -left-12"></div>
          <div className="absolute rounded-full bg-[#FE80B2] h-2 w-2 -top-2 left-2"></div>
          <div className="absolute rounded-full bg-[#FFC717] h-8 w-8 -top-12 -left-4"></div>
          <div className="absolute rounded-full bg-[#06B5DD] h-4 w-4 top-3 -left-2"></div>
        </div>
        
        <div className="flex flex-col gap-2 pb-4 px-12">
          <h1 className="text-2xl font-bold text-[#1B3155]">Payment Methods</h1>
          <p className="text-sm text-gray-500">Manage your bank accounts and UPI methods for transactions</p>
        </div>

        <div className="flex flex-col gap-6 p-12 pt-0">
          {/* Add New Payment Method Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-[#7F37D8] text-white px-4 py-2 rounded-md w-fit"
            >
              <FaPlus /> Add Payment Method
            </button>
          )}

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-[#1B3155] mb-4">
                {editingMethod ? 'Edit Payment Method' : 'Add New Payment Method'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-medium">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as 'BANK' | 'UPI'})}
                    className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
                    disabled={!!editingMethod}
                  >
                    <option value="BANK">Bank Account</option>
                    <option value="UPI">UPI</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-medium">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value as 'PRIMARY' | 'SECONDARY'})}
                    className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
                  >
                    <option value="PRIMARY">Primary</option>
                    <option value="SECONDARY">Secondary</option>
                  </select>
                </div>

                {formData.type === 'BANK' ? (
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="font-medium">Bank Name</label>
                      <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                        className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
                        placeholder="Enter bank name"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-medium">Account Number</label>
                      <input
                        type="text"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                        className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
                        placeholder="Enter account number"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-medium">IFSC Code</label>
                      <input
                        type="text"
                        value={formData.ifscCode}
                        onChange={(e) => setFormData({...formData, ifscCode: e.target.value})}
                        className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
                        placeholder="Enter IFSC code"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-medium">Account Holder Name</label>
                      <input
                        type="text"
                        value={formData.accountHolderName}
                        onChange={(e) => setFormData({...formData, accountHolderName: e.target.value})}
                        className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
                        placeholder="Enter account holder name"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="font-medium">UPI ID</label>
                      <input
                        type="text"
                        value={formData.upiId}
                        onChange={(e) => setFormData({...formData, upiId: e.target.value})}
                        className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
                        placeholder="Enter UPI ID (e.g., user@paytm)"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-medium">UPI Name</label>
                      <input
                        type="text"
                        value={formData.upiName}
                        onChange={(e) => setFormData({...formData, upiName: e.target.value})}
                        className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
                        placeholder="Enter name on UPI"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSubmit}
                  className="bg-[#7F37D8] text-white px-4 py-2 rounded-md"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <FaSpinner className="animate-spin" /> 
                      {editingMethod ? 'Updating...' : 'Adding...'}
                    </span>
                  ) : (
                    editingMethod ? 'Update' : 'Add'
                  )}
                </button>
                <button
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Payment Methods List */}
          <div className="space-y-6">
            {/* Bank Accounts Section */}
            {bankAccounts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-[#1B3155] mb-4">Bank Accounts</h3>
                <div className="grid gap-4">
                  {bankAccounts.map((method) => (
                    <div key={method.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{method.bankName}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(method.priority)}`}>
                              {method.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">Account: ****{method.accountNumber?.slice(-4)}</p>
                          <p className="text-sm text-gray-600">IFSC: {method.ifscCode}</p>
                          <p className="text-sm text-gray-600">Holder: {method.accountHolderName}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(method)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(method.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* UPI Methods Section */}
            {upiMethods.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-[#1B3155] mb-4">UPI Methods</h3>
                <div className="grid gap-4">
                  {upiMethods.map((method) => (
                    <div key={method.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{method.upiName}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(method.priority)}`}>
                              {method.priority}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(method.status)}`}>
                              {method.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">UPI ID: {method.upiId}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(method)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(method.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {paymentMethods.length === 0 && !showAddForm && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No payment methods added yet</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-[#7F37D8] text-white px-4 py-2 rounded-md"
                >
                  Add Your First Payment Method
                </button>
              </div>
            )}
          </div>

          {/* Summary */}
          {paymentMethods.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-[#1B3155] mb-2">Summary</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Total Payment Methods: {paymentMethods.length}</p>
                <p>Bank Accounts: {bankAccounts.length}</p>
                <p>UPI Methods: {upiMethods.length}</p>
                <p>Primary Bank Account: {hasPrimaryBankAccount ? '✅ Set' : '❌ Not Set'}</p>
                <p>Primary UPI: {hasPrimaryUPI ? '✅ Set' : '❌ Not Set'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;