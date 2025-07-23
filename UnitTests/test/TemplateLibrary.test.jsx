/* eslint-disable */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TemplateLibrary from '../TemplateLibrary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

// Minimal required mocks
vi.mock('react-redux', () => ({
  useSelector: () => ({ storeDetails: { payPlanType: 'PAID', customSubDomain: 'test', customDomain: 'test.com' } }),
  useDispatch: () => () => {},
}));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));
vi.mock('../../../api/BusinessProfile/PageBuilder', () => ({
  PageBuilderAPI: {
    useGetPageBuilderTemplates: () => ({
      data: { templates: [], pagination: { totalDocs: 0 } },
      page: 1,
      setPage: vi.fn(),
      limit: 10,
      setLimit: vi.fn(),
      isFetching: false,
    }),
    useUpdateTemplateStatus: () => ({ mutateAsync: vi.fn() }),
    useDeleteTemplate: () => ({ mutate: vi.fn() }),
    useDeleteTemplatePermanently: () => ({ mutate: vi.fn() }),
    useRestoreTemplate: () => ({ mutateAsync: vi.fn() }),
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
          <th>Template Name</th>
          <th>Template Type</th>
          <th>Status</th>
          <th>Applied To</th>
          <th>Author</th>
          <th>Last Modified</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody />
    </table>
  ),
}));
vi.mock('@casl/react', () => ({
  Can: ({ children }) => <>{children}</>,
  createContextualCan: () => () => null,
}));
vi.mock('../../../components/Can/Can', () => ({
  Can: ({ children }) => <>{children}</>,
}));
vi.mock('../../../helpers/permissions/modules', () => ({
  permissionMainModules: { pageBuilder: 'pageBuilder' },
  permissionSubjects: { pageBuilder: 'pageBuilder' },
}));
vi.mock('../../../components/Shared/Custom/utilities', () => ({
  Section: ({ children }) => <div>{children}</div>,
}));
vi.mock('../../../components/ConfirmationDialog/ConfirmationDialog', () => ({
  ConfirmationDialog: ({ children }) => <div>{children}</div>,
}));
vi.mock('../../../components/Shared/Custom/notification', () => ({
  __esModule: true,
  default: vi.fn(),
}));
vi.mock('../../../components/IconCrown', () => ({
  __esModule: true,
  default: () => <span>IconCrown</span>,
}));
vi.mock('../../../components/Shared/Custom/svg', () => ({
  ModalWarningIcon: () => <span>ModalWarningIcon</span>,
}));
vi.mock('./AddNewTemplateForm', () => ({
  AddNewTemplateForm: () => <div>AddNewTemplateForm</div>,
}));
vi.mock('./ComingSoonModal', () => ({
  __esModule: true,
  default: () => <div>ComingSoonModal</div>,
}));
vi.mock('../../../Partials/Upgrade', () => ({
  __esModule: true,
  default: () => <div>Upgrade</div>,
}));
vi.mock('moment', () => ({
  __esModule: true,
  default: () => ({ format: () => 'date' }),
}));
vi.mock('classnames', () => ({
  __esModule: true,
  default: () => '',
}));
vi.mock('@mui/icons-material', () => ({
  Search: () => <svg data-testid="SearchIcon" />,
  MoreHoriz: () => <svg data-testid="MoreHorizIcon" />,
  HelpOutlined: () => <span>HelpOutlinedIcon</span>,
  Info: () => <span>InfoIcon</span>,
}));


describe('TemplateLibrary', () => {
  it('renders the main title, table headers, and Add Template button', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <TemplateLibrary />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(screen.getByText('Template Library')).toBeInTheDocument();
    expect(screen.getByText('Template Name')).toBeInTheDocument();
    expect(screen.getByText('Template Type')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Applied To')).toBeInTheDocument();
    expect(screen.getByText('Author')).toBeInTheDocument();
    expect(screen.getByText('Last Modified')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
});
