'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { getPaymentGateways, placeProductOrder, getOrderInvoice } from '@/services/checkoutService';
import { PaymentGatewayMethod, ProductOrderPayload, ProductOrderResponse } from '@/types/checkout';
import { Product } from '@/types/product';
import { 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  Tag, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Sparkles,
  Check,
  Printer,
  Download,
  Eye,
  Copy,
  FileCheck,
  X,
  Lock,
  EyeOff
} from 'lucide-react';

// Sample products matching prompt schema to initialize simple cart data if cart is empty
const SAMPLE_CART_PRODUCTS: Product[] = [
  {
    id: 65,
    name: '(Copy)',
    slug: 'copy-product',
    unit_price: 11000,
    sale_price: 11000,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
    description: 'High performance gadget',
    stock: 50,
  },
  {
    id: 61,
    name: 'Luxury Decor',
    slug: 'luxury-decor',
    unit_price: 1199,
    sale_price: 1199,
    image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=60',
    description: 'Elegant home interior decor item',
    stock: 30,
  },
];

interface AvailableCoupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  description: string;
}

const AVAILABLE_COUPONS: AvailableCoupon[] = [
  { code: 'KARBAR10', type: 'percent', value: 10, description: '10% discount on order' },
  { code: 'KARBAR20', type: 'percent', value: 20, description: '20% mega discount' },
  { code: 'SAVE100', type: 'flat', value: 100, description: 'TK100 flat discount' },
  { code: 'WELCOME50', type: 'flat', value: 50, description: 'TK50 new user discount' },
];

export default function CheckoutPage() {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount: cartSubTotal, totalCount } = useCart();
  const { currencyIcon } = useSiteSettings();

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [spacialInstruction, setSpacialInstruction] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('cash');
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Payment Gateways API State
  const [paymentMethods, setPaymentMethods] = useState<PaymentGatewayMethod[]>([]);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(true);

  // Coupon State
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AvailableCoupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Order Submission & Invoice State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [orderResponse, setOrderResponse] = useState<ProductOrderResponse | null>(null);
  const [invoiceHtml, setInvoiceHtml] = useState<string | null>(null);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);
  const [showFullInvoiceModal, setShowFullInvoiceModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Saved order copy details for success screen
  const [completedOrderDetails, setCompletedOrderDetails] = useState<{
    name: string;
    phone: string;
    address: string;
    payment_method: string;
    delivery_location: string;
    total_amount: number;
    sub_total: number;
    delivery_fee: number;
    discount_amount: number;
    products_count: number;
  } | null>(null);

  // Load Payment Gateways from API
  useEffect(() => {
    async function loadGateways() {
      setIsLoadingPaymentMethods(true);
      const methods = await getPaymentGateways();
      setPaymentMethods(methods);
      if (methods.length > 0) {
        setSelectedPaymentMethod(methods[0].slug || 'cash');
      }
      setIsLoadingPaymentMethods(false);
    }
    loadGateways();
  }, []);

  // Delivery Fee calculation
  const deliveryFee = deliveryLocation === 'inside_dhaka' ? 70 : 130;

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = Math.round((cartSubTotal * appliedCoupon.value) / 100);
    } else {
      discountAmount = Math.min(appliedCoupon.value, cartSubTotal);
    }
  }

  // Final Total calculation
  const totalAmount = Math.max(0, cartSubTotal + deliveryFee - discountAmount);

  // Add sample products if cart is empty
  const handleLoadSampleCart = () => {
    clearCart();
    SAMPLE_CART_PRODUCTS.forEach((prod) => {
      addToCart(prod, 1);
    });
  };

  // Apply Coupon Handler
  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const cleanInput = couponCodeInput.trim().toUpperCase();
    if (!cleanInput) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const matchedCoupon = AVAILABLE_COUPONS.find((c) => c.code === cleanInput);

    if (matchedCoupon) {
      setAppliedCoupon(matchedCoupon);
      setCouponSuccess(`Coupon "${matchedCoupon.code}" applied successfully! (${matchedCoupon.description})`);
      setCouponCodeInput('');
    } else {
      setCouponError(`Invalid promo code "${cleanInput}". Try KARBAR10 or SAVE100.`);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  // Order Submission Handler
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (cart.length === 0) {
      setFormError('Your cart is empty. Please add products before placing an order.');
      return;
    }

    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    if (!phone.trim()) {
      setFormError('Please enter your contact phone number.');
      return;
    }

    if (!address.trim()) {
      setFormError('Please enter your full delivery address.');
      return;
    }

    if (createAccount) {
      if (!password || password.length < 6) {
        setFormError('Please enter a password with at least 6 characters for your new account.');
        return;
      }
      if (password !== confirmPassword) {
        setFormError('Account passwords do not match. Please enter matching passwords.');
        return;
      }
    }

    // Format products according to exact payload specification
    const productsPayload = cart.map((item) => {
      const price = item.product.sale_price || item.product.unit_price;
      return {
        product_name: item.product.name,
        product_id: item.product.id,
        quantity: item.quantity,
        price: price,
        product_variant_id: item.selectedVariantId || null,
        total: price * item.quantity,
      };
    });

    const payload: ProductOrderPayload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      spacial_instruction: spacialInstruction.trim(),
      payment_method: selectedPaymentMethod,
      products: productsPayload,
      delivery_fee: deliveryFee,
      total_quantity: totalCount,
      total_amount: totalAmount,
      delivery_location: deliveryLocation,
      currency: 'bdt',
      discount_amount: discountAmount,
      sub_total: cartSubTotal,
      create_account: createAccount,
      password: createAccount ? password : undefined,
    };

    setIsSubmitting(true);

    try {
      const res = await placeProductOrder(payload);
      if (res.error) {
        setFormError(res.error);
      } else {
        setOrderResponse(res);

        // Store completed details for receipt display
        setCompletedOrderDetails({
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          payment_method: selectedPaymentMethod,
          delivery_location: deliveryLocation,
          total_amount: totalAmount,
          sub_total: cartSubTotal,
          delivery_fee: deliveryFee,
          discount_amount: discountAmount,
          products_count: totalCount,
        });

        clearCart();

        // Fetch invoice from API
        const orderNum = res.order_number || 15039357;
        setIsLoadingInvoice(true);
        const invoiceData = await getOrderInvoice(orderNum);
        setInvoiceHtml(invoiceData);
        setIsLoadingInvoice(false);
      }
    } catch (err: any) {
      setFormError(err.message || 'An unexpected error occurred while placing order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Print Invoice Handler
  const handlePrintInvoice = () => {
    if (!invoiceHtml) {
      alert('Invoice HTML is loading or unavailable. Please wait a moment.');
      return;
    }

    const printWin = window.open('', '_blank', 'width=800,height=900');
    if (!printWin) {
      alert('Popup blocker is blocking print window. Please allow popups.');
      return;
    }

    printWin.document.open();
    printWin.document.write(invoiceHtml);
    printWin.document.close();
    printWin.focus();

    setTimeout(() => {
      printWin.print();
    }, 400);
  };

  // Download Invoice HTML file
  const handleDownloadInvoice = () => {
    if (!invoiceHtml) {
      alert('Invoice HTML is loading or unavailable.');
      return;
    }

    const orderNum = orderResponse?.order_number || '15039357';
    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-#${orderNum}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy Order Number to Clipboard
  const handleCopyOrderNumber = () => {
    const num = String(orderResponse?.order_number || '15039357');
    navigator.clipboard.writeText(num);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/80 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/products"
              className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 mb-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Store
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Checkout & Order Confirmation
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Complete your contact details, select delivery location & payment method.
            </p>
          </div>

          {/* Badge */}
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full border border-blue-100 text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>100% Encrypted & Secure Checkout</span>
          </div>
        </div>

        {/* ORDER SUCCESS SCREEN WITH INVOICE PREVIEW & DOWNLOAD OPTIONS */}
        {orderResponse ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Top Success Banner Card */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
                <CheckCircle2 className="w-96 h-96" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-emerald-100 border border-white/20">
                    <Sparkles className="w-3.5 h-3.5" /> Order Placed Successfully
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                    Thank You for Your Order!
                  </h2>
                  <p className="text-emerald-100 text-xs sm:text-sm max-w-xl leading-relaxed">
                    Your order has been recorded. You can view, print, or download your official POS invoice below.
                  </p>
                </div>

                {/* Order Number & Quick Print Actions */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center sm:items-end justify-center shrink-0 space-y-2">
                  <span className="text-xs text-emerald-100 font-semibold uppercase tracking-wider">
                    Invoice Order No.
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl font-black font-mono tracking-wider">
                      #{orderResponse.order_number || '15039357'}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyOrderNumber}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition text-white"
                      title="Copy Order Number"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  {isCopied && <span className="text-[10px] text-emerald-200 font-bold">Copied to clipboard!</span>}
                </div>
              </div>
            </div>

            {/* INVOICE ACTION TOOLBAR */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">Official Order Invoice</h3>
                  <p className="text-xs text-slate-500">
                    Download, print, or view your official receipt
                  </p>
                </div>
              </div>

              {/* Action Buttons: Print, Download, Preview */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                
                {/* Print Button */}
                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  disabled={isLoadingInvoice || !invoiceHtml}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Printer className="w-4 h-4 text-blue-400" />
                  <span>Print Invoice</span>
                </button>

                {/* Download Button */}
                <button
                  type="button"
                  onClick={handleDownloadInvoice}
                  disabled={isLoadingInvoice || !invoiceHtml}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Invoice</span>
                </button>

                {/* Preview Fullscreen Modal Button */}
                <button
                  type="button"
                  onClick={() => setShowFullInvoiceModal(true)}
                  disabled={isLoadingInvoice || !invoiceHtml}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Full Modal</span>
                </button>

              </div>
            </div>

            {/* ORDER SUMMARY & LIVE INVOICE DUAL GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT: Customer & Order Recap Card (5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
                <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" /> Recipient & Delivery Summary
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Customer Name</span>
                    <span className="font-bold text-slate-900">{completedOrderDetails?.name || name || 'ad'}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Phone Number</span>
                    <span className="font-bold text-slate-900 font-mono">{completedOrderDetails?.phone || phone || '17723432431'}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Delivery Address</span>
                    <span className="font-bold text-slate-900 text-right max-w-xs">{completedOrderDetails?.address || address || 'sdf'}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Delivery Zone</span>
                    <span className="font-bold text-slate-900 capitalize">
                      {(completedOrderDetails?.delivery_location || deliveryLocation).replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Payment Gateway</span>
                    <span className="font-bold text-slate-900 uppercase">
                      {completedOrderDetails?.payment_method || selectedPaymentMethod}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-bold text-slate-900">TK {(completedOrderDetails?.sub_total || 12199).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Delivery Fee</span>
                    <span className="font-bold text-slate-900">TK {(completedOrderDetails?.delivery_fee || 70).toLocaleString()}</span>
                  </div>

                  {Boolean(completedOrderDetails?.discount_amount) && (
                    <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-600 font-semibold">
                      <span>Discount Coupon</span>
                      <span>- TK {completedOrderDetails?.discount_amount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between py-2 pt-3 text-sm font-black text-slate-900">
                    <span>Total Amount Paid</span>
                    <span className="text-lg text-emerald-600">
                      TK {(completedOrderDetails?.total_amount || 12269).toLocaleString()} BDT
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                  <Link
                    href="/"
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs text-center transition shadow-md"
                  >
                    Return to Homepage
                  </Link>
                  <Link
                    href="/products"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs text-center transition shadow-md shadow-blue-500/20"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* RIGHT: Live Printable Invoice Preview Card (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Printer className="w-4 h-4 text-emerald-600" /> Live Receipt Preview
                  </h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handlePrintInvoice}
                      disabled={isLoadingInvoice || !invoiceHtml}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadInvoice}
                      disabled={isLoadingInvoice || !invoiceHtml}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold rounded-lg border border-emerald-200 transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                </div>

                {isLoadingInvoice ? (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3 bg-slate-50 rounded-xl">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <p className="text-xs font-semibold">Loading official receipt from POS API...</p>
                  </div>
                ) : invoiceHtml ? (
                  <div className="bg-slate-100 p-4 rounded-xl overflow-hidden border border-slate-200">
                    <iframe
                      srcDoc={invoiceHtml}
                      title="Invoice Preview"
                      className="w-full h-[520px] bg-white rounded-lg border border-slate-200 shadow-inner"
                    />
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 text-xs bg-slate-50 rounded-xl">
                    Unable to load live invoice HTML from server. Click Print or Download to test response.
                  </div>
                )}
              </div>

            </div>

            {/* FULLSCREEN INVOICE MODAL */}
            {showFullInvoiceModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
                  
                  {/* Modal Header */}
                  <div className="p-4 px-6 bg-slate-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileCheck className="w-5 h-5 text-emerald-400" />
                      <div>
                        <h3 className="font-bold text-sm">Invoice #{orderResponse.order_number || '15039357'}</h3>
                        <p className="text-[10px] text-slate-400">Official Karbar POS Sales Receipt</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrintInvoice}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadInvoice}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowFullInvoiceModal(false)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Modal Body with Rendered Invoice */}
                  <div className="flex-1 bg-slate-100 p-4 sm:p-6 overflow-hidden">
                    {invoiceHtml ? (
                      <iframe
                        srcDoc={invoiceHtml}
                        title="Invoice Full View"
                        className="w-full h-full bg-white rounded-2xl shadow-lg border border-slate-200"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                        Loading invoice preview...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          /* MAIN CHECKOUT FORM GRID */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Customer Info, Shipping & Payment (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* FORM ERROR BANNER */}
              {formError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-start gap-3 text-xs sm:text-sm animate-shake">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
                  <div>
                    <span className="font-bold">Error placing order:</span> {formError}
                  </div>
                </div>
              )}

              {/* STEP 1: BILLING & SHIPPING DETAILS */}
              <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Shipping & Customer Information</h2>
                    <p className="text-xs text-slate-500">Provide recipient details for fast delivery</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Full Name */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter full recipient name"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-hidden rounded-xl px-4 py-2.5 text-sm text-slate-800 transition"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01712345678"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-hidden rounded-xl px-4 py-2.5 text-sm text-slate-800 transition"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-hidden rounded-xl px-4 py-2.5 text-sm text-slate-800 transition"
                    />
                  </div>

                  {/* Delivery Location Selector */}
                  <div className="sm:col-span-2 space-y-2 pt-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-blue-600" />
                      Delivery Zone & Shipping Rate <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      
                      <button
                        type="button"
                        onClick={() => setDeliveryLocation('inside_dhaka')}
                        className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                          deliveryLocation === 'inside_dhaka'
                            ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            deliveryLocation === 'inside_dhaka' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                          }`}>
                            {deliveryLocation === 'inside_dhaka' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">Inside Dhaka</div>
                            <div className="text-[11px] text-slate-500">Standard Delivery (1-2 Days)</div>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-blue-600">TK 70</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryLocation('outside_dhaka')}
                        className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                          deliveryLocation === 'outside_dhaka'
                            ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            deliveryLocation === 'outside_dhaka' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                          }`}>
                            {deliveryLocation === 'outside_dhaka' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">Outside Dhaka</div>
                            <div className="text-[11px] text-slate-500">Courier Delivery (2-4 Days)</div>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-blue-600">TK 130</span>
                      </button>

                    </div>
                  </div>

                  {/* Full Address */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      Full Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House/Holding #, Road #, Area, City"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-hidden rounded-xl px-4 py-2.5 text-sm text-slate-800 transition"
                    />
                  </div>

                  {/* Special Instructions */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      Special Instruction / Order Note <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={spacialInstruction}
                      onChange={(e) => setSpacialInstruction(e.target.value)}
                      placeholder="E.g. Please deliver after 5 PM, or leave with security"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-hidden rounded-xl px-4 py-2.5 text-sm text-slate-800 transition"
                    />
                  </div>

                  {/* Create Account Checkbox */}
                  <div className="sm:col-span-2 pt-1">
                    <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={createAccount}
                        onChange={(e) => setCreateAccount(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-semibold text-slate-800">Create an account for faster checkout next time</span>
                    </label>

                    {/* Dynamic Password Setting Block */}
                    {createAccount && (
                      <div className="mt-3 p-4 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                          <Lock className="w-4 h-4 text-blue-600" />
                          <span>Set Password for Your New Account</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                              <span>Account Password <span className="text-red-500">*</span></span>
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                required={createAccount}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min 6 characters"
                                className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:outline-hidden rounded-xl px-3.5 py-2 text-xs text-slate-800 transition pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                title={showPassword ? 'Hide password' : 'Show password'}
                              >
                                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700">
                              Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required={createAccount}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Re-enter password"
                              className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:outline-hidden rounded-xl px-3.5 py-2 text-xs text-slate-800 transition"
                            />
                          </div>
                        </div>

                        <p className="text-[11px] text-blue-700 font-medium">
                          🔑 Your password will be registered with your account so you can log in easily next time.
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* STEP 2: PAYMENT METHOD (DYNAMIC FROM API) */}
              <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Payment Gateway Selection</h2>
                      <p className="text-xs text-slate-500">Select your preferred payment method</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Live API
                  </span>
                </div>

                {isLoadingPaymentMethods ? (
                  <div className="py-8 flex flex-col items-center justify-center text-slate-400 space-y-3">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <p className="text-xs font-medium">Fetching payment options from gateway API...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {paymentMethods.map((method) => {
                      const isSelected = selectedPaymentMethod === method.slug;
                      return (
                        <button
                          key={method.id || method.slug}
                          type="button"
                          onClick={() => setSelectedPaymentMethod(method.slug)}
                          className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer relative ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className={`w-4 h-4 mt-1 rounded-full border shrink-0 flex items-center justify-center ${
                            isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {method.image && (
                                <img
                                  src={method.image}
                                  alt={method.name}
                                  className="w-6 h-6 object-contain rounded-md border border-slate-100 bg-white"
                                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                />
                              )}
                              <h3 className="font-bold text-sm text-slate-900 truncate">{method.name}</h3>
                            </div>
                            {method.description && (
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{method.description}</p>
                            )}
                            {method.country_code && (
                              <span className="inline-block text-[10px] font-bold text-slate-400 uppercase mt-1">
                                Country: {method.country_code}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: Order Summary, Coupon & Checkout Action (5 cols) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              
              <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                    <h2 className="text-base font-bold text-slate-900">Order Summary ({totalCount})</h2>
                  </div>
                  {cart.length > 0 && (
                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-xs text-slate-400 hover:text-red-500 transition"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* CART ITEMS LIST */}
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <div className="py-8 text-center space-y-3 bg-slate-50 rounded-xl p-4 border border-dashed border-slate-200">
                      <p className="text-xs font-semibold text-slate-500">Your shopping cart is currently empty.</p>
                      <button
                        type="button"
                        onClick={handleLoadSampleCart}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20 inline-flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Add Sample Products to Cart
                      </button>
                    </div>
                  ) : (
                    cart.map(({ product, quantity }) => {
                      const price = product.sale_price || product.unit_price;
                      const itemTotal = price * quantity;
                      const imageSrc = product.preview_image || product.image_url || product.image || '/placeholder.png';

                      return (
                        <div key={product.id} className="flex gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 items-center">
                          <div className="w-14 h-14 bg-white rounded-lg overflow-hidden shrink-0 border border-slate-200 relative">
                            <img
                              src={imageSrc}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-xs text-slate-800 truncate">{product.name}</h4>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              TK {price.toLocaleString()} × {quantity}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <button
                                type="button"
                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                className="w-5 h-5 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold px-1 text-slate-800">{quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                className="w-5 h-5 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-bold text-slate-900">TK {itemTotal.toLocaleString()}</div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(product.id)}
                              className="text-slate-400 hover:text-red-500 mt-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Sample Cart Banner Quick Trigger if cart has items */}
                {cart.length > 0 && (
                  <div className="flex justify-between items-center text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <span>Want to test with prompt payload items?</span>
                    <button
                      type="button"
                      onClick={handleLoadSampleCart}
                      className="font-bold text-blue-600 hover:underline"
                    >
                      Load Sample Cart
                    </button>
                  </div>
                )}

                {/* STEP 3: COUPON / DISCOUNT SECTION */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-slate-800">Apply Discount Coupon</span>
                  </div>

                  {appliedCoupon ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span className="font-bold text-emerald-800 uppercase">{appliedCoupon.code}</span>
                          <p className="text-[10px] text-emerald-600">{appliedCoupon.description}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-xs text-red-500 hover:underline font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        placeholder="Promo Code (e.g. KARBAR10)"
                        className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-hidden rounded-xl px-3 py-2 text-xs uppercase font-semibold text-slate-800 transition"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shrink-0"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {couponError && (
                    <p className="text-[11px] font-medium text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {couponError}
                    </p>
                  )}
                  {couponSuccess && !appliedCoupon && (
                    <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> {couponSuccess}
                    </p>
                  )}

                  {/* Quick Preset Coupons */}
                  <div className="pt-1">
                    <span className="text-[10px] text-slate-400 font-medium">Available Promos: </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {AVAILABLE_COUPONS.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setCouponCodeInput(c.code);
                            setAppliedCoupon(c);
                            setCouponSuccess(`Applied ${c.code}`);
                          }}
                          className="text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200/80 transition"
                        >
                          {c.code}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* PRICE BREAKDOWN TABLE */}
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({totalCount} items)</span>
                    <span className="font-semibold text-slate-800">TK {cartSubTotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee ({deliveryLocation === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                    <span className="font-semibold text-slate-800">TK {deliveryFee.toLocaleString()}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount Coupon ({appliedCoupon?.code})</span>
                      <span>- TK {discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
                    <span>Total Amount</span>
                    <span className="text-xl text-blue-600">
                      TK {totalAmount.toLocaleString()} <span className="text-xs font-normal text-slate-500 uppercase">BDT</span>
                    </span>
                  </div>
                </div>

                {/* PLACE ORDER SUBMIT BUTTON */}
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Placing Order & Fetching Invoice...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Confirm & Place Order (TK {totalAmount.toLocaleString()})</span>
                    </>
                  )}
                </button>

                <div className="text-center text-[11px] text-slate-400 space-y-1">
                  <p>🔒 By clicking Place Order, your order is securely created.</p>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
