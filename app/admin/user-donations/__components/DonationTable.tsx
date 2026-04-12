"use client"

import { useState } from "react"

type Donation = {
    donation_id: string
    donated_at: string
    donor_name: string
    email: string
    blood_group: string
    donation_number: number
    user_balance: number
}

export default function DonationTable({ donations }: { donations: Donation[] }) {
    const [selectedUser, setSelectedUser] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const uniqueDonations = Object.values(
        donations.reduce((acc, curr) => {
            if (!acc[curr.donor_name]) {
                acc[curr.donor_name] = curr
            }
            return acc
        }, {} as Record<string, any>)
    )

    const userHistory = donations.filter(
        (d) => d.donor_name === selectedUser
    )


    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Donation History</h2>

            <div className="overflow-x-auto">
                <table className="w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">Date</th>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Blood Group</th>
                            <th className="border p-2">Nth Donation</th>
                            <th className="border p-2">Balance</th>
                        </tr>
                    </thead>

                    <tbody>
                        {uniqueDonations.map((d) => (
                            <tr key={d.donation_id}>
                                <td className="border p-2">
                                    {new Date(d.donated_at).toLocaleString()}
                                </td>

                                {/* 👇 clickable name */}
                                <td
                                    className="border p-2 text-blue-600 cursor-pointer"
                                    onClick={() => {
                                        setSelectedUser(d.donor_name)
                                        setIsOpen(true)
                                    }}
                                >
                                    {d.donor_name}
                                </td>

                                <td className="border p-2">{d.email}</td>
                                <td className="border p-2">{d.blood_group}</td>
                                <td className="border p-2">{d.donation_number}</td>
                                <td className="border p-2">{d.user_balance}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {isOpen && selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

                        <div className="bg-white rounded-lg p-6 w-full max-w-md relative">

                            {/* Close button */}
                            <button
                                className="absolute top-2 right-2 text-gray-500"
                                onClick={() => setIsOpen(false)}
                            >
                                ✕
                            </button>

                            <h3 className="text-lg font-semibold mb-4">
                                {selectedUser} Donation History
                            </h3>

                            <ul className="space-y-2 max-h-60 overflow-y-auto">
                                {userHistory.map((d) => (
                                    <li
                                        key={d.donation_id}
                                        className="border p-2 rounded bg-gray-50"
                                    >
                                        #{d.donation_number} —{" "}
                                        {new Date(d.donated_at).toLocaleString()}
                                    </li>
                                ))}
                            </ul>

                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}