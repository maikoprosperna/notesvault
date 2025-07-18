/* eslint-env jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import LeadSuccessResetPassword from './page';
import { publicSubRoutes } from '@/constants/public-routes';

jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('LeadSuccessResetPassword', () => {
  it('renders the success message and login link', () => {
    render(<LeadSuccessResetPassword />);
    expect(
      screen.getByRole('heading', { name: /password reset successful/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/your password has been successfully reset/i),
    ).toBeInTheDocument();
    const loginLink = screen.getByRole('link', { name: /back to login/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute(
      'href',
      publicSubRoutes.accountLogin.linkToRoute,
    );
  });
});
