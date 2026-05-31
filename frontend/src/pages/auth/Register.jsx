import React from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Check, Zap } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { register as registerMember } from "../../store/slices/authSlice";
import { authText } from "../../utils/authMessages";

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { loading, error } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedPlan = searchParams.get("plan") || "monthly";
  const plan = plans[selectedPlan] || plans.monthly;
  const submit = async (data) => {
    try {
      await dispatch(registerMember({ ...data, plan: selectedPlan, password_confirmation: data.password })).unwrap();
      toast.success("Account created successfully.");
      if (searchParams.get("plan")) {
        localStorage.setItem("fitmanager_pending_plan", selectedPlan);
        navigate("/member/subscription");
        return;
      }
      navigate("/");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Registration failed. Check the form and try again.");
    }
  };

  return (
    <main className="page-enter grid min-h-screen bg-black lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative order-2 min-h-72 overflow-hidden lg:order-1 lg:block lg:min-h-screen">
        <img className="absolute inset-0 h-full w-full object-cover opacity-70" src="https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1500&q=90" alt="Member register" />
        <div className="absolute inset-0 bg-gradient-to-l from-black via-black/60 to-transparent" />
      </section>
      <section className="order-1 grid min-h-screen place-items-center px-5 py-10 sm:py-12 lg:order-2 lg:min-h-screen lg:py-14">
        <form className="my-auto w-full max-w-lg rounded-lg border border-white/10 bg-white p-6 shadow-2xl sm:p-8" onSubmit={handleSubmit(submit)}>
          <Link className="mb-8 flex items-center gap-3" to="/">
            <div className="grid h-11 w-11 place-items-center rounded bg-primary text-white"><Zap className="h-5 w-5 fill-white text-white" /></div>
            <div><p className="font-black">FitManager</p><p className="text-xs font-bold text-muted">Member access</p></div>
          </Link>
          <p className="section-kicker">Join the club</p>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-tight">Create member account</h1>
          <p className="mt-2 text-sm leading-6 text-muted">Join the club portal and track your subscription, payments, and attendance.</p>
          {searchParams.get("plan") && <div className="mt-6 rounded border border-orange-100 bg-orange-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Selected plan</p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-lg font-black text-slate-950">{plan.name}</p>
                <p className="text-sm font-bold text-muted">{plan.price} / month</p>
              </div>
              <Check className="h-5 w-5 text-primary" />
            </div>
            <Link className="mt-3 inline-block text-xs font-black text-primary" to="/#plans">Change plan</Link>
          </div>}
          <div className="mt-7 grid gap-4">
            <Input label="Name" {...register("name", { required: authText("nameRequired") })} />
            <Input label="Email" type="email" {...register("email", { required: authText("emailRequired") })} />
            <Input label="Phone" {...register("phone")} />
            <Input label="Password" type="password" {...register("password", { required: authText("passwordRequired"), minLength: { value: 8, message: authText("passwordMin") } })} />
          </div>
          {(errors.name || errors.email || errors.password) && (
            <div className="mt-4 rounded border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-800">
              {errors.name?.message || errors.email?.message || errors.password?.message}
            </div>
          )}
          {error && <p className="mt-4 rounded border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
          <Button className="mt-7 w-full" disabled={loading}>{loading ? "Creating account..." : "Create account"}</Button>
          <p className="mt-6 text-center text-sm text-muted">Already registered? <Link className="font-black text-primary" to="/login">Sign in</Link></p>
        </form>
      </section>
    </main>
  );
}

const plans = {
  monthly: { name: "Monthly", price: "MAD 49" },
  quarterly: { name: "Quarterly", price: "MAD 129" },
  yearly: { name: "Yearly", price: "MAD 449" },
};
