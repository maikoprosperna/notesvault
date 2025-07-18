import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import moment from 'moment';

export const usePdfGenerator = () => {
  const generatePdf = async ({
    elementId,
    fileName,
    logoSelector = 'img[alt="logo"]',
    logoFallbackText = 'Prosperna',
  }) => {
    const element = document.getElementById(elementId);
    if (!element) throw new Error(`Element with id ${elementId} not found`);

    const defaultFileName =
      fileName || `document_${moment().format('MM-DD-YYYY')}.pdf`;

    try {
      // Wait for all images to load before converting
      const images = element.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) {
                resolve();
              } else {
                img.onload = resolve;
                img.onerror = resolve; // Continue even if image fails to load
              }
            }),
        ),
      );

      // Create canvas from HTML with improved settings
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        imageTimeout: 15000, // 15 seconds timeout for images
        onclone: (clonedDoc) => {
          // Ensure logo has proper styling in cloned document
          const clonedLogo = clonedDoc.querySelector(logoSelector);
          if (clonedLogo) {
            clonedLogo.style.height = '50px';
            clonedLogo.style.width = 'auto';
            clonedLogo.style.maxWidth = '350px';
            clonedLogo.style.objectFit = 'contain';
            clonedLogo.style.display = 'block';
            // Add error handling for logo
            clonedLogo.onerror = () => {
              const logoContainer = clonedLogo.parentElement;
              if (logoContainer) {
                logoContainer.innerHTML = `<div style="font-size: 18px; font-weight: bold; color: #333; height: 30px; display: flex; align-items: center;">${logoFallbackText}</div>`;
              }
            };
          }
        },
      });

      // Create PDF
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgWidth = 297; // A4 landscape width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth - 20, imgHeight - 20); // Add padding

      // Save PDF
      pdf.save(defaultFileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };

  const convertInvoiceToPdf = async ({
    singleDetails,
    elementId = 'htmlContent',
  }) => {
    const fileName = singleDetails?.invoice_due_date
      ? `P1_Paid_Plan_${moment(singleDetails?.invoice_due_date).format('MM-DD-YYYY')}.pdf`
      : 'invoice.pdf';
    try {
      await generatePdf({
        elementId,
        fileName,
        logoSelector: 'img[alt="logo"]',
        logoFallbackText: 'Prosperna',
      });
    } catch (error) {
      console.error('Failed to generate invoice PDF:', error);
    }
  };

  return { generatePdf, convertInvoiceToPdf };
};
