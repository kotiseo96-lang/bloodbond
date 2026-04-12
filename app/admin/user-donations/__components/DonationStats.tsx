"use client"

type Donation = {
  blood_group: string
}

export default function DonationStats({
  donations,
}: {
  donations: Donation[]
}) {
  // ✅ Total
  const total = donations.length

  // ✅ Group-wise count
  const groupCounts = donations.reduce((acc: any, curr) => {
    acc[curr.blood_group] = (acc[curr.blood_group] || 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-4 mt-4">
      
      {/* Total */}
      <div className="p-4 bg-blue-100 rounded">
        <h2 className="text-lg font-semibold">Total Donations</h2>
        <p className="text-2xl font-bold">{total}</p>
      </div>

      {/* Group-wise */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(groupCounts).map(([group, count]) => (
          <div
            key={group}
            className="p-4 bg-green-100 rounded text-center"
          >
            <p className="font-semibold">{group}</p>
            <p className="text-xl font-bold">{count as number}</p>
          </div>
        ))}
      </div>

    </div>
  )
}