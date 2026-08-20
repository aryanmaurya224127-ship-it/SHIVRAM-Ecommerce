

import MainLayout from '../Layout/MainLayout.jsx';
import "bootstrap/dist/css/bootstrap.min.css";
import '../Style/OrderAddress.css'

function OrderAddress() {

  
  return (
    <>
        <MainLayout>
          <div>
        <h2> Contect Detail:</h2>
        <input type="text" placeholder="Name:"/>
        <input type="number" placeholder="Contect Number:"/>

        <h2>Address:</h2>
        <input type="text" placeholder="House no./Building Name:"/>
        <input type="text" placeholder="Road Name/Area/Colony:"/>
        <input type="number" placeholder="PinCode:"/>
        <input type="text" placeholder="City:"/>
          <input type="text" name="nearby" id="detail" placeholder="Nearby Famous Place/Shop/School (optional):" />
        <br />
          <select  id="detail2" name="state">
          <option value="">Select State</option>
          <option value="UP">UP</option>
          <option value="Bihar">Bihar</option>
          <option value="MP">MP</option>
          <option value="Mumbai">Mumbai</option>
        </select><br/>
        
        <button type="submit" id="conform-detail">Save Address and Continue</button>
        </div>
      </MainLayout>
    
    </>
  );
}

export default OrderAddress;
