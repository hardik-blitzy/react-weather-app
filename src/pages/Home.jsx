/**
 * Home.jsx
 * Onboarding/landing page for first-time users.
 *
 * @module Home
 * @description First page shown to new users before they have
 * set up their default location. Handles the initial onboarding
 * experience including:
 * - Welcome messaging and app introduction
 * - Default location input via SweetAlert2 modal
 * - Initial localStorage setup for user preferences
 * - Navigation to weather page after onboarding
 *
 * Route: / (root path for new users)
 *
 * localStorage keys created:
 * - HOME_PAGE_SEEN: boolean - Marks onboarding complete
 * - USER_DEFAULT_LOCATION: string - User's preferred location
 * - TRACK_SAVED_LOCATION_WEATHER: boolean - Auto-tracking preference
 * - WEATHER_UNIT: string - Temperature unit (defaults to "metric")
 *
 * Flow:
 * 1. User sees welcome screen with "today's weather" button
 * 2. Click triggers SweetAlert2 modal for location input
 * 3. Valid location saves preferences and navigates to /weather
 * 4. Invalid/empty input shows error and prompts retry
 *
 * @see ../backend/app_backend - Database (db) for localStorage
 * @see ../App.js - Router configuration
 */

import React from "react";
import Button from "./../components/button";
import Img_1 from "./../assets/pic_1.png";
import Spinner from "./../components/spinner";
import navigate from "./../inc/scripts/utilities";
import { db } from "./../backend/app_backend";
import Swal from "sweetalert2";
import jQuery from "jquery";

/**
 * Home page React functional component.
 * Renders onboarding UI for first-time users.
 *
 * @returns {JSX.Element} Onboarding page with location setup
 */
const Home = () => {
  const customBtnStyle = {
    fontSize: "18px",
  };

  /**
   * Handles the "today's weather" button click.
   * Opens a SweetAlert2 modal for default location input,
   * validates the input, and sets up initial user preferences.
   *
   * On valid input:
   * - Sets HOME_PAGE_SEEN = true (prevents returning to onboarding)
   * - Saves USER_DEFAULT_LOCATION with entered value
   * - Sets TRACK_SAVED_LOCATION_WEATHER = false (default)
   * - Sets WEATHER_UNIT = "metric" (Celsius)
   * - Navigates to /weather page
   *
   * On invalid input:
   * - Shows error modal with 4-second timer
   *
   * @returns {void}
   */
  function click() {
    Swal.fire({
      title: "Default Location",
      html: "<input type='text' placeholder='Enter location' class='form-control border-1 p-3 brand-small-text w-100' id='defaultLocation'>",
      confirmButtonText: "Save Location",
      confirmButtonColor: "rgb(83, 166, 250)",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    }).then((willProceed) => {
      if (willProceed.isConfirmed) {
        jQuery(($) => {
          $.noConflict();
          const $defaultLocation = $("#defaultLocation").val().trim();

          if ($defaultLocation === undefined || $defaultLocation == "") {
            Swal.fire({
              title: "Invalid Location!",
              html: "<p class=' text-center text-danger'>Please enter a valid location</p>",
              confirmButtonColor: "rgb(83, 166, 250)",
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
              timer: 4000,
            });
          } else {
            Swal.fire({
              text: "Location saved successfully!",
              icon: "success",
              toast: true,
              position: "top",
              showConfirmButton: false,
              timer: 3000,
            });

            // Initialize user preferences in localStorage
            // These values persist across sessions and control app behavior
            db.create("HOME_PAGE_SEEN", true);
            db.create("USER_DEFAULT_LOCATION", $defaultLocation);
            db.create("TRACK_SAVED_LOCATION_WEATHER",false);
            db.create("WEATHER_UNIT","metric");
            navigate("weather");
          }
        });
      }
    });
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
