/**
 * 404.jsx
 * Not Found page component for invalid routes.
 *
 * @module NotFound
 * @description Displays when users navigate to non-existent routes.
 * Provides a user-friendly error message and navigation back to
 * the main weather page. Configured as catch-all route (* path)
 * in App.js router configuration.
 *
 * Route: /* (catch-all for unmatched routes)
 *
 * @example
 * // In App.js router configuration:
 * <Route path="*" element={<NotFound />} />
 *
 * @see ../App.js - Router configuration with 404 route
 */

import React from "react";
import Button from "../components/button";
import navigate from "../inc/scripts/utilities";
import Spinner from "../components/spinner";

/**
 * NotFound React functional component.
 * Renders a 404 error page with navigation back to home.
 *
 * @returns {JSX.Element} 404 page with error message and home button
 */
const NotFound = ()=>{
    
    /**
     * Navigates user back to the main weather page.
     * Called when user clicks the "Home" button.
     *
     * @returns {void}
     */
    const returnHome = ()=>{
        navigate("/weather");
    }
    return (
        <React.Fragment>
            <Spinner/>
                <section className="container-fluid d-flex flex-column align-items-center justify-content-center" style={{minHeight:"100vh"}}>
                        <h2 className="text-capitalize my-3 fs-3 fw-bold text-center">not found!</h2>

                        <p className="text-muted text-capitalize text-center">the page requested for was not found!</p>

                        <section className="d-flex align-items-center justify-content-center">
                            <Button text="Home" className="brand-btn m-auto my-5 width-toggle" onClick={returnHome}/>
                        </section>
                </section>
        </React.Fragment>
    )
}

export default NotFound;