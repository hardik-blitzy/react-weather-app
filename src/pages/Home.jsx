/**
 * Home Page Component
 * 
 * Landing page for first-time users. Prompts for default location
 * and initializes user preferences in the database.
 * Uses centralized toast helper for consistent success/error notifications.
 * 
 * @component Home
 */

import React from "react";
import Button from "./../components/button";
import Img_1 from "./../assets/pic_1.png";
import Spinner from "./../components/spinner";
import navigate from "./../inc/scripts/utilities";
import { db } from "./../backend/app_backend";
import Swal from "sweetalert2";
import { showSuccess, showError } from "../utils/toastHelper";
import jQuery from "jquery";

const Home = () => {
  const customBtnStyle = {
    fontSize: "18px",
  };

  /**
   * Handles the initial location setup click event.
   * Opens a modal to collect user's default location, validates input,
   * and initializes user preferences in the database.
   */
  function click() {
    try {
      Swal.fire({
        title: "Default Location",
        html: "<input type='text' placeholder='Enter location' class='form-control border-1 p-3 brand-small-text w-100' id='defaultLocation'>",
        confirmButtonText: "Save Location",
        confirmButtonColor: "rgb(83, 166, 250)",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      }).then((willProceed) => {
        try {
          if (willProceed.isConfirmed) {
            jQuery(($) => {
              try {
                $.noConflict();
                const locationValue = $("#defaultLocation").val();
                const $defaultLocation = locationValue ? locationValue.trim() : "";

                if ($defaultLocation === undefined || $defaultLocation === "") {
                  // Validation failed - show error toast notification
                  showError("Please enter a valid location");
                } else {
                  // Validation passed - show success toast and initialize user data
                  showSuccess("Location saved successfully!", 3000);

                  // Initialize user preferences in the database with error handling
                  try {
                    db.create("HOME_PAGE_SEEN", true);
                    db.create("USER_DEFAULT_LOCATION", $defaultLocation);
                    db.create("TRACK_SAVED_LOCATION_WEATHER", false);
                    db.create("WEATHER_UNIT", "metric");
                  } catch (dbError) {
                    // Continue with navigation even if some db operations fail
                    showError("Some settings may not have been saved.");
                  }
                  
                  try {
                    navigate("weather");
                  } catch (navError) {
                    // Fallback navigation
                    window.location.href = "/weather";
                  }
                }
              } catch (jqueryError) {
                showError("Failed to save location. Please try again.");
              }
            });
          }
        } catch (proceedError) {
          showError("An error occurred. Please try again.");
        }
      }).catch((swalError) => {
        showError("Failed to open location dialog. Please refresh the page.");
      });
    } catch (error) {
      showError("An unexpected error occurred. Please refresh the page.");
    }
  }

  return (
    <React.Fragment>
      <Spinner />
      <div className="weather-preloader container-fluid d-flex align-items-center flex-column">
        <main className="my-5 preloader-weather-heading">
          <h2 className="text-center text-capitalize m-auto fw-bold fs-2">
            How's today's weather?
          </h2>
        </main>

        <section
          className="m-auto text-center img-container my-md-4 my-3"
          id="img-container"
        >
          <img
            src={Img_1}
            className="img-fluid m-auto preloader-img"
            height="700"
            width="550"
            alt="current-weather-status"
          />
        </section>

        <br />
        <br />
        <br />
        <br />
        <br />

        <Button
          text="today's weather"
          style={customBtnStyle}
          className="brand-btn m-auto my-5 width-toggle"
          onClick={(event) => {
            click(event);
          }}
        />
      </div>
    </React.Fragment>
  );
};

export default Home;
