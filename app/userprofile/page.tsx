"use client";

import { useState } from "react";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  LogOut,
  Edit3,
  Check,
  X,
  Github,
  Twitter,
  Globe,
  ChevronRight,
  Star,
  Activity,
  BookOpen,
} from "lucide-react";

// ── Utility ──────────────────────────────────────────────────────────────────
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface StatItem {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface BadgeItem {
  label: string;
  color: string;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Avatar({
  src,
  name,
  size = "lg",
}: {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const [uploading, setUploading] = useState(false);
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-16 h-16 text-lg",
    lg: "w-24 h-24 text-2xl",
  };

  return (
    <div className="relative group">
      <div
        className={cn(
          sizeClasses[size],
          "rounded-2xl flex items-center justify-center font-semibold tracking-tight overflow-hidden",
          "bg-[var(--primary)] text-[var(--primary-foreground)]",
          "ring-4 ring-[var(--border)] shadow-lg",
        )}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {size === "lg" && (
        <button
          onClick={() => setUploading(!uploading)}
          className={cn(
            "absolute -bottom-1 -right-1 w-8 h-8 rounded-xl",
            "bg-[var(--card)] border border-[var(--border)] shadow-md",
            "flex items-center justify-center",
            "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
            "transition-all duration-200 hover:scale-110",
            "opacity-0 group-hover:opacity-100",
          )}
        >
          <Camera size={14} />
        </button>
      )}

      {size === "lg" && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[var(--background)]" />
      )}
    </div>
  );
}

function EditableField({
  label,
  value,
  icon,
  type = "text",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  type?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const [saved, setSaved] = useState(value);

  function save() {
    setSaved(val);
    setEditing(false);
  }

  function cancel() {
    setVal(saved);
    setEditing(false);
  }

  return (
    <div className="group relative">
      <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200",
          editing
            ? "border-[var(--ring)] bg-[var(--card)] shadow-sm"
            : "border-[var(--border)] bg-[var(--muted)] hover:border-[var(--ring)]/50",
        )}
      >
        <span className="text-[var(--muted-foreground)] flex-shrink-0">
          {icon}
        </span>

        {editing ? (
          <input
            autoFocus
            type={type}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="flex-1 bg-transparent text-[var(--foreground)] text-sm outline-none placeholder:text-[var(--muted-foreground)]"
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") cancel();
            }}
          />
        ) : (
          <span className="flex-1 text-sm text-[var(--foreground)]">
            {saved}
          </span>
        )}

        <div className="flex items-center gap-1">
          {editing ? (
            <>
              <button
                onClick={save}
                className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center hover:bg-emerald-500/25 transition-colors"
              >
                <Check size={13} />
              </button>
              <button
                onClick={cancel}
                className="w-7 h-7 rounded-lg bg-[var(--destructive)]/10 text-[var(--destructive)] flex items-center justify-center hover:bg-[var(--destructive)]/20 transition-colors"
              >
                <X size={13} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="w-7 h-7 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              <Edit3 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ stat }: { stat: StatItem }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-4 rounded-2xl border border-[var(--border)]",
        "bg-[var(--card)] hover:border-[var(--ring)]/40",
        "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
      )}
    >
      <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
        {stat.icon}
        <span className="text-xs font-medium uppercase tracking-wider">
          {stat.label}
        </span>
      </div>
      <p className="text-2xl font-bold text-[var(--foreground)] tabular-nums">
        {stat.value}
      </p>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--border)]">
        <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  defaultOn = false,
}: {
  label: string;
  description: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
      <div>
        <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
          {description}
        </p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0",
          on ? "bg-[var(--primary)]" : "bg-[var(--border)]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200",
            on ? "translate-x-5" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
        active
          ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
          : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
      )}
    >
      {icon}
      <span>{label}</span>
      {!active && <ChevronRight size={14} className="ml-auto opacity-40" />}
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "notifications"
  >("profile");

  const stats: StatItem[] = [
    { label: "Projects", value: "24", icon: <BookOpen size={14} /> },
    { label: "Activity", value: "1.2k", icon: <Activity size={14} /> },
    { label: "Stars", value: "318", icon: <Star size={14} /> },
  ];

  const badges: BadgeItem[] = [
    { label: "Pro", color: "bg-violet-500/15 text-violet-500" },
    { label: "Verified", color: "bg-emerald-500/15 text-emerald-500" },
    { label: "Early Access", color: "bg-amber-500/15 text-amber-500" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
            Account Settings
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Manage your profile, security, and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* ── Sidebar ── */}
          <div className="space-y-4">
            {/* Profile card */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 flex flex-col items-center text-center gap-4">
              <Avatar name="Alexandra Chen" />
              <div>
                <h2 className="font-semibold text-[var(--foreground)] text-base">
                  Alexandra Chen
                </h2>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  Product Designer
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 justify-center">
                {badges.map((b) => (
                  <span
                    key={b.label}
                    className={cn(
                      "text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider",
                      b.color,
                    )}
                  >
                    {b.label}
                  </span>
                ))}
              </div>

              {/* Social links */}
              <div className="flex gap-2">
                {[
                  { icon: <Github size={15} />, href: "#" },
                  { icon: <Twitter size={15} />, href: "#" },
                  { icon: <Globe size={15} />, href: "#" },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    className={cn(
                      "w-8 h-8 rounded-lg border border-[var(--border)]",
                      "flex items-center justify-center",
                      "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--ring)]/50",
                      "transition-all duration-150 hover:bg-[var(--accent)]",
                    )}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Nav */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 space-y-1">
              <NavItem
                icon={<Edit3 size={15} />}
                label="Profile"
                active={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
              />
              <NavItem
                icon={<Shield size={15} />}
                label="Security"
                active={activeTab === "security"}
                onClick={() => setActiveTab("security")}
              />
              <NavItem
                icon={<Bell size={15} />}
                label="Notifications"
                active={activeTab === "notifications"}
                onClick={() => setActiveTab("notifications")}
              />
              <div className="border-t border-[var(--border)] mt-2 pt-2">
                <NavItem
                  icon={<LogOut size={15} />}
                  label="Sign out"
                  onClick={() => {}}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
              {stats.map((s) => (
                <StatCard key={s.label} stat={s} />
              ))}
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="space-y-6">
            {activeTab === "profile" && (
              <>
                <SectionCard title="Personal Information">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <EditableField
                      label="Full Name"
                      value="Alexandra Chen"
                      icon={<Edit3 size={15} />}
                    />
                    <EditableField
                      label="Email Address"
                      value="alex.chen@design.co"
                      icon={<Mail size={15} />}
                      type="email"
                    />
                    <EditableField
                      label="Phone"
                      value="+1 (555) 012-3456"
                      icon={<Phone size={15} />}
                      type="tel"
                    />
                    <EditableField
                      label="Location"
                      value="San Francisco, CA"
                      icon={<MapPin size={15} />}
                    />
                    <div className="sm:col-span-2">
                      <EditableField
                        label="Joined"
                        value="January 14, 2023"
                        icon={<Calendar size={15} />}
                      />
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Bio">
                  <div>
                    <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wider">
                      About you
                    </label>
                    <textarea
                      defaultValue="Product designer specialising in design systems and developer tooling. Building at the intersection of craft and code."
                      rows={4}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted)]",
                        "text-sm text-[var(--foreground)] resize-none outline-none",
                        "focus:border-[var(--ring)] focus:bg-[var(--card)] transition-all duration-200",
                        "placeholder:text-[var(--muted-foreground)]",
                      )}
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        className={cn(
                          "px-5 py-2 rounded-xl text-sm font-medium",
                          "bg-[var(--primary)] text-[var(--primary-foreground)]",
                          "hover:opacity-90 active:scale-95 transition-all duration-150",
                        )}
                      >
                        Save changes
                      </button>
                    </div>
                  </div>
                </SectionCard>
              </>
            )}

            {activeTab === "security" && (
              <>
                <SectionCard title="Password">
                  <div className="space-y-4">
                    {[
                      { label: "Current Password", placeholder: "••••••••" },
                      {
                        label: "New Password",
                        placeholder: "Min. 8 characters",
                      },
                      {
                        label: "Confirm Password",
                        placeholder: "Repeat new password",
                      },
                    ].map((f) => (
                      <div key={f.label}>
                        <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wider">
                          {f.label}
                        </label>
                        <input
                          type="password"
                          placeholder={f.placeholder}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted)]",
                            "text-sm text-[var(--foreground)] outline-none",
                            "focus:border-[var(--ring)] focus:bg-[var(--card)] transition-all duration-200",
                            "placeholder:text-[var(--muted-foreground)]",
                          )}
                        />
                      </div>
                    ))}
                    <div className="flex justify-end pt-2">
                      <button
                        className={cn(
                          "px-5 py-2 rounded-xl text-sm font-medium",
                          "bg-[var(--primary)] text-[var(--primary-foreground)]",
                          "hover:opacity-90 active:scale-95 transition-all duration-150",
                        )}
                      >
                        Update password
                      </button>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Two-Factor Authentication">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        Authenticator app
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">
                        Use an authenticator app to generate one-time codes.
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500">
                      Enabled
                    </span>
                  </div>
                </SectionCard>

                <SectionCard title="Active Sessions">
                  {[
                    {
                      device: 'MacBook Pro 16"',
                      location: "San Francisco, CA",
                      time: "Now",
                    },
                    {
                      device: "iPhone 15 Pro",
                      location: "San Francisco, CA",
                      time: "2h ago",
                    },
                    {
                      device: "Chrome — Windows",
                      location: "New York, NY",
                      time: "3d ago",
                    },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">
                          {s.device}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                          {s.location} · {s.time}
                        </p>
                      </div>
                      {s.time !== "Now" && (
                        <button className="text-xs font-medium text-[var(--destructive)] hover:underline">
                          Revoke
                        </button>
                      )}
                      {s.time === "Now" && (
                        <span className="text-xs text-emerald-500 font-medium">
                          Current
                        </span>
                      )}
                    </div>
                  ))}
                </SectionCard>
              </>
            )}

            {activeTab === "notifications" && (
              <SectionCard title="Notification Preferences">
                <ToggleRow
                  label="Email notifications"
                  description="Receive updates and alerts via email"
                  defaultOn={true}
                />
                <ToggleRow
                  label="Push notifications"
                  description="Browser and mobile push alerts"
                  defaultOn={true}
                />
                <ToggleRow
                  label="Weekly digest"
                  description="A summary of activity sent every Monday"
                  defaultOn={false}
                />
                <ToggleRow
                  label="Product updates"
                  description="New features, releases and announcements"
                  defaultOn={true}
                />
                <ToggleRow
                  label="Security alerts"
                  description="Login attempts and account changes"
                  defaultOn={true}
                />
                <ToggleRow
                  label="Marketing emails"
                  description="Tips, case studies and offers"
                  defaultOn={false}
                />
              </SectionCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
