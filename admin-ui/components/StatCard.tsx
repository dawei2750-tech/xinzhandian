interface StatCardProps {
  title: string
  value: number | string
  icon: string
  color: string
  borderColor: string
}

export default function StatCard({
  title,
  value,
  icon,
  color,
  borderColor,
}: StatCardProps) {
  return (
    <div className={`card p-6 ${color} border ${borderColor}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  )
}
