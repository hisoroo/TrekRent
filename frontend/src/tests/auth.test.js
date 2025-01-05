import { getToken, setToken, removeToken, isAuthenticated, handleLogout } from '../utils/auth';
import { beforeEach, describe, expect, test, vi } from 'vitest';

describe('Auth Utils', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  test('setToken should store token in localStorage', () => {
    setToken('test-token');
    expect(localStorage.getItem('token')).toBe('test-token');
  });

  test('getToken should retrieve token from localStorage', () => {
    localStorage.setItem('token', 'test-token');
    expect(getToken()).toBe('test-token');
  });

  test('removeToken should remove token from localStorage', () => {
    localStorage.setItem('token', 'test-token');
    removeToken();
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('isAuthenticated should return false for expired token', () => {
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      btoa(JSON.stringify({ exp: Date.now() / 1000 - 1000 })) + '.secret';
    setToken(expiredToken);
    expect(isAuthenticated()).toBe(false);
  });

  test('handleLogout should clear user data and token', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ id: 1 }));
    handleLogout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
