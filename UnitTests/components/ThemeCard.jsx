import { Form } from 'react-bootstrap';
import blank from '../../../../assets/images/blank.png';

const ThemeCard = ({ selectedTheme, data }) => {
  const Label = () => {
    return (
      <div className="cursor-pointer">
        <div className="thumb">
          {data?.key === 'blank' ? (
            <img
              src={blank}
              className="img-fluid rounded"
              alt={data?.name || ''}
            />
          ) : (
            <img
              src={data?.preview_image_sm}
              className="img-fluid rounded"
              alt={data?.name || ''}
            />
          )}
        </div>
        <div className="text-md text-black fw-semibold p-2">{data?.name}</div>
      </div>
    );
  };
  return (
    <div className="theme-card">
      <Form.Check
        className={`border rounded mb-3 ${
          selectedTheme === data.key ? 'border-primary' : ''
        }`}
        type="radio"
        id={data.key}
        value={data.key}
        name="themeSelection"
        label={<Label />}
        checked={selectedTheme === data.key}
        readOnly
      />
    </div>
  );
};

export default ThemeCard;
