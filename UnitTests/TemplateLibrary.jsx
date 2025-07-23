/* eslint-disable prettier/prettier */
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  permissionMainModules,
  permissionSubjects,
} from '../../../helpers/permissions/modules';
import { Can } from '../../../components/Can/Can';
import Table from '../../../components/Table';
import {
  // Card,
  Col,
  Form,
  InputGroup,
  // OverlayTrigger,
  Row,
  // Tooltip,
  Dropdown,
} from 'react-bootstrap';
import { Section } from '../../../components/Shared/Custom/utilities';
import { Search } from '@mui/icons-material';
import SectionTitle from '../../../components/SectionTitle';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { PageBuilderAPI } from '../../../api/BusinessProfile/PageBuilder';
// import UpgradeModal from './UpgradeModal';
import ComingSoonModal from './ComingSoonModal';
import moment from 'moment';
import _ from 'lodash';
import { useSidebarSelector } from '../../../hooks/useSidebarSelector';
import { AddNewTemplateForm } from './AddNewTemplateForm';
import { MoreHoriz } from '@mui/icons-material';
import MyNotification from '../../../components/Shared/Custom/notification';
import { ConfirmationDialog } from '../../../components/ConfirmationDialog/ConfirmationDialog';
// import BetaBadge from '../../../components/BetaBadge';
import IconCrown from '../../../components/IconCrown';
import { ModalWarningIcon } from '../../../components/Shared/Custom/svg';
import Upgrade from '../../../Partials/Upgrade';

const TemplateLibrary = () => {
  const storeAccount = useSelector((state) => state.account.storeDetails);

  const isPaidPlan = storeAccount?.payPlanType === 'FREE' ? false : true;

  useSidebarSelector(permissionSubjects.pageBuilder);

  const [search, setSearch] = useState('');
  const {
    data: dataPageBuilderTemplates,
    page,
    setPage,
    limit,
    setLimit,
    isFetching,
    // isFetched: isFetchedPageBuilderTemplates,
  } = PageBuilderAPI.useGetPageBuilderTemplates({
    search,
  });

  const { t } = useTranslation();
  // Selected Rows
  // eslint-disable-next-line no-unused-vars
  const [selectedRow, setSelectedRow] = useState(0);
  // Search State
  //Upgrade Modal
  const [openUpgrade, setOpenUpgrade] = useState(false);
  const [openComingSoon, setOpenComingSoon] = useState(false);

  //Modal Add New Template trigger
  const [modalAddNewTemplateTrigger, setModalAddNewTemplateTrigger] =
    useState(false);
  const [isQuickEdit, setIsQuickEdit] = useState(false);
  const [updateData, setUpdateData] = useState({});

  //Modal Delete Page trigger
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUnpublishTemplateModal, setShowUnpublishTemplateModal] =
    useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isError, setIsError] = useState(false);
  const [templateID, setTemplateID] = useState('');

  const [unpublishVariable, setUnpublishVariable] = useState({
    id: '',
    action: '',
  });

  const handleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
    setInputValue('');
  };

  const handleUnpublishTemplateModal = () => {
    setShowUnpublishTemplateModal(!showUnpublishTemplateModal);
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
    setIsError(false);
  };

  //delete page when "yes" on modal is clicked
  const handleConfirmDeleteModal = () => {
    if (inputValue !== 'DELETE') {
      setIsError(true);
    } else {
      handleDeleteModal();
      deleteTemplatePermanently.mutate(templateID);
    }
  };

  //unpublish template when "confirm" on modal is clicked
  const handleConfirmUnpublishTemplateModal = () => {
    handleUnpublishTemplateModal();
    // console.log(unpublishVariable);
    updateTemplateStatus.mutateAsync({
      id: unpublishVariable?.id,
      action: unpublishVariable?.action,
    });
  };

  const onSearch = (searchedValue) => {
    setSearch(searchedValue);
  };

  const redirectStoreUrl = () => {
    if (storeAccount) {
      if (storeAccount.redirectToCustomDomain) {
        return `${storeAccount.customDomain}`;
      }
      return `${storeAccount.customSubDomain}`;
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setDebouncedSearched = useCallback(_.debounce(onSearch, 500), []);

  const updateTemplateStatus = PageBuilderAPI.useUpdateTemplateStatus({
    onSuccess: (data) => {
      MyNotification(true, '', data.message);
      // setModalAddNewTemplateTrigger(false);
    },
    onError: (error) => {
      MyNotification(false, '', error);
    },
  });

  const deleteTemplate = PageBuilderAPI.useDeleteTemplate({
    onSuccess: (data) => {
      MyNotification(true, '', data.message);
    },
    onError: (error) => {
      MyNotification(false, '', error);
    },
  });

  const deleteTemplatePermanently = PageBuilderAPI.useDeleteTemplatePermanently(
    {
      onSuccess: (data) => {
        MyNotification(true, '', data.message);
      },
      onError: (error) => {
        MyNotification(false, '', error);
      },
    },
  );

  const restoreTemplate = PageBuilderAPI.useRestoreTemplate({
    onSuccess: (data) => {
      MyNotification(true, '', data.message);
      setModalAddNewTemplateTrigger(false);
    },
    onError: (error) => {
      MyNotification(false, '', error);
    },
  });

  /* template column render */
  const TemplateColumn = ({ value }) => {
    return (
      <>
        <span className="fw-bold">
          <span className="me-2">{value}</span>
          <span>{!isPaidPlan ? <IconCrown /> : ''}</span>
        </span>
      </>
    );
  };

  const TemplateTypeColumn = ({ row }) => {
    const templateType = row?.original?.template_type;

    // Function to capitalize the first letter of a string
    const capitalizeFirstLetter = (string) => {
      return string?.charAt(0)?.toUpperCase() + string?.slice(1);
    };

    return <>{capitalizeFirstLetter(templateType)}</>;
  };

  /* status column render */
  const StatusColumn = ({ row, value }) => {
    return (
      <>
        <span
          className={classNames('badge', {
            'tag-text-success': value,
            'tag-bg-success': value,
            'tag-bg-failed': !value,
            'tag-text-failed': !value,
          })}
        >
          {value
            ? 'Published'
            : row?.original?.is_trashed
              ? 'Sent to Trash'
              : 'Unpublished'}
        </span>
      </>
    );
  };

  const PageAppliedColumn = ({ row }) => {
    const displayValue =
      row?.original?.selected_pages?.length === 0
        ? 'None'
        : row?.original?.page_applied === 'all_pages'
          ? 'All Pages'
          : row?.original?.page_applied === 'specific_pages'
            ? 'Specific Pages'
            : 'None';

    return <>{displayValue}</>;
  };

  // Custom sorting function
  const customSort = (rowA, rowB, desc) => {
    const valueA = getValueForSort(rowA);
    const valueB = getValueForSort(rowB);

    if (desc) {
      return valueA.localeCompare(valueB);
    } else {
      return valueB.localeCompare(valueA);
    }
  };

  // Helper function to get value for sorting
  const getValueForSort = (row) => {
    return row.original.selected_pages?.length === 0
      ? 'None'
      : row.original.page_applied;
  };

  /* action column render */
  const ActionColumn = ({ row }) => {
    // eslint-disable-next-line react/display-name
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
      <div
        style={{ cursor: 'pointer' }}
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {children}
      </div>
    ));

    return (
      <>
        <Dropdown>
          <Dropdown.Toggle as={CustomToggle}>
            <MoreHoriz />
          </Dropdown.Toggle>
          <Dropdown.Menu className="min-w-100">
            {!row?.original?.is_trashed && (
              <>
                <Dropdown.Item
                  eventKey="1"
                  onClick={() =>
                    !isPaidPlan
                      ? window.open(
                          `${redirectStoreUrl()}${
                            row?.original?.is_published
                              ? '/view/template' + row?.original?.slug
                              : '/preview/template' + row?.original?.slug
                          }`,
                          '_blank',
                        )
                      : window.open(
                          `${redirectStoreUrl()}${
                            row?.original?.is_published
                              ? '/view/template' + row?.original?.slug
                              : '/preview/template' + row?.original?.slug
                          }`,
                          '_blank',
                        )
                  }
                >
                  {row?.original?.is_published ? 'View' : 'Preview'}
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="2"
                  onClick={() =>
                    !isPaidPlan
                      ? setOpenUpgrade(true)
                      : (row?.original?.is_published
                          ? (setShowUnpublishTemplateModal(true),
                            setUnpublishVariable({
                              id: [row.original.id],
                              action: 'unpublish',
                            }))
                          : updateTemplateStatus.mutateAsync({
                              id: [row.original.id],
                              action: 'publish',
                            }),
                        setTemplateID(row?.original?.id))
                  }
                >
                  {row?.original?.is_published ? 'Unpublish' : 'Publish'}
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="3"
                  onClick={() => {
                    !isPaidPlan
                      ? setOpenUpgrade(true)
                      : (setIsQuickEdit(true),
                        setModalAddNewTemplateTrigger(true),
                        setUpdateData(row?.original));
                  }}
                >
                  Quick Edit
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="4"
                  onClick={() =>
                    !isPaidPlan
                      ? setOpenUpgrade(true)
                      : window.open(
                          `/builder/template${row?.original?.slug}`,
                          '_blank',
                        )
                  }
                >
                  Edit
                </Dropdown.Item>
              </>
            )}

            {row?.original?.is_trashed ? (
              <>
                <Dropdown.Item
                  eventKey="5"
                  onClick={() =>
                    restoreTemplate.mutateAsync({
                      id: row?.original?.id,
                    })
                  }
                >
                  Restore Template
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="5"
                  onClick={() => {
                    setShowDeleteModal(true);
                    setTemplateID(row?.original?.id);
                    setIsError(false);
                  }}
                >
                  Delete Permanently
                </Dropdown.Item>
              </>
            ) : (
              <>
                <Dropdown.Item
                  eventKey="5"
                  onClick={() =>
                    !isPaidPlan
                      ? setOpenUpgrade(true)
                      : deleteTemplate.mutateAsync({
                          id: row?.original?.id,
                        })
                  }
                >
                  Trash
                </Dropdown.Item>
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  };

  const DateColumn = ({ value }) => {
    const date = new Date(value);
    return <span>{moment(date).format('MMM DD, YYYY | hh:mm A')}</span>;
  };
  const AuthorColumn = ({ value }) => {
    return (
      <span>
        {value?.first_name} {value?.last_name}
      </span>
    );
  };

  const statusSort = (rowA, rowB) => {
    return rowA.original.is_published === rowB.original.is_published
      ? 0
      : rowA.original.is_published
        ? -1
        : 1;
  };

  const titleSort = (rowA, rowB, columnId) => {
    return rowA.values[columnId].localeCompare(
      rowB.values[columnId],
      undefined,
      { sensitivity: 'base' },
    );
  };

  // get all columns
  const columns = [
    {
      Header: 'Template Name',
      accessor: 'template_name',
      sort: true,
      sortType: titleSort,
      Cell: TemplateColumn,
    },
    {
      Header: 'Template Type',
      accessor: 'template_type',
      sort: true,
      Cell: TemplateTypeColumn,
    },
    {
      Header: 'Status',
      accessor: 'is_published',
      sort: true,
      sortType: statusSort,
      Cell: StatusColumn,
    },
    {
      Header: 'Applied To',
      accessor: 'page_applied',
      sort: true,
      sortType: customSort,
      Cell: PageAppliedColumn,
    },
    {
      Header: 'Author',
      accessor: 'merchant_details',
      sort: true,
      Cell: AuthorColumn,
    },
    {
      Header: 'Last Modified',
      accessor: 'updatedAt',
      sort: true,
      Cell: DateColumn,
    },
    {
      Header: 'Actions',
      accessor: 'dataPageBuilderTemplates',
      sort: false,
      classes: 'table-action',
      Cell: ActionColumn,
    },
  ];

  // get template list to display
  const sizePerPageList = [
    {
      text: '10',
      value: 10,
    },
    {
      text: '25',
      value: 25,
    },
    {
      text: '50',
      value: 50,
    },
    {
      text: '100',
      value: 100,
    },
    // {
    //     text: "All",
    //     value: dataPageBuilderTemplates?.pagination?.totalDocs || 1000,
    // },
  ];

  useEffect(() => {
    if (!isPaidPlan) {
      setOpenUpgrade(true);
    }
  }, [isPaidPlan]);

  return (
    <>
      <SectionTitle
        title={'Template Library'}
        popContent={`The Template Library allows you to create and view the templates you have created through the page builder.`}
        //badge={<BetaBadge />}
      />

      <Row className="mb-5">
        <Col xs={12}>
          <Section>
            <div className="d-md-flex align-items-center justify-content-between mb-3">
              <div className="mb-3 mb-md-0">
                <InputGroup>
                  <Form.Control
                    placeholder={t('Search...')}
                    aria-label="Search"
                    aria-describedby="search-input"
                    // className="border-end-0"'
                    onChange={(e) => setDebouncedSearched(e.target.value)}
                  />
                  <InputGroup.Text className="bg-white border-start-0">
                    <Search />
                  </InputGroup.Text>
                </InputGroup>
              </div>
              <div>
                <div>
                  <Can I="create" this={permissionMainModules.pageBuilder}>
                    {/* <DropdownCreateButton productData={products} /> */}
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        storeAccount?.payPlanType === 'FREE'
                          ? setOpenUpgrade(true)
                          : // : setOpenComingSoon(true);
                            (setIsQuickEdit(false),
                            setModalAddNewTemplateTrigger(true));
                      }}
                    >
                      Add Template
                    </button>
                  </Can>
                </div>
              </div>
            </div>
            <Table
              className={`min-height-400`}
              columns={columns}
              data={dataPageBuilderTemplates?.templates || []}
              pageSize={limit}
              sizePerPageList={sizePerPageList}
              isSortable={true}
              pagination={true}
              isSelectable={false}
              isSearchable={false}
              theadClass="table-light"
              searchBoxClass="mb-2"
              rowSelection={(e) => {
                setSelectedRow(e);
              }}
              manualPagination
              totalDocs={dataPageBuilderTemplates?.pagination?.totalDocs}
              setPage={(newPage) => setPage(newPage)}
              page={page}
              onChangePageSize={(newPageSize) => setLimit(newPageSize)}
              isFetching={isFetching}
            />
          </Section>
        </Col>
      </Row>
      <Upgrade
        modalText="Upgrade now to unlock powerful features of our page builder."
        isOpen={openUpgrade}
        closeModal={() => setOpenUpgrade(!openUpgrade)}
        isStatic={true}
      />
      {/*<UpgradeModal isOpen={openUpgrade} closeModal={() => setOpenUpgrade(!openUpgrade)} />*/}
      <ComingSoonModal
        message={
          'Get ready as we unlock powerful features of our page builder.'
        }
        isOpen={openComingSoon}
        closeModal={() => setOpenComingSoon(!openComingSoon)}
      />
      <AddNewTemplateForm
        modalAddNewTemplateTrigger={modalAddNewTemplateTrigger}
        setModalAddNewTemplateTrigger={setModalAddNewTemplateTrigger}
        isQuickEdit={isQuickEdit}
        data={isQuickEdit ? updateData : {}}
      />
      <ConfirmationDialog
        showConfirmation={showDeleteModal}
        handleHideConfirmation={() => handleDeleteModal()}
        handleConfirm={() => handleConfirmDeleteModal()}
        centered
        confirmName="Delete"
        size="md"
        id="deleteTemplateModal"
      >
        <div className="d-flex flex-column align-items-center">
          <div className="d-flex flex-column">
            <p className="text-left mb-3 text-danger fw-bold text-lg">
              {t('Delete Template')}
            </p>
            <p className="text-left">
              {t(
                'Are you sure you want to delete this template? This template will be deleted forever.',
              )}
            </p>
            <p className="text-left">
              {t(`Type "DELETE" in the field below to confirm.`)}
            </p>
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              className={`rounded-1 form-control ${
                isError ? 'is-invalid' : ''
              }`}
              id="page_delete"
            />
            {isError ? (
              <div className="invalid-feedback">
                Please enter DELETE in all caps.
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </ConfirmationDialog>
      <ConfirmationDialog
        showConfirmation={showUnpublishTemplateModal}
        handleHideConfirmation={() => handleUnpublishTemplateModal()}
        handleConfirm={() => handleConfirmUnpublishTemplateModal()}
        centered
        confirmName="Confirm"
        size="sm"
        id="unpublishTemplateModal"
        footerClassName="justify-content-center"
      >
        <div className="d-flex flex-column align-items-center">
          <div className="d-flex flex-column">
            <div className="text-center">
              <ModalWarningIcon />
            </div>
            <p className="text-center my-3 text-black fw-bold text-lg">
              {t('Unpublish Template')}
            </p>
            <p className="text-center">
              {t(
                'You are about to unpublish the template and switch it to a draft template.',
              )}
            </p>
            <p className="text-center">
              {t(
                'Switching to draft will automatically unpublish the template and will no longer be visible on your website.',
              )}
            </p>
            <p className="text-center">{t('Would you like to proceed?')}</p>
          </div>
        </div>
      </ConfirmationDialog>
    </>
  );
};

export default TemplateLibrary;
