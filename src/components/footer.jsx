/**
 * footer.jsx
 * Main footer component with navigation and utility sections.
 *
 * @module Footer
 * @description Compositional container component that combines
 * FooterNav (navigation bar) and UtilityComponent (expandable
 * utility section). Serves as the primary footer for all pages.
 *
 * Composition:
 * - UtilityComponent: Expandable utility section for dynamic content
 * - FooterNav: Fixed navigation bar with App, Search, Settings, Support
 *
 * Props Flow:
 * - props.utilityTags → UtilityComponent.tags (utility content)
 * - props.onClick → FooterNav.onClick (search click handler)
 *
 * Styling:
 * - Uses Bootstrap utility classes (d-flex, align-items-center, etc.)
 * - Inline style with zIndex: "10" for stacking context
 * - footer-nav-container class for nav styling
 * - shadow-lg for elevation effect
 *
 * DOM Structure:
 * - div (outer container, centered with flex)
 *   - UtilityComponent (expandable utility section)
 *   - footer.footer-nav-container (navigation bar)
 *     - FooterNav (navigation links)
 *
 * @example
 * import Footer from '../components/footer';
 * // In JSX:
 * <Footer
 *   utilityTags={<div>Custom content</div>}
 *   onClick={handleSearchClick}
 * />
 */
import React from "react";
import FooterNav from "./footerNav";
import UtilityComponent from "./utilityFooterComponet";

/**
 * Footer React functional component.
 * Renders the main footer with utility section and navigation.
 *
 * @param {Object} props - Component properties
 * @param {(string|JSX.Element)} [props.utilityTags] - Content for utility section
 * @param {Function} [props.onClick] - Click handler passed to FooterNav for search
 * @returns {JSX.Element} Footer with utility section and navigation bar
 */
const Footer = (props) => {
  // z-index ensures footer stays above page content during animations
  const customFooterStyle = {
    zIndex: "10",
  };
  return (
    <div
      className="m-auto d-flex align-items-center justify-content-center "
      style={customFooterStyle}
    >
      <UtilityComponent tags={props.utilityTags}/>
      <footer className="shadow-lg d-flex align-items-center justify-content-center footer-nav-container">
        <FooterNav onClick={props.onClick}/>
      </footer>
    </div>
  );
};

export default Footer;
