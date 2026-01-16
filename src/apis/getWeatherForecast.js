import jQuery from "jquery";
import {db} from "./../backend/app_backend";



export const getWeatherForecast = () =>{
    jQuery(($)=>{
        $.noConflict();
        // Security: API key loaded from environment variable (CWE-798 remediation)
        const $API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
        $.ajax({
            url:`https://api.openweathermap.org/data/2.5/forecast?q=Nigeria&appid=${$API_KEY}`,
            success: (result, status, xhr) =>{
                if(result.cod == 200)
                {
                   //console.log(result);
                   return result;
                }

               
            },
    

            error: (xhr, status, error) =>{
                console.log(error);
            }
        });
    
    
    })
    
}
