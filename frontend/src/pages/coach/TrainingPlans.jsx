import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import { createTrainingPlan, fetchTrainingPlans } from "../../store/slices/trainingPlansSlice";

export default function TrainingPlans({ memberId }) {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.trainingPlans);
  const { register, handleSubmit, reset } = useForm({ defaultValues: { status: "active" } });

  useEffect(() => { dispatch(fetchTrainingPlans(memberId)); }, [dispatch, memberId]);

  const submit = async (data) => {
    try {
      await dispatch(createTrainingPlan({ memberId, data })).unwrap();
      reset({ title: "", description: "", status: "active" });
      toast.success("Training plan created.");
    } catch (err) {
      toast.error(err || "Could not create training plan.");
    }
  };

  return (
    <div className="panel p-7">
      <h2 className="text-lg font-black">Training Plans</h2>
      <form className="mt-5 grid gap-3" onSubmit={handleSubmit(submit)}>
        <input className="premium-input rounded px-3.5 py-3 text-sm" placeholder="Plan title" {...register("title", { required: true })} />
        <textarea className="min-h-28 rounded border border-line px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15" placeholder="Plan details..." {...register("description", { required: true })} />
        <select className="premium-input rounded px-3.5 py-3 text-sm" {...register("status")}>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        <Button className="justify-self-start" disabled={loading}>Create plan</Button>
      </form>
      {error && <p className="mt-4 text-sm font-bold text-red-600">{error}</p>}
      <div className="mt-6 grid gap-3">
        {items.map((plan) => (
          <div className="rounded border border-line bg-slate-50 p-4" key={plan.id}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-black">{plan.title}</h3>
              <Badge tone={plan.status === "active" ? "green" : "orange"}>{plan.status}</Badge>
            </div>
            <p className="mt-2 text-sm leading-7 text-slate-700">{plan.description}</p>
          </div>
        ))}
        {!items.length && <p className="text-sm font-semibold text-muted">No plans yet.</p>}
      </div>
    </div>
  );
}
