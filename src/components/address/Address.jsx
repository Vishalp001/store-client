import React, {useState} from 'react';
import './address.scss';
import {
  MdOutlineRadioButtonUnchecked,
  MdRadioButtonChecked,
} from 'react-icons/md';
import {staetArray} from '../../helpers/stateArray';
import {setKeyToLocalStorage} from '../../helpers/common';
import {addAddressApi} from '../../services/apis';
import {useGlobalState} from '../../store/global.ts';

const Address = () => {
  const state = useGlobalState();

  const userId = state.getUser().value?._id;

  const allAdressValue = state.getUser().value?.address;
  // console.log(allAdress);

  const [isChecked, setisChecked] = useState(null);
  const [addAddress, setAddAddress] = useState(false);
  const handleAddress = (id) => {
    state.setOrder({shippingAddress: id});
    setisChecked(id);
    console.log(id);
  };
  const newAddrss = () => {
    setAddAddress(!addAddress);
  };

  // -------------------------------------------

  const [allAddress, setAllAddress] = useState(true);

  const [singleAddress, setsingleAddress] = useState({});

  const selectAddress = (address) => {
    setAllAddress(false);
    setsingleAddress(allAdressValue.filter((item) => item._id === address));
    const setOrderStep = state.getOrderStep().value;

    state.setOrderStep({
      ...setOrderStep,
      address: true,
    });
  };

  // -------------------------------------------

  // Add New Address
  const [addressValue, setAddressValue] = useState({
    newAddress: {
      name: '',
      mobileNo: '',
      pincode: '',
      locality: '',
      area: '',
      city: '',
      state: '',
      landmark: '',
      alternatePhoneNo: '',
      addressType: '',
    },
  });

  const handleChange = (e) => {
    e.preventDefault();
    // console.log(e.target.value);
    const {name, value} = e.target;
    setAddressValue({
      newAddress: {
        ...addressValue.newAddress,
        [name]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = addressValue;
      // const res = await Axios.post(`/user/${userId}/addresses`, submitData);
      const res = await addAddressApi(userId, submitData);
      // console.log(res);
      setAddAddress(false);

      if (res.status === 200) {
        state.setUser(res.data.user);
        setKeyToLocalStorage('user', res.data.user);
      } else {
        console.log('Not working');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='addressContainer'>
        <div className='header'>
          <span className='number'>1</span>
          <span className='heading'>Delivery Address</span>
        </div>
        <div className='addresses'>
          {allAddress ? (
            <>
              {allAdressValue?.map((item) => (
                <div
                  key={item._id}
                  className='address'
                  style={isChecked === item._id ? {background: '#f5faff'} : {}}>
                  <label htmlFor={item._id}>
                    <div
                      onClick={() => handleAddress(item._id)}
                      className='addressInner'>
                      {isChecked === item._id ? (
                        <MdRadioButtonChecked />
                      ) : (
                        <MdOutlineRadioButtonUnchecked />
                      )}
                      <div className='addressItem'>
                        <div className='addressRowOne'>
                          <span className='name'>{item.name}</span>
                          <span className='addressType'>
                            {item.addressType}
                          </span>
                          <span className='mobileNo'>{item.mobileNo}</span>
                        </div>
                        <div className='addressRowTwo'>
                          {item.area}, {item.landmark}, {item.locality},{' '}
                          {item.city},{item.state} - <b>{item.pincode}</b>
                        </div>
                      </div>
                    </div>
                    {isChecked === item._id && (
                      <button
                        className='delever'
                        onClick={() => selectAddress(item._id)}>
                        Deliver Here
                      </button>
                    )}
                    {/* <div className='editBtn'>Edit</div> */}
                  </label>
                </div>
              ))}
            </>
          ) : (
            <div
              key={singleAddress[0]?._id}
              className='address'
              style={
                isChecked === singleAddress[0]?._id
                  ? {background: '#f5faff'}
                  : {}
              }>
              <label htmlFor={singleAddress[0]?._id}>
                <div
                  onClick={() => handleAddress(singleAddress[0]?._id)}
                  className='addressInner'>
                  {isChecked === singleAddress[0]?._id ? (
                    <MdRadioButtonChecked />
                  ) : (
                    <MdOutlineRadioButtonUnchecked />
                  )}
                  <div className='addressItem'>
                    <div className='addressRowOne'>
                      <span className='name'>{singleAddress[0]?.name}</span>
                      <span className='addressType'>
                        {singleAddress[0]?.addressType}
                      </span>
                      <span className='mobileNo'>
                        {singleAddress[0]?.mobileNo}
                      </span>
                    </div>
                    <div className='addressRowTwo'>
                      {singleAddress[0]?.area}, {singleAddress[0]?.landmark},{' '}
                      {singleAddress[0]?.locality}, {singleAddress[0]?.city},
                      {singleAddress[0]?.state} -{' '}
                      <b>{singleAddress[0]?.pincode}</b>
                    </div>
                  </div>
                  <button
                    className='chnage'
                    onClick={() => setAllAddress(true)}>
                    Chnage
                  </button>
                </div>

                {/* <div className='editBtn'>Edit</div> */}
              </label>
            </div>
          )}
        </div>
        {allAddress && (
          <>
            {!addAddress ? (
              <div onClick={newAddrss} className='newAddress'>
                + <span className='newAddressSpan'>Add a new address</span>
              </div>
            ) : (
              <div className='newAddress'>
                <span className='newAddressSpan'>
                  <MdRadioButtonChecked /> Add a new address
                </span>
                <form className='form' method='post' onSubmit={handleSubmit}>
                  <div className='row'>
                    <input
                      onChange={handleChange}
                      type='text'
                      placeholder='Name'
                      name='name'
                      required
                      value={addressValue.newAddress.name}
                    />
                    <input
                      onChange={handleChange}
                      type='text'
                      placeholder='10-digit mobile number'
                      name='mobileNo'
                      value={addressValue.newAddress.mobileNo}
                    />
                  </div>
                  <div className='row'>
                    <input
                      onChange={handleChange}
                      type='text'
                      placeholder='Pincode'
                      name='pincode'
                      value={addressValue.newAddress.pincode}
                    />
                    <input
                      onChange={handleChange}
                      type='text'
                      placeholder='locality'
                      name='locality'
                      value={addressValue.newAddress.locality}
                    />
                  </div>
                  <div className='row'>
                    <textarea
                      type='text'
                      className='area'
                      placeholder='Address (Area and Street)'
                      name='area'
                      value={addressValue.newAddress.area}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='row'>
                    <input
                      onChange={handleChange}
                      type='text'
                      placeholder='City/Distict/Town'
                      name='city'
                      value={addressValue.newAddress.city}
                    />
                    <select
                      onChange={handleChange}
                      name='state'
                      value={addressValue.newAddress.state}>
                      <option value=''>Select State</option>
                      {staetArray.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='row'>
                    <input
                      onChange={handleChange}
                      type='text'
                      placeholder='Landmark (Optional)'
                      name='landmark'
                      value={addressValue.newAddress.landmark}
                    />
                    <input
                      onChange={handleChange}
                      type='text'
                      placeholder='Alternate Phone (OPtional)'
                      name='alternatePhoneNo'
                      value={addressValue.newAddress.alternatePhoneNo}
                    />
                  </div>

                  <div className='editaddressType'>
                    <p>Address Type</p>
                    <input
                      onChange={handleChange}
                      type='radio'
                      id='home'
                      name='addressType'
                      value='Home'
                      checked={addressValue.newAddress.addressType === 'Home'}
                    />
                    <label htmlFor='home'>Home (All day delivery)</label>

                    <input
                      onChange={handleChange}
                      type='radio'
                      id='work'
                      name='addressType'
                      value='Work'
                      checked={addressValue.newAddress.addressType === 'Work'}
                    />
                    <label htmlFor='work'>
                      Work (Delivery between 10 AM - 5 PM)
                    </label>

                    <div className='btnDiv'>
                      <button className='saveBtn' type='submit'>
                        Save and Deliver Here
                      </button>
                      <button
                        className='cancleBtn'
                        onClick={() => setAddAddress(false)}>
                        Cancle
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Address;
