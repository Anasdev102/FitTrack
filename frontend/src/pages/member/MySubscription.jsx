import React from 'react';
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Check, Clock, ShieldCheck } from "lucide-react";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import ConfirmModal from "../../components/common/ConfirmModal";
import { memberApi } from "../../api/memberApi";
import { formatCurrency } from "../../utils/formatCurrency";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

export default function MySubscription() {
  const [searchParams] = useSearchParams();
  const [plans, setPlans] = useState({});
  const [subscription, setSubscription] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(searchParams.get("plan") || "");
  const [pendingPlanRequest, setPendingPlanRequest] = useState(null);
  const activePlan = useMemo(() => plans[selectedPlan], [plans, selectedPlan]);

  useEffect(() => {
    memberApi.plans().then((response) => setPlans(response.data.data || {}));
    refreshSubscription();
  }, []);

  const refreshSubscription = () => {
    memberApi.subscriptions().then((response) => {
      const subscriptions = response.data.data || [];
      setHistory(subscriptions);
      setSubscription(subscriptions[0] || null);
    });
  };

  const requestSubscription = async (planKey) => {
    if (subscription?.status === "active") {
      setPendingPlanRequest(planKey);
      return;
    }

    await submitSubscriptionRequest(planKey);
  };

  const submitSubscriptionRequest = async (planKey) => {
    try {
      setLoading(true);
      const response = await memberApi.subscribe({ type: planKey });
      localStorage.removeItem("fitmanager_pending_plan");
      toast.success(response.data.message || "Your subscription request has been created. Please visit the gym reception and pay in cash to activate your membership.");
      setSelectedPlan(planKey);
      refreshSubscription();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const continuePendingRequest = async () => {
    const planKey = pendingPlanRequest;
    setPendingPlanRequest(null);
    if (planKey) await submitSubscriptionRequest(planKey);
  };

  return (
    <div className="page-enter grid gap-7">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="section-kicker">Subscription request</p>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-tight">My Subscription</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">Choose a plan and send a request. Payment is cash only at the gym reception; admin activates your subscription after payment confirmation.</p>
        </div>
      </div>

      <SubscriptionStatus subscription={subscription} />

      <div className="grid gap-5 md:grid-cols-3">
        {Object.entries(plans).map(([key, plan]) => (
          <div className={`panel p-7 ${selectedPlan === key ? "ring-4 ring-primary/10" : ""}`} key={key}>
            <p className="section-kicker">{plan.name}</p>
            <p className="mt-5 text-4xl font-black">{formatCurrency(plan.price)}<span className="text-sm font-bold text-muted"> /plan</span></p>
            <p className="mt-2 text-sm font-bold text-muted">{plan.duration_months} month{plan.duration_months > 1 ? "s" : ""}</p>
            <div className="mt-6 grid gap-3 text-sm">
              {plan.features.map((feature) => <p className="flex items-center gap-2" key={feature}><Check className="h-4 w-4 text-primary" />{feature}</p>)}
            </div>
            <Button className="mt-7 w-full" disabled={loading || subscription?.status === "pending"} onClick={() => requestSubscription(key)}>
              {subscription?.status === "pending" ? "Request pending" : "Subscribe"}
            </Button>
          </div>
        ))}
      </div>

      {activePlan && <div className="rounded border border-orange-100 bg-orange-50 p-5 text-sm font-bold text-orange-800">Selected plan: {activePlan.name}</div>}

      <div className="panel p-7">
        <h2 className="text-lg font-black">Subscription history</h2>
        <div className="mt-5 grid gap-3">
          {history.length ? history.map((item) => (
            <div className="flex flex-col justify-between gap-3 rounded border border-line p-4 md:flex-row md:items-center" key={item.id}>
              <div>
                <p className="font-black capitalize">{item.type}</p>
                <p className="mt-1 text-xs font-bold text-muted">{item.start_date || "Not active yet"} - {item.end_date || "Pending admin approval"}</p>
              </div>
              <div className="flex gap-2">
                <Badge tone={statusTone(item.status)}>{item.status}</Badge>
                <Badge tone={item.payment_status === "paid" ? "green" : "orange"}>{item.payment_status}</Badge>
              </div>
            </div>
          )) : <p className="text-sm font-semibold text-muted">No subscription requests yet.</p>}
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(pendingPlanRequest)}
        title="Active subscription detected"
        message="You already have an active subscription. If you continue, your new request will stay pending until you pay cash at the gym and admin approves it."
        cancelText="Cancel"
        confirmText="Continue request"
        variant="warning"
        onCancel={() => setPendingPlanRequest(null)}
        onConfirm={continuePendingRequest}
      />
    </div>
  );
}

function SubscriptionStatus({ subscription }) {
  if (!subscription) {
    return (
      <div className="rounded border border-amber-100 bg-amber-50 p-8">
        <h2 className="text-2xl font-black">No subscription yet</h2>
        <p className="mt-2 text-sm leading-7 text-muted">Choose a plan below and send your request to the admin.</p>
      </div>
    );
  }

  if (subscription.status === "pending") {
    return (
      <div className="rounded border border-amber-100 bg-amber-50 p-8">
        <div className="flex items-center gap-3"><Clock className="h-6 w-6 text-amber-600" /><h2 className="text-2xl font-black">Your subscription is pending approval</h2></div>
        <p className="mt-2 text-sm leading-7 text-muted">{subscription.payment_status === "paid" ? "Cash payment confirmed. Ready to activate." : `Please pay in cash at the gym reception before ${formatDeadline(subscription.payment_deadline)}.`}</p>
      </div>
    );
  }

  if (subscription.status === "active") {
    return (
      <div className="rounded border border-green-100 bg-green-50 p-8">
        <div className="flex items-center gap-3"><ShieldCheck className="h-6 w-6 text-green-600" /><h2 className="text-2xl font-black">Your subscription is active until {subscription.end_date}</h2></div>
        <p className="mt-2 text-sm leading-7 text-muted">Subscription active until {subscription.end_date}. {subscription.remaining_days} day{subscription.remaining_days === 1 ? "" : "s"} remaining.</p>
      </div>
    );
  }

  return (
    <div className="rounded border border-red-100 bg-red-50 p-8">
      <h2 className="text-2xl font-black">{subscription.status === "expired" ? "Your subscription has expired" : subscription.status === "cancelled" ? "Your subscription request was cancelled because payment was not received within 48 hours." : "Your subscription request was rejected"}</h2>
      <p className="mt-2 text-sm leading-7 text-muted">Choose another plan below or contact the gym admin.</p>
    </div>
  );
}

function statusTone(status) {
  if (status === "active") return "green";
  if (status === "pending") return "orange";
  if (status === "rejected" || status === "cancelled") return "red";
  return "orange";
}

function formatDeadline(value) {
  if (!value) return "the payment deadline";
  return new Date(value).toLocaleString();
}
