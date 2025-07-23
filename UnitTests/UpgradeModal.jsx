import { Modal, Button } from 'react-bootstrap';
import rocket from '../../../assets/images/rocket.svg';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';

const UpgradeModal = ({ isOpen, closeModal }) => {
  return (
    <Modal show={isOpen} onHide={closeModal} size="sm" centered>
      <div className="d-flex mt-1 justify-content-end">
        <button className="btn btn-link" onClick={closeModal}>
          <CloseIcon />
        </button>
      </div>
      <Modal.Body>
        <div className="d-flex align-items-center mx-3 flex-column">
          <img src={rocket} alt="Upgrade" />
          <h2 className="fs-2">Upgrade Now!</h2>
          <p className="text-center">
            Upgrade now to unlock powerful features of our page builder.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex flex-md-nowrap mx-3 mb-3">
        <Button variant="cancel" className="w-100" onClick={() => closeModal()}>
          Cancel
        </Button>
        <Link
          onClick={() => closeModal()}
          to="/home/billing"
          className="btn btn-success text-white w-100"
        >
          Upgrade Now
        </Link>
      </Modal.Footer>
    </Modal>
  );
};

export default UpgradeModal;
