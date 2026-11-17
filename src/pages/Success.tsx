import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function Success() {
  const { state } = useLocation();
  const orderData = state?.orderData;

  if (!orderData)
    return (
      <div className="min-h-screen bg-pastel-soft flex items-center justify-center text-2xl">
        No order data
      </div>
    );

  return (
    <div className="min-h-screen bg-pastel-soft py-20 px-4">
      <div className="max-w-xl mx-auto text-center">
        <div className="w-24 h-24 bg-mint rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-4xl font-extrabold mb-2">
          Order <span className="text-gradient">Placed!</span>
        </h1>
        <p className="text-ink-soft mb-6">Thank you for shopping with AuraCart 💜</p>

        {/* ✅ Spam Notice Section */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-xl mb-8 flex items-start text-left shadow-sm">
          <AlertCircle className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-bold">Confirmation Email Notice</h3>
            <p className="text-sm mt-1">
              We've sent your order receipt to <strong>{orderData.email}</strong>. 
              Please check your <strong>Spam or Junk folder</strong> if you don't see it in your inbox within a few minutes. Mark it as "Not Spam" to receive future updates.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-card border-2 border-lilac text-left space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-lilac">
            <span className="text-ink-soft font-medium">Order Number</span>
            <span className="font-extrabold text-ink">{orderData.orderNumber}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-lilac">
            <span className="text-ink-soft font-medium">Total Amount</span>
            <span className="font-extrabold text-gradient text-xl">₹{orderData.total}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-lilac">
            <span className="text-ink-soft font-medium">Delivery By</span>
            <span className="font-bold text-ink">{orderData.deliveryDate}</span>
          </div>
          <div>
            <span className="text-ink-soft font-medium block mb-1">Delivering to</span>
            <p className="font-bold text-ink">
              {orderData.address}, {orderData.city}
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-8 btn-primary px-8 py-3"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}