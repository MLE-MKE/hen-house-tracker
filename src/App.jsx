import React, { useEffect, useMemo, useState } from "react";

const DEFAULT_STEPS = [
  {
    id: "s1",
    title: "Step 1 – Develop Recipes",
    deadline: "Oct 2025",
    progress: 0,
    tasks: [
      { id: "s1t1", label: "Research flavor trends & competitors", done: false },
      { id: "s1t2", label: "Source WI/Midwest ingredients", done: false },
      { id: "s1t3", label: "Test small-batch recipes", done: false },
      { id: "s1t4", label: "Check pH and food safety guidelines", done: false },
      { id: "s1t5", label: "Record exact methods for consistency", done: false },
      { id: "s1t6", label: "Conduct taste feedback round", done: false }
    ]
  },
  {
    id: "s2",
    title: "Step 2 – Finalize Branding & Design",
    deadline: "Nov 2025",
    progress: 0,
    tasks: [
      { id: "s2t1", label: "Choose business name & check trademark", done: false },
      { id: "s2t2", label: "Design logo & color palette", done: false },
      { id: "s2t3", label: "Create WI-compliant label designs", done: false },
      { id: "s2t4", label: "Decide bottle size, cap style, and packaging", done: false },
      { id: "s2t5", label: "Order initial label & packaging samples", done: false }
    ]
  },
  {
    id: "s3",
    title: "Step 3 – Secure Licensed Kitchen",
    deadline: "Dec 2025",
    progress: 0,
    tasks: [
      { id: "s3t1", label: "Research local commercial kitchens", done: false },
      { id: "s3t2", label: "Confirm DATCP food processing license coverage", done: false },
      { id: "s3t3", label: "Schedule production days", done: false }
    ]
  },
  {
    id: "s4",
    title: "Step 4 – Form LLC & Get Licensing",
    deadline: "Feb 2026",
    progress: 0,
    tasks: [
      { id: "s4t1", label: "File LLC with WI DFI", done: false },
      { id: "s4t2", label: "Get EIN from IRS", done: false },
      { id: "s4t3", label: "Apply for WI Food Processing Plant License (DATCP)", done: false },
      { id: "s4t4", label: "Take required food safety/processing training", done: false },
      { id: "s4t5", label: "Apply for Transient Merchant/Direct Seller License", done: false },
      { id: "s4t6", label: "Get product liability insurance", done: false }
    ]
  },
  {
    id: "s5",
    title: "Step 5 – Secure Booth at Public Markets",
    deadline: "Mar 15 2026",
    progress: 0,
    tasks: [
      { id: "s5t1", label: "Research markets & vendor rules", done: false },
      { id: "s5t2", label: "Prepare vendor applications", done: false },
      { id: "s5t3", label: "Submit with proof of licensing & insurance", done: false },
      { id: "s5t4", label: "Design booth layout", done: false },
      { id: "s5t5", label: "Order marketing materials", done: false }
    ]
  },
  {
    id: "s6",
    title: "Step 6 – Sell Hot Sauce",
    deadline: "May 2026",
    progress: 0,
    tasks: [
      { id: "s6t1", label: "Produce first market-ready batch in licensed kitchen", done: false },
      { id: "s6t2", label: "Label bottles (WI-compliant)", done: false },
      { id: "s6t3", label: "Transport & store products safely", done: false },
      { id: "s6t4", label: "Set up at market & follow health codes", done: false },
      { id: "s6t5", label: "Track sales & collect feedback", done: false }
    ]
  }
];


const STORAGE_KEY = "hs_tracker_v2";

function useStoredState(initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);
  return [state, setState];
}

function ProgressBar({ value }) {
  return (
    <div className="w-full bg-gray-100 rounded-2xl h-4">
      <div className="h-4 rounded-2xl" style={{ width: `${value}%`, background: "green" }} />
    </div>
  );
}

function Card({ children }) {
  return <div className="bg-white rounded-2xl shadow p-4 border border-gray-100">{children}</div>;
}

export default function App() {
  const [steps, setSteps] = useStoredState(DEFAULT_STEPS);
  const [expanded, setExpanded] = useState({});

  const totals = useMemo(() => {
    const totalTasks = steps.reduce((a, s) => a + s.tasks.length, 0);
    const doneTasks = steps.reduce((a, s) => a + s.tasks.filter(t => t.done).length, 0);
    return { totalTasks, doneTasks, pct: Math.round((doneTasks / Math.max(1, totalTasks)) * 100) };
  }, [steps]);

  const updateTask = (sid, tid, done) => {
    setSteps(prev => prev.map(s => s.id === sid ? ({
      ...s,
      tasks: s.tasks.map(t => t.id === tid ? { ...t, done } : t),
      progress: Math.round((s.tasks.filter(t => t.id === tid ? done : t.done).length / s.tasks.length) * 100)
    }) : s));
  };

  return (
   <div
  className="min-h-screen text-gray-900 p-4 bg-cover bg-center"
  style={{ backgroundImage: "url('/images/bg.png')" }}
>
      <div className="max-w-3xl mx-auto space-y-4">
        <header><h1 className="text-2xl font-bold">Hen House Tracker</h1></header>
        <Card>
          <div className="flex items-center gap-3">
            <ProgressBar value={totals.pct} />
            <div>{totals.pct}%</div>
          </div>
        </Card>
        {steps.map(step => (
          <Card key={step.id}>
            <div className="flex justify-between">
              <div>
                <h2 className="font-semibold">{step.title}</h2>
                <div className="text-sm text-gray-500">Deadline: {step.deadline}</div>
                <ProgressBar value={step.progress} />
              </div>
              <button onClick={() => setExpanded(p => ({...p, [step.id]: !p[step.id]}))}>
                {expanded[step.id] ? "Hide" : "Tasks"}
              </button>
            </div>
            {expanded[step.id] && (
              <div className="mt-2">
                {step.tasks.map(t => (
                  <label key={t.id} className="flex items-center gap-2">
                    <input type="checkbox" checked={t.done} onChange={e => updateTask(step.id, t.id, e.target.checked)} />
                    <span>{t.label}</span>
                  </label>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
