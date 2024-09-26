import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const UserProfile: React.FC = () => {
  const { data: session } = useSession();

  if (!session) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="mb-4">
        <strong>Name:</strong> {session.user.name}
      </div>
      <div className="mb-4">
        <strong>Email:</strong> {session.user.email}
      </div>
      <Link href="/settings" className="text-blue-500 hover:underline">
        Edit Settings
      </Link>
    </div>
  );
};

export default UserProfile;