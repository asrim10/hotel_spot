import DarkPageLayout, {
  DarkRowList,
  DarkSection,
  styles,
} from "@/app/_components/ui/DarkPage";
import { handleWhoAmI } from "@/lib/actions/auth-action";
import { notFound } from "next/navigation";

export default async function ProfilePage() {
  const result = await handleWhoAmI();
  if (!result.success) throw new Error("Error fetching user data");
  if (!result.data) notFound();

  const user = result.data;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const initials = user.username?.charAt(0).toUpperCase();

  const avatar = (
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        overflow: "hidden",
        border: "2px solid #2a2a2a",
        flexShrink: 0,
      }}
    >
      {user.imageUrl ? (
        <img
          src={process.env.NEXT_PUBLIC_API_BASE_URL + user.imageUrl}
          alt={user.username}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #c9a96e 0%, #8b6914 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0a0a0a",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          {initials}
        </div>
      )}
    </div>
  );

  return (
    <DarkPageLayout
      eyebrow="Your Profile"
      title={user.fullName || user.username}
      heroTopRight={
        <div style={{ textAlign: "right" }}>
          <p style={{ ...styles.eyebrow, marginBottom: "0.5rem" }}>
            Account Type
          </p>
          <p
            style={{
              color: "#fff",
              fontSize: 28,
              fontWeight: 700,
              textTransform: "uppercase",
              margin: "0 0 0.25rem",
            }}
          >
            {user.role}
          </p>
          <p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>
            Member since {formatDate(user.createdAt)}
          </p>
        </div>
      }
      heroActions={[{ label: "Edit Profile", href: "/user/profile/edit" }]}
      avatarSlot={avatar}
      stats={[
        { label: "Username", value: user.username },
        { label: "Email", value: user.email },
        { label: "Last Updated", value: formatDate(user.updatedAt) },
      ]}
    >
      <DarkSection eyebrow="Account Details" title="Personal Info">
        <DarkRowList
          rows={[
            { label: "Full Name", value: user.fullName || "Not set" },
            { label: "Username", value: user.username },
            { label: "Email Address", value: user.email },
            {
              label: "Account Type",
              value: user.role.charAt(0).toUpperCase() + user.role.slice(1),
            },
            { label: "Account Created", value: formatDate(user.createdAt) },
            { label: "Last Updated", value: formatDate(user.updatedAt) },
          ]}
        />
        <div
          style={{
            marginTop: "3rem",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <a
            href="/user/profile/edit"
            style={{
              ...styles.btnOutline,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            + Edit Profile
          </a>
        </div>
      </DarkSection>
    </DarkPageLayout>
  );
}
