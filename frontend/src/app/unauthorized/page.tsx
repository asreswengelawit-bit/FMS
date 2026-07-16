export default function UnauthorizedPage() {
  return (
    <div className="center-screen">
      <div className="card">
        <h1>403</h1>
        <p className="muted">
          You don&apos;t have a role that grants access to this module.
        </p>
        <a href="/" className="btn" style={{ marginTop: "1rem" }}>
          Go to my dashboard
        </a>
      </div>
    </div>
  );
}
