import { useEffect } from "react";
import { FiX } from "react-icons/fi";

const SizeGuideModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="quickview-overlay" onClick={onClose}>
      <div className="sizeguide-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quickview-close" onClick={onClose}>
          <FiX size={20} />
        </button>

        <h2>Size Guide</h2>

        <div className="sizeguide-section">
          <h3>Unstitched Fabric Measurements</h3>
          <table className="sizeguide-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Shirt Length</th>
                <th>Shirt Chest</th>
                <th>Shalwar Length</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Small</td>
                <td>40"</td>
                <td>42"</td>
                <td>38"</td>
              </tr>
              <tr>
                <td>Medium</td>
                <td>42"</td>
                <td>44"</td>
                <td>40"</td>
              </tr>
              <tr>
                <td>Large</td>
                <td>44"</td>
                <td>46"</td>
                <td>42"</td>
              </tr>
              <tr>
                <td>XL</td>
                <td>46"</td>
                <td>48"</td>
                <td>44"</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="sizeguide-section">
          <h3>How to Measure</h3>
          <ul className="sizeguide-list">
            <li><strong>Length:</strong> Measure from shoulder to desired length</li>
            <li><strong>Chest:</strong> Measure around the fullest part of chest</li>
            <li><strong>Waist:</strong> Measure around natural waistline</li>
            <li><strong>Allowance:</strong> Our fabrics include 2-3 inch allowance for adjustments</li>
          </ul>
        </div>

        <div className="sizeguide-section">
          <h3>Fabric Care Instructions</h3>
          <ul className="sizeguide-list">
            <li>Hand wash recommended for delicate fabrics</li>
            <li>Use mild detergent</li>
            <li>Avoid direct sunlight when drying</li>
            <li>Iron on low heat setting</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
