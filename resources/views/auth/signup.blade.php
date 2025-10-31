<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign Up - AcadLink</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{{ mix('css/app.css') }}">
</head>
<body class="auth-page">
  <div class="auth-card">
    <div class="auth-header">
      <div class="auth-logo">🎓</div>
      <div class="auth-title">AcadLink</div>
      <div class="auth-sub">Admin Portal - Student and Faculty Management</div>
    </div>

    <div class="auth-tabs">
      <a href="{{ route('login') }}">Login</a>
      <a href="{{ route('signup') }}" class="is-active">Sign Up</a>
    </div>

    <form class="auth-form" method="POST" action="{{ route('signup') }}">
      @csrf
      <div class="mb-2">
        <label class="form-label">Full Name</label>
        <input type="text" class="form-control" name="name" placeholder="John Doe" required>
      </div>
      <div class="mb-2">
        <label class="form-label">Email</label>
        <input type="email" class="form-control" name="email" placeholder="admin@school.edu" required>
      </div>
      <div class="mb-2">
        <label class="form-label">Password</label>
        <input type="password" class="form-control" name="password" placeholder="•••••••" required>
      </div>
      <div class="auth-actions">
        <button class="btn" type="submit">Create Admin Account</button>
      </div>
    </form>
  </div>
</body>
</html>
