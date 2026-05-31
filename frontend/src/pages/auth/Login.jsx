import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { login } from "../../store/slices/authSlice";
import { authText } from "../../utils/authMessages";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: "", password: "" },
  });
  const { error } = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await dispatch(login(data)).unwrap();
      const pendingPlan = searchParams.get("plan");
      const redirect = searchParams.get("redirect");

      if (pendingPlan) {
        localStorage.setItem("fitmanager_pending_plan", pendingPlan);
      }

      if (result.user.role === "member" && redirect?.startsWith("/member")) {
        navigate(redirect);
        return;
      }

      navigate(result.user.role === "admin" ? "/admin" : result.user.role === "coach" ? "/coach/dashboard" : "/");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Login failed. Check your email and password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-enter grid min-h-screen bg-black lg:grid-cols-[0.92fr_1.08fr]">
      <section className="grid place-items-center px-5 py-12">
        <form className="w-full max-w-md rounded-lg border border-white/10 bg-white p-8 shadow-2xl" onSubmit={handleSubmit(submit)}>
          <Link className="mb-10 flex items-center gap-3" to="/">
            <div className="grid h-11 w-11 place-items-center rounded bg-primary text-white"><Zap className="h-5 w-5 fill-white text-white" /></div>
            <div><p className="font-black">FitManager</p><p className="text-xs font-bold text-muted">Private Club OS</p></div>
          </Link>
          <p className="section-kicker">Secure access</p>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-muted">Sign in to manage members, revenue, attendance, and renewal reminders.</p>
          <div className="mt-8 grid gap-4">
            <Input label="Email" type="email" {...register("email", { required: authText("emailRequired") })} />
            <Input label="Password" type="password" {...register("password", { required: authText("passwordRequired") })} />
          </div>
          {(errors.email || errors.password) && (
            <div className="mt-4 rounded border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-800">
              {errors.email?.message || errors.password?.message}
            </div>
          )}
          {error && <p className="mt-4 rounded border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
          <div className="mt-5 flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 font-bold text-muted"><input type="checkbox" />Remember this device</label>
            <a className="font-black text-primary">Reset password</a>
          </div>
          <Button className="mt-7 w-full" disabled={isSubmitting}>{isSubmitting ? "SIGNING IN..." : "SIGN IN"}<ArrowRight className="h-4 w-4" /></Button>
          <p className="mt-6 text-center text-sm text-muted">New member? <Link className="font-black text-primary" to={`/register${searchParams.toString() ? `?${searchParams.toString()}` : ""}`}>Create account</Link></p>
        </form>
      </section>
      <section className="relative hidden overflow-hidden lg:block">
        <img className="h-full w-full object-cover opacity-70" src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=1500&q=90" alt="Premium gym" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-transparent" />
        <div className="absolute bottom-12 left-12 max-w-xl text-white">
          <p className="section-kicker">Built for one club</p>
          <h2 className="mt-4 text-5xl font-black uppercase leading-tight tracking-tight">A polished control room for fitness operations.</h2>
        </div>
      </section>
    </main>
  );
}
