export default function AgendaProgressBar({ currentProgress, onProgressChange }) {
    const steps = [0, 25, 50, 75, 100];

    return (
        <div className="flex h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            {steps.map((step) => (
                <button
                    key={step}
                    type="button"
                    onClick={() => onProgressChange(step)}
                    className={`flex-1 transition-all duration-300 cursor-pointer border-r border-slate-200 last:border-0 ${
                        currentProgress >= step
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:brightness-105"
                            : "bg-transparent hover:bg-slate-200"
                    }`}
                    title={`Set Progress to ${step}%`}
                />
            ))}
        </div>
    );
}