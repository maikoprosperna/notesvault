import React, { useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  permissionMainModules,
  permissionSubjects,
} from '../../../helpers/permissions/modules';
import { Can } from '../../../components/Can/Can';
// import { Link } from "react-router-dom";
import Table from '../../../components/Table';
import {
  // Card,
  Col,
  Form,
  InputGroup,
  OverlayTrigger,
  Row,
  Tooltip,
  Dropdown,
} from 'react-bootstrap';
import { Section } from '../../../components/Shared/Custom/utilities';
import { Search } from '@mui/icons-material';
import SectionTitle from '../../../components/SectionTitle';
import classNames from 'classnames';
// import { pageBuilderLinks } from "../../../constants/pageBuilderLinks";
// import { SplashScreen } from "../../../components/Shared/Custom/SplashScreen";
// import { isUpgradedPlanChecker } from "../../../utils";
// import Upgrade from "../../../Partials/Upgrade";
import { useSelector } from 'react-redux';
import { PageBuilderAPI } from '../../../api/BusinessProfile/PageBuilder';
import UpgradeModal from './UpgradeModal';
import ComingSoonModal from './ComingSoonModal';
import moment from 'moment';
import _ from 'lodash';
import { useSidebarSelector } from '../../../hooks/useSidebarSelector';
import { AddNewPageForm } from './AddNewPageForm';
import { MoreHoriz, Home } from '@mui/icons-material';
import MyNotification from '../../../components/Shared/Custom/notification';
import { ConfirmationDialog } from '../../../components/ConfirmationDialog/ConfirmationDialog';
import ThemeSelectorModal from './components/ThemeSelectorModal';
import { useSearchParams } from 'react-router-dom';
import IconCrown from '../../../components/IconCrown';
import warningIcon from '../../../assets/images/warning.svg';
import AppButton from '../../../components/AppButton/AppButton';
import { useTrackingEvent } from '../../../hooks/useTrackingEvent';
// import FormTextField from "../../../components/BootstrapFormik/FormTextField";

const PageBuilder = () => {
  const { track } = useTrackingEvent();
  const storeAccount = useSelector((state) => state.account.storeDetails);

  const isPaidPlan = storeAccount?.payPlanType === 'FREE' ? false : true;

  useSidebarSelector(permissionSubjects.pageBuilder);

  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  const [search, setSearch] = useState('');
  const {
    data: dataPageBuilderPages,
    page,
    setPage,
    limit,
    setLimit,
    isFetching,
    // isFetched: isFetchedPageBuilderPages,
  } = PageBuilderAPI.useGetPageBuilderPages({
    search,
  });
  console.log('dataPageBuilderPages:', dataPageBuilderPages.pages);

  const { t } = useTranslation();
  // Selected Rows
  // eslint-disable-next-line no-unused-vars
  const [selectedRow, setSelectedRow] = useState(0);
  // Search State
  //Upgrade Modal
  const [openUpgrade, setOpenUpgrade] = useState(false);
  const [openComingSoon, setOpenComingSoon] = useState(false);

  //Modal Add New Page trigger
  const [modalAddNewPageTrigger, setModalAddNewPageTrigger] = useState(false);

  const [isQuickEdit, setIsQuickEdit] = useState(false);
  const [isPageNameEditable, setIsPageNameEditable] = useState(false);
  const [updateData, setUpdateData] = useState({});

  const [themeModalTrigger, setThemeModalTrigger] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [applyToAllStandardPages, setApplyToAllStandardPages] = useState(false);

  //Modal Delete Page trigger
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isError, setIsError] = useState(false);
  const [pageID, setPageID] = useState('');

  const [publishWarning, setPublishWarning] = useState(false);
  const [wantToUnPublishData, setWantToUnPublishData] = useState('');

  useEffect(() => {
    // if type theme available on url params and paid plan open themes modal else open upgrade modal
    if (type === 'theme') {
      if (isPaidPlan) {
        setThemeModalTrigger(true);
      } else {
        setOpenUpgrade(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
    setInputValue('');
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
      deletePagePermanently.mutate(pageID);
    }
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

  const updatePageStatus = PageBuilderAPI.useUpdatePageStatus({
    onSuccess: (data) => {
      MyNotification(true, '', data.message);
      setModalAddNewPageTrigger(false);
      setPublishWarning(false);
    },
    onError: (error) => {
      MyNotification(false, '', error);
    },
  });

  const deletePage = PageBuilderAPI.useDeletePage({
    onSuccess: (data) => {
      MyNotification(true, '', data.message);
    },
    onError: (error) => {
      MyNotification(false, '', error);
    },
  });

  const deletePagePermanently = PageBuilderAPI.useDeletePagePermanently({
    onSuccess: (data) => {
      MyNotification(true, '', data.message);
    },
    onError: (error) => {
      MyNotification(false, '', error);
    },
  });

  const restorePage = PageBuilderAPI.useRestorePage({
    onSuccess: (data) => {
      MyNotification(true, '', data.message);
      setModalAddNewPageTrigger(false);
    },
    onError: (error) => {
      MyNotification(false, '', error);
    },
  });

  const checkIfPaidPage = (pageName) => {
    const freePages = [
      'Error',
      'Single Product',
      'Thank you',
      'Cart',
      'Checkout',
      'Products',
    ];

    return freePages.includes(pageName) ? false : true;
  };

  /* page column render */
  const PageColumn = ({ row, value }) => {
    const valueMap = {
      Products: 'Product Listing',
      'Thank you': 'Thank You',
    };
    const displayValue = valueMap[value] || value;

    return (
      <>
        <span className="fw-bold">
          <span className="me-2">{displayValue}</span>
          <span>
            {checkIfPaidPage(row?.original?.page_name) && !isPaidPlan ? (
              <IconCrown />
            ) : (
              ''
            )}{' '}
            {row?.original?.is_homepage && (
              <span>
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="button-tooltip">
                      {t('This is your Home Page.')}
                    </Tooltip>
                  }
                >
                  <Home className="text-primary" />
                </OverlayTrigger>
              </span>
            )}
          </span>
        </span>
      </>
    );
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

  const excludeTrashPagName = [
    'Products',
    'Cart',
    'Checkout',
    'Error',
    'Single Product',
    'Thank you',
    'Maintenance',
    'Home',
    'Homepage',
    'Terms of Service',
    'About Us',
    'Privacy Policy',
    'Contact Us',
    'Blogs',
    'Return Policy',
  ];

  const excludeEditSlugs = [
    '/error',
    '/checkout/thank-you',
    '/checkout',
    '/cart',
    '/products',
  ];

  const excludeQuickEditSlugs = !isPaidPlan
    ? ['/error', '/checkout/thank-you', '/checkout', '/cart', '/products']
    : ['/error', '/checkout/thank-you', '/checkout', '/cart'];

  const excludePublishSlugs = [
    '/error',
    '/checkout/thank-you',
    '/checkout',
    '/cart',
    '/products',
  ];

  const comingSoonSlugs = ['/maintenance-page'];

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

    const excludeTrash = excludeTrashPagName?.some(
      (page_name) => row?.original?.page_name === page_name,
    );
    // const isHomePage = row?.original?.page_name === "Home" || row?.original?.page_name === "Homepage"; // TODO: remove Homepage once changes in the backend are in prod.
    // const isContactUsPage = row?.original?.page_name?.includes("Contact Us");
    // const isProductPage = row?.original?.page_name?.includes("Products");
    //const isBlogPage = row?.original?.page_name === "Blogs";
    const isSingleProducts = row?.original?.page_name === 'Single Product';
    // const isExcludePage =
    //     row?.original?.page_name?.toLowerCase() === "privacy policy" ||
    //     row?.original?.page_name?.toLowerCase() === "terms of service" ||
    //     row?.original?.page_name?.toLowerCase() === "maintenance" ||
    //     row?.original?.page_name?.toLowerCase() === "about us";

    // const isExcludePageSEO =
    //     row?.original?.page_name?.includes("Error") ||
    //     row?.original?.page_name?.includes("Single Product") ||
    //     row?.original?.page_name?.includes("Thank you") ||
    //     row?.original?.page_name?.includes("Cart") ||
    //     row?.original?.page_name?.includes("Checkout");

    const excludeEdit = excludeEditSlugs.some(
      (slug) => row?.original?.slug === slug,
    );

    const excludeQuickEdit = isSingleProducts
      ? true
      : excludeQuickEditSlugs.some((slug) => row?.original?.slug === slug);

    const excludePublish = isSingleProducts
      ? true
      : excludePublishSlugs.some((slug) => row?.original?.slug === slug);

    const isComingSoonPages = comingSoonSlugs.some(
      (slug) => row?.original?.slug === slug,
    );

    return (
      <>
        <Dropdown className="fit-content">
          {isComingSoonPages ? (
            <Dropdown.Toggle as={CustomToggle}>
              <MoreHoriz onClick={() => setOpenComingSoon(true)} />
            </Dropdown.Toggle>
          ) : (
            <>
              <Dropdown.Toggle as={CustomToggle}>
                <MoreHoriz />
              </Dropdown.Toggle>

              <Dropdown.Menu className="min-w-100">
                {!row?.original?.is_trashed && (
                  <>
                    <Dropdown.Item
                      eventKey="1"
                      onClick={() =>
                        !isPaidPlan && checkIfPaidPage(row?.original?.page_name)
                          ? window.open(
                              `${redirectStoreUrl()}${
                                row?.original?.is_published
                                  ? row?.original?.slug
                                  : '/preview' + row?.original?.slug
                              }`,
                              '_blank',
                            )
                          : window.open(
                              `${redirectStoreUrl()}${
                                row?.original?.is_published
                                  ? row?.original?.slug
                                  : '/preview' + row?.original?.slug
                              }`,
                              '_blank',
                            )
                      }
                      //disabled={!excludePublish}
                    >
                      {row?.original?.is_published ? 'View' : 'Preview'}
                    </Dropdown.Item>

                    {!excludePublish && (
                      <Dropdown.Item
                        eventKey="2"
                        onClick={() => {
                          setWantToUnPublishData(row?.original);
                          !isPaidPlan &&
                          checkIfPaidPage(row?.original?.page_name)
                            ? setOpenUpgrade(true)
                            : row?.original?.is_homepage
                              ? setPublishWarning(true)
                              : updatePageStatus.mutateAsync({
                                  id: [row.original.id],
                                  action: row?.original?.is_published
                                    ? 'unpublish'
                                    : 'publish',
                                });
                        }}
                        // disabled={isDefaultPage && !isHomePage && !isContactUsPage}
                      >
                        {row?.original?.is_published ? 'Unpublish' : 'Publish'}
                      </Dropdown.Item>
                    )}

                    {!excludeQuickEdit && (
                      <Dropdown.Item
                        eventKey="3"
                        onClick={() => {
                          !isPaidPlan &&
                          checkIfPaidPage(row?.original?.page_name)
                            ? setOpenUpgrade(true)
                            : (setIsQuickEdit(true),
                              setIsPageNameEditable(
                                excludeTrash ? false : true,
                              ),
                              setModalAddNewPageTrigger(true),
                              setUpdateData(row?.original));
                        }}
                        //disabled={isExcludePageSEO || isExcludeEditWhenFree}
                      >
                        Quick Edit
                      </Dropdown.Item>
                    )}

                    {!excludeEdit && ( //remove edit action for these pages
                      <Dropdown.Item
                        eventKey="4"
                        //disabled={isDefaultPage && !isHomePage && !isContactUsPage}
                        onClick={() =>
                          !isPaidPlan &&
                          checkIfPaidPage(row?.original?.page_name)
                            ? setOpenUpgrade(true)
                            : window.open(
                                `/builder${row?.original?.slug}`,
                                '_blank',
                              )
                        }
                      >
                        Edit
                      </Dropdown.Item>
                    )}
                  </>
                )}

                {row?.original?.is_trashed ? (
                  <>
                    <Dropdown.Item
                      eventKey="5"
                      onClick={() =>
                        restorePage.mutateAsync({
                          id: row?.original?.id,
                        })
                      }
                    >
                      Restore Page
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey="5"
                      onClick={() => {
                        setShowDeleteModal(true);
                        setPageID(row?.original?.id);
                        setIsError(false);
                      }}
                    >
                      Delete Permanently
                    </Dropdown.Item>
                  </>
                ) : (
                  <>
                    {!excludeTrash && (
                      <Dropdown.Item
                        eventKey="5"
                        onClick={() =>
                          !isPaidPlan &&
                          checkIfPaidPage(row?.original?.page_name)
                            ? setOpenUpgrade(true)
                            : deletePage.mutateAsync({
                                id: row?.original?.id,
                              })
                        }
                      >
                        Trash
                      </Dropdown.Item>
                    )}
                  </>
                )}
              </Dropdown.Menu>
            </>
          )}
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
      Header: 'Title',
      accessor: 'page_name',
      sort: true,
      sortType: titleSort,
      Cell: PageColumn,
    },
    {
      Header: 'Status',
      accessor: 'is_published',
      sort: true,
      sortType: statusSort,
      Cell: StatusColumn,
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
      // accessor: "dataPageBuilderPages",
      sort: false,
      classes: 'table-action',
      Cell: ActionColumn,
    },
  ];

  // get pagelist to display
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
    //     value: dataPageBuilderPages?.pagination?.totalDocs || 1000,
    // },
  ];

  return (
    <>
      <SectionTitle
        title={'Page Builder'}
        popContent={`View the list of standard available pages and pages you have created in the page builder.`}
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
                            (setIsQuickEdit(false), setThemeModalTrigger(true));
                        track('P1: Add New Page');
                      }}
                    >
                      Add Page
                    </button>
                  </Can>
                </div>
              </div>
            </div>
            <Table
              className={`min-height-400`}
              columns={columns}
              data={dataPageBuilderPages?.pages || []}
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
              totalDocs={dataPageBuilderPages?.pagination?.totalDocs}
              setPage={(newPage) => setPage(newPage)}
              page={page}
              onChangePageSize={(newPageSize) => setLimit(newPageSize)}
              isFetching={isFetching}
            />
          </Section>
        </Col>
      </Row>
      <UpgradeModal
        isOpen={openUpgrade}
        closeModal={() => setOpenUpgrade(!openUpgrade)}
      />
      <ComingSoonModal
        message={
          'Get ready as we unlock powerful features of our page builder.'
        }
        isOpen={openComingSoon}
        closeModal={() => setOpenComingSoon(!openComingSoon)}
      />
      <ThemeSelectorModal
        showModal={themeModalTrigger}
        setShowModal={setThemeModalTrigger}
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
        applyToAllStandardPages={applyToAllStandardPages}
        setApplyToAllStandardPages={setApplyToAllStandardPages}
        setModalAddNewPageTrigger={setModalAddNewPageTrigger}
      />
      <AddNewPageForm
        modalAddNewPageTrigger={modalAddNewPageTrigger}
        setModalAddNewPageTrigger={setModalAddNewPageTrigger}
        isQuickEdit={isQuickEdit}
        isPageNameEditable={isPageNameEditable}
        data={isQuickEdit ? updateData : {}}
        selectedTheme={selectedTheme}
        applyToAllStandardPages={applyToAllStandardPages}
      />
      <ConfirmationDialog
        showConfirmation={showDeleteModal}
        handleHideConfirmation={() => handleDeleteModal()}
        handleConfirm={() => handleConfirmDeleteModal()}
        centered
        confirmName="Delete"
        size="md"
        id="deletePageModal"
      >
        <div className="d-flex flex-column align-items-center">
          <div className="d-flex flex-column">
            <p className="text-left mb-3 text-danger fw-bold text-lg">
              {t('Deleting Page')}
            </p>
            <p className="text-left">
              {t(
                'Are you sure you want to delete this page? This page will be deleted forever.',
              )}
            </p>
            <p className="text-left">
              {t(`Type "DELETE" in the field below to confirm.`)}
            </p>
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              className={`rounded-1 form-control ${isError ? 'is-invalid' : ''}`}
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
        showConfirmation={publishWarning}
        handleHideConfirmation={() => setPublishWarning(false)}
        noConfirmButton
        noCancelButton
        centered
        size="sm"
        footerClassName="d-none"
      >
        <div className="d-flex flex-column align-items-center px-1 py-3">
          <img src={warningIcon} className="mb-2" />
          <p className="fw-semibold text-lg text-black">Unpublish Homepage</p>
          <div className="text-center text-sm">
            <p>
              {t(
                `You are about to unpublish ${wantToUnPublishData?.page_name}. Unpublishing the page will remove it from customer’s view and will make it inaccessible.`,
              )}
            </p>
            <p>{t('Would you like to proceed?')}</p>
          </div>
          <div className="text-center d-flex gap-2">
            <AppButton
              variant="cancel"
              className="mt-3"
              onClick={() => setPublishWarning(false)}
            >
              Cancel
            </AppButton>
            <AppButton
              variant="primary"
              className="mt-3"
              onClick={() => {
                updatePageStatus.mutateAsync({
                  id: [wantToUnPublishData.id],
                  action: 'unpublish',
                });
              }}
            >
              Confirm
            </AppButton>
          </div>
        </div>
      </ConfirmationDialog>
    </>
  );
};

export default PageBuilder;
