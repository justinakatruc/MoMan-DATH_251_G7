export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // no header/sidebar — standalone layout
  return <>{children}</>;
}
