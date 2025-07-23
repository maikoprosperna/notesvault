/* eslint-disable */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PageBuilder from '../PageBuilder';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

// Only the bare minimum mocks
vi.mock('react-redux', () => ({
  useSelector: () => ({ payPlanType: 'PAID', storeDetails: { payPlanType: 'PAID' } }),
  useDispatch: () => () => {},
}));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));
vi.mock('../../../api/BusinessProfile/PageBuilder', () => ({
  PageBuilderAPI: {
    useGetPageBuilderPages: () => ({
      data: { pages: [], pagination: { totalDocs: 0 } },
      page: 1,
      setPage: vi.fn(),
      limit: 10,
      setLimit: vi.fn(),
      isFetching: false,
    }),
  },
}));
vi.mock('../../../components/SectionTitle', () => ({
  __esModule: true,
  default: ({ title }) => <div>{title}</div>,
}));
vi.mock('../../../components/Table', () => ({
  __esModule: true,
  default: () => (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Author</th>
          <th>Last Modified</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody />
    </table>
  ),
}));
vi.mock('../../../components/AppButton/AppButton', () => ({
  __esModule: true,
  default: (props) => <button {...props}>{props.children}</button>,
}));
vi.mock('@casl/react', () => ({
  Can: ({ children }) => <>{children}</>,
  createContextualCan: () => () => null,
}));
vi.mock('../../../helpers/permissions/modules', () => ({
  permissionMainModules: { pageBuilder: 'pageBuilder' },
  permissionSubjects: { pageBuilder: 'pageBuilder' },
}));

// Minimal test

describe('PageBuilder', () => {
  it('renders the main title and table', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PageBuilder />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(screen.getByText('Page Builder')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Author')).toBeInTheDocument();
    expect(screen.getByText('Last Modified')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });
});
