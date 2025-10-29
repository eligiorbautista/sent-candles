import { supabase } from '../config/supabase.js';

const AUTH_STORAGE_KEY = 'sent_admin_token';

export async function isAuthenticated() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
    return Boolean(session);
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

export async function login(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }

    if (data.user) {
      localStorage.setItem(AUTH_STORAGE_KEY, data.session?.access_token || '1');
      return { success: true, user: data.user };
    }

    return { success: false, error: 'Login failed' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return { success: true };
  }
}

export async function changePassword(currentPassword, newPassword) {
  try {
    // First, verify the current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: (await supabase.auth.getUser()).data.user?.email,
      password: currentPassword,
    });

    if (signInError) {
      console.error('Current password verification failed:', signInError);
      return { ok: false, error: 'Current password is incorrect.' };
    }

    // If current password is correct, update to new password
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('Password change error:', error);
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (error) {
    console.error('Password change error:', error);
    return { ok: false, error: 'Failed to update password.' };
  }
}

export async function resetPassword(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `https://sentcandles.netlify.app/admin/reset-password`,
    });

    if (error) {
      console.error('Password reset error:', error);
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return { ok: false, error: 'Failed to send reset email.' };
  }
}

// Listen for auth state changes
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      localStorage.setItem(AUTH_STORAGE_KEY, session?.access_token || '1');
    } else if (event === 'SIGNED_OUT') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    callback(event, session);
  });
}
