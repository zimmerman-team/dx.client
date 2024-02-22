// mock user info
const mockAuth0User = {
  nickname: "marydoe",
  name: "marydoe@gmail.com",
  email: "marydoe@gmail.com",
  sub: "auth0|123",
};

// value returned for useAuth0 when logged-in
const mockUseAuth0LoggedIn = {
  isAuthenticated: true,
  isLoading: false,
  user: mockAuth0User,
  logout: jest.fn(),
  loginWithRedirect: jest.fn(),
};

// value returned for useAuth0 when logged-out
const mockUseAuth0LoggedOut = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  logout: jest.fn(),
  loginWithRedirect: jest.fn(),
};

// mock useAuth0 function that return logged-in or logged-out values
export const mockUseAuth0 = (status: boolean) => {
  if (status) {
    return mockUseAuth0LoggedIn;
  }
  return mockUseAuth0LoggedOut;
};
