import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Bot, Copy, Mail, MessageCircle, Search, Sparkles } from 'lucide-react';
import Button from '../../components/common/Button';
import { subscriptionsApi } from '../../api/subscriptionsApi';
import { generateReminder } from '../../store/slices/aiSlice';
import { fetchMembers } from '../../store/slices/membersSlice';

const reminderTypes = [
  { value: 'pending_payment', label: 'Pending cash payment' },
  { value: 'expiring_soon', label: 'Expiring soon' },
  { value: 'expired', label: 'Expired subscription' },
  { value: 'renewal', label: 'Renewal reminder' },
  { value: 'rejected', label: 'Rejected request' },
  { value: 'cancelled', label: 'Cancelled request' },
];

export default function AiReminder() {
  const dispatch = useDispatch();
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      member_id: '',
      phone: '',
      reminder_type: 'pending_payment',
      language: 'fr',
      plan_name: '',
      amount: '',
      payment_deadline: '',
      end_date: '',
    },
  });
  const { generatedMessage, message, loading, error } = useSelector((state) => state.ai);
  const { items: members, loading: membersLoading } = useSelector((state) => state.members);
  const selectedMemberId = watch('member_id');
  const watchedPhone = watch('phone');
  const selectedReminderType = watch('reminder_type');
  const selectedMember = members.find((member) => String(member.id) === String(selectedMemberId));
  const output = generatedMessage || message;
  const formattedPhone = formatMoroccoPhone(watchedPhone || selectedMember?.phone || '');
  const emailHref = selectedMember?.email && output
    ? `mailto:${selectedMember.email}?subject=${encodeURIComponent('FitManager Reminder')}&body=${encodeURIComponent(output)}`
    : '';
  const whatsappHref = formattedPhone && output
    ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(output)}`
    : '';
  const [memberSearch, setMemberSearch] = useState('');
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const memberResults = useMemo(() => members.filter((member) => {
    const value = `${member.name || ''} ${member.email || ''} ${member.phone || ''}`.toLowerCase();
    return !memberSearch || value.includes(memberSearch.toLowerCase());
  }).slice(0, 8), [members, memberSearch]);

  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedMember) {
      setSelectedSubscription(null);
      return;
    }

    setValue('phone', selectedMember.phone || '');
    setSelectedSubscription(null);
    setSubscriptionLoading(true);

    subscriptionsApi.list({ search: selectedMember.name })
      .then((response) => {
        const subscriptions = response.data.data || [];
        const subscription = subscriptions.find((item) => String(item.user_id) === String(selectedMember.id))
          || selectedMember.active_subscription
          || subscriptions[0];

        if (!subscription) return;

        setSelectedSubscription(subscription);
        setValue('plan_name', subscription.plan_name || subscription.type || '');
        setValue('amount', subscription.price || '');
        setValue('payment_deadline', toDateTimeInput(subscription.payment_deadline));
        setValue('end_date', toDateInput(subscription.end_date));
        setValue('reminder_type', firstValidReminderType(subscription));
      })
      .catch(() => {
        const active = selectedMember.active_subscription;
        if (active) {
          setSelectedSubscription(active);
          setValue('plan_name', active.plan_name || active.type || '');
          setValue('amount', active.price || '');
          setValue('end_date', toDateInput(active.end_date));
          setValue('reminder_type', firstValidReminderType(active));
        }
      })
      .finally(() => setSubscriptionLoading(false));
  }, [selectedMember, setValue]);

  const validReminderTypes = useMemo(() => validReminderTypesForSubscription(selectedSubscription), [selectedSubscription]);
  const invalidTypeMessage = selectedSubscription && selectedReminderType === 'pending_payment' && !validReminderTypes.includes('pending_payment')
    ? 'This member does not have a pending cash payment request.'
    : '';

  useEffect(() => {
    if (!selectedSubscription || validReminderTypes.includes(selectedReminderType)) return;
    setValue('reminder_type', validReminderTypes[0] || 'renewal');
  }, [selectedReminderType, selectedSubscription, setValue, validReminderTypes]);

  const submit = (data) => {
    if (!selectedMember) {
      toast.error('Choose a member first.');
      return;
    }

    if (!validReminderTypes.includes(data.reminder_type)) {
      toast.error('This member does not have a pending cash payment request.');
      return;
    }

    dispatch(generateReminder({
      member_name: selectedMember.name,
      phone: data.phone || selectedMember.phone,
      reminder_type: data.reminder_type,
      language: data.language,
      plan_name: data.plan_name || undefined,
      amount: data.amount || undefined,
      payment_deadline: data.payment_deadline || undefined,
      end_date: data.end_date || undefined,
      subscription_status: selectedSubscription?.status,
      payment_status: selectedSubscription?.payment_status,
    }));
  };

  const copyMessage = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success('Message copied successfully');
  };

  const openWhatsApp = () => {
    if (!output) return;
    if (!formattedPhone) {
      toast.error('Phone number is missing.');
      return;
    }

    window.open(whatsappHref, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="page-enter grid gap-7">
      <div>
        <p className="section-kicker">Retention assistant</p>
        <h1 className="mt-2 text-3xl font-black uppercase tracking-tight">AI Reminder</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">Generate professional reminder messages, then copy them or open WhatsApp/email so the admin can review and send.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <form className="panel grid content-start gap-5 p-7" onSubmit={handleSubmit(submit)}>
          <div className="grid h-14 w-14 place-items-center rounded bg-dark text-white">
            <Bot className="h-6 w-6 text-primary" />
          </div>

          <label className="grid gap-2 text-xs font-bold text-slate-700">
            Select member
            <div className="flex items-center gap-3 rounded border border-line bg-white px-3.5 py-3 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none"
                disabled={membersLoading}
                placeholder={membersLoading ? 'Loading members...' : 'Type member name, email, or phone'}
                type="search"
                value={memberSearch}
                onChange={(event) => {
                  setMemberSearch(event.target.value);
                  setValue('member_id', '');
                }}
              />
            </div>
          </label>

          <input type="hidden" {...register('member_id', { required: true })} />

          <div className="max-h-56 overflow-y-auto rounded border border-line bg-slate-50 p-2">
            {memberResults.length ? memberResults.map((member) => (
              <button
                className={`flex w-full items-center justify-between gap-3 rounded px-3 py-3 text-left transition hover:bg-white hover:shadow-sm ${String(selectedMemberId) === String(member.id) ? 'bg-white ring-2 ring-primary/20' : ''}`}
                key={member.id}
                type="button"
                onClick={() => {
                  setValue('member_id', member.id);
                  setMemberSearch(member.name || '');
                }}
              >
                <span>
                  <span className="block text-sm font-black text-slate-900">{member.name}</span>
                  <span className="mt-0.5 block text-xs font-semibold text-slate-500">{member.email || member.phone || 'Member'}</span>
                </span>
                <span className="rounded bg-white px-3 py-1 text-xs font-black uppercase text-primary">Select</span>
              </button>
            )) : (
              <p className="px-3 py-4 text-sm font-semibold text-slate-500">No members found.</p>
            )}
          </div>

          {subscriptionLoading && <p className="text-xs font-bold text-primary">Loading subscription details...</p>}
          {selectedSubscription && (
            <div className="rounded border border-line bg-slate-50 p-3 text-xs font-bold text-slate-600">
              Subscription status: <span className="uppercase text-primary">{selectedSubscription.status}</span>
              <span className="mx-2 text-slate-300">|</span>
              Payment: <span className="uppercase text-primary">{selectedSubscription.payment_status || 'unpaid'}</span>
            </div>
          )}
          {invalidTypeMessage && (
            <p className="rounded border border-amber-100 bg-amber-50 p-3 text-sm font-bold text-amber-800">
              {invalidTypeMessage}
            </p>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-xs font-bold text-slate-700">
              Reminder type
              <select className="premium-input rounded px-3.5 py-3 text-sm" {...register('reminder_type')}>
                {reminderTypes.map((type) => (
                  <option key={type.value} value={type.value} disabled={!validReminderTypes.includes(type.value)}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-xs font-bold text-slate-700">
              Language
              <select className="premium-input rounded px-3.5 py-3 text-sm" {...register('language')}>
                <option value="fr">French</option>
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-xs font-bold text-slate-700">Phone<input className="premium-input rounded px-3.5 py-3 text-sm" {...register('phone')} /></label>
            <label className="grid gap-2 text-xs font-bold text-slate-700">Plan name<input className="premium-input rounded px-3.5 py-3 text-sm" {...register('plan_name')} /></label>
            <label className="grid gap-2 text-xs font-bold text-slate-700">Amount<input className="premium-input rounded px-3.5 py-3 text-sm" type="number" step="0.01" {...register('amount')} /></label>
            <label className="grid gap-2 text-xs font-bold text-slate-700">Payment deadline<input className="premium-input rounded px-3.5 py-3 text-sm" type="datetime-local" {...register('payment_deadline')} /></label>
            <label className="grid gap-2 text-xs font-bold text-slate-700 md:col-span-2">End date<input className="premium-input rounded px-3.5 py-3 text-sm" type="date" {...register('end_date')} /></label>
          </div>

          {error && <p className="rounded border border-red-100 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}

          <Button disabled={loading}>
            <Sparkles className="h-4 w-4" />
            {loading ? 'Generating...' : 'Generate reminder'}
          </Button>
        </form>

        <div className="panel p-7">
          <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="section-kicker">Generated text</p>
              <h2 className="mt-2 text-lg font-black">Manual copy message</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="ghost" onClick={copyMessage} disabled={!output}>
                <Copy className="h-4 w-4" />
                Copy Message
              </Button>
              <Button type="button" onClick={openWhatsApp} disabled={!output || !formattedPhone}>
                <MessageCircle className="h-4 w-4" />
                Send via WhatsApp
              </Button>
              {selectedMember?.email && (
                <a
                  className={`inline-flex items-center justify-center gap-2 rounded border border-black/10 bg-white px-4 py-2.5 text-sm font-black uppercase tracking-wide text-ink transition hover:-translate-y-0.5 hover:border-primary hover:text-primary ${!output ? 'pointer-events-none opacity-60' : ''}`}
                  href={emailHref || undefined}
                >
                  <Mail className="h-4 w-4" />
                  Send via Email
                </a>
              )}
            </div>
          </div>
          {!formattedPhone && (
            <p className="mb-4 rounded border border-amber-100 bg-amber-50 p-3 text-sm font-bold text-amber-800">
              Add a member phone number to open WhatsApp.
            </p>
          )}
          <textarea
            className="min-h-80 w-full resize-none rounded border border-line bg-slate-50 p-6 text-sm leading-8 text-slate-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
            readOnly
            value={output || 'Generated reminder will appear here.'}
          />
        </div>
      </div>
    </div>
  );
}

function firstValidReminderType(subscription) {
  return validReminderTypesForSubscription(subscription)[0] || 'renewal';
}

function validReminderTypesForSubscription(subscription) {
  if (!subscription) return reminderTypes.map((type) => type.value);

  if (subscription.status === 'pending' && subscription.payment_status === 'unpaid') {
    return ['pending_payment'];
  }

  if (subscription.status === 'active') {
    return ['expiring_soon', 'renewal'];
  }

  if (subscription.status === 'expired') {
    return ['expired', 'renewal'];
  }

  if (subscription.status === 'rejected') {
    return ['rejected'];
  }

  if (subscription.status === 'cancelled') {
    return ['cancelled'];
  }

  return ['renewal'];
}

function toDateInput(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

function toDateTimeInput(value) {
  if (!value) return '';
  return String(value).replace(' ', 'T').slice(0, 16);
}

function formatMoroccoPhone(phone) {
  let value = String(phone || '').replace(/[\s+\-().]/g, '');
  if (!value) return '';
  if (value.startsWith('00')) value = value.slice(2);
  if (value.startsWith('0')) value = `212${value.slice(1)}`;
  return value.startsWith('212') ? value : value;
}
