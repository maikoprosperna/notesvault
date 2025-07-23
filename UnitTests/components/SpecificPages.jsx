import { Form } from 'react-bootstrap';

const SpecificPages = ({ id, label, slug, fields, setFieldValue, values }) => {
  return (
    <div className="d-flex justify-content-between align-items-center my-2">
      <Form.Check
        type="checkbox"
        label={label}
        // checked={values.selected_pages.some((page) => page.page_name === label)}
        // onChange={() => {
        //     const currentSelectedPages = values[fields.selected_pages.id] || []; // Get the current selected pages array
        //     const newSelectedPages = currentSelectedPages.some((page) => page.page_id === id) // Check if the page is already selected
        //         ? currentSelectedPages.filter((page) => page.page_id !== id) // If already selected, remove it
        //         : [...currentSelectedPages, { page_id: id, slug: slug, page_name: label }]; // Otherwise, add it to the array
        //     setFieldValue(fields.selected_pages.id, newSelectedPages); // Update the selected pages field
        // }}
        checked={values.selected_pages.some((page) => page.page_name === label)}
        onChange={() => {
          const isChecked = values.selected_pages.some(
            (page) => page.page_name === label,
          );
          if (isChecked) {
            // Checkbox is checked, remove the corresponding data from the list of selected pages
            const updatedSelectedPages = values.selected_pages.filter(
              (page) => page.page_name !== label,
            );
            setFieldValue(fields.selected_pages.id, updatedSelectedPages);
          } else {
            // Checkbox is unchecked, add the corresponding data to the list of selected pages
            const newSelectedPages = [
              ...values.selected_pages,
              { page_id: id, slug: slug, page_name: label },
            ];
            setFieldValue(fields.selected_pages.id, newSelectedPages);
          }
        }}
      />
    </div>
  );
};

export default SpecificPages;
