import { Modal } from 'react-bootstrap';
import timer from '../../../assets/svg/timer.svg';
import CloseIcon from '@mui/icons-material/Close';

const ComingSoonModal = ({
  isOpen,
  closeModal,
  // isPremium,
  // setIsPremium,
  message,
}) => {
  return (
    <Modal show={isOpen} onHide={closeModal} size="sm" centered>
      <div className="d-flex mt-1 justify-content-end">
        <button className="btn btn-link" onClick={closeModal}>
          <CloseIcon />
        </button>
      </div>
      <Modal.Body>
        <div className="d-flex align-items-center mx-3 flex-column mb-3">
          <img src={timer} alt="Coming Soon" />
          <h2 className="fs-2">Coming Soon</h2>
          <p className="text-center">{message}</p>
        </div>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default ComingSoonModal;
