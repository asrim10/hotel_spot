import { handleWhoAmI } from "@/lib/actions/auth-action";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage() {
  const result = await handleWhoAmI();

  if (!result.success) {
    throw new Error("Error fetching user data");
  }

  if (!result.data) {
    notFound();
  }

  const user = result.data;

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user.fullName || user.username}
          </h1>
          <p className="text-gray-500 mt-1">
            {formatDate(new Date().toISOString())}
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg border-2 border-blue-500 overflow-hidden">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100"></div>

          {/* Profile Info */}
          <div className="px-8 py-6">
            {/* Avatar and Name */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 -mt-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                  {user.imageUrl ? (
                    <img
                      src={process.env.NEXT_PUBLIC_API_BASE_URL + user.imageUrl}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {user.fullName || user.username}
                  </h2>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>
              <Link
                href="/user/profile/edit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium"
              >
                Edit
              </Link>
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-600">
                  {user.fullName || "Not set"}
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-600">
                  {user.username}
                </div>
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  My email Address
                </label>
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-500 text-xl">📧</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      Member since {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Account Type
                </label>
                <div className="bg-gray-50 rounded-lg px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>

              {/* Created At */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Account Created
                </label>
                <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-600">
                  {formatDate(user.createdAt)}
                </div>
              </div>

              {/* Last Updated */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Updated
                </label>
                <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-600">
                  {formatDate(user.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
