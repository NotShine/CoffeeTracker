import { coffeeOptions } from "../utils";
import { useState } from "react";
import Authentication from "./Authentication";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function CoffeeForm(props) {
  const { isAuthenticated } = props;
  const [showModal, setShowModal] = useState(false);
  const [selectedCoffee, setSelectedCoffee] = useState(null);
  const [showCoffeeTypes, setShowCoffeeTypes] = useState(false);
  const [coffeeCost, setCoffeeCost] = useState(0);
  const [hour, setHour] = useState(0);
  const [min, setMin] = useState(0);

  const { globalData, globalUser, setGlobalData } = useAuth();

  async function handleSubmitForm() {
    if (!isAuthenticated) {
      setShowModal(true);
      return;
    }

    //define guard clause so that completed form is submitted
    if (!selectedCoffee) {
      return;
    }

    try {
      //then we're creating a new data object
      const newGlobalData = {
        ...(globalData || {}),
      };
      const nowTime = Date.now();
      const timeToSubtract = hour * 60 * 60 * 1000 + min * 60 * 1000;
      const timestamp = nowTime - timeToSubtract;

      const newData = {
        name: selectedCoffee,
        cost: coffeeCost,
      };
      newGlobalData[timestamp] = newData;

      console.log(timestamp, selectedCoffee, coffeeCost);

      //update the global state
      setGlobalData(newGlobalData);

      //persist the data in firebase firestore

      const userRef = doc(db, "users", globalUser.uid);
      const res = await setDoc(
        userRef,
        {
          [timestamp]: newData,
        },
        { merge: true }
      ); //merge existing db instad of overrdining

      setSelectedCoffee(null);
      setHour(0);
      setMin(0);
      setCoffeeCost(0);
    } catch (err) {
      console.log(err.message);
    }
  }
    function handleCloseModal() {
      setShowModal(false);
    }

    return (
      <>
        {showModal && (
          <Modal handleCloseModal={handleCloseModal}>
            <Authentication handleCloseModal={handleCloseModal} />
          </Modal>
        )}
        <div className="section-header">
          <i className="fa-solid fa-pencil" />
          <h2>Start Tracking Today</h2>
        </div>
        <h4>Select Coffee Type</h4>
        <div className="coffee-grid">
          {coffeeOptions.slice(0, 5).map((option, optionIndex) => {
            return (
              <button
                onClick={() => {
                  setSelectedCoffee(option.name);
                  setShowCoffeeTypes(false);
                }}
                className={
                  "button-card " +
                  (option.name === selectedCoffee
                    ? " coffee-button-selected"
                    : " ")
                }
                key={optionIndex}
              >
                {" "}
                {/*if selected coffee is the same as the coffee type being mapped*/}
                <h4>{option.name}</h4>
                <p>{option.caffeine}mg</p>
              </button>
            );
          })}
          <button
            onClick={() => {
              setShowCoffeeTypes(true);
              setSelectedCoffee(null); // if either of the 5 primary types were selected, this de-selects this
            }}
            className={
              "button-card " +
              (showCoffeeTypes ? " coffee-button-selected" : " ")
            }
          >
            <h4>Others</h4>
            <p>...</p>
          </button>
        </div>
        {/**this ensures that input is displayed only when other is selected. */}
        {showCoffeeTypes && (
          <select
            onChange={(e) => {
              setSelectedCoffee(e.target.value);
            }}
            id="coffee-list"
            name="coffee-list"
          >
            <option value={null}>Selecte type</option>
            {coffeeOptions.map((option, optionIndex) => {
              return (
                <option key={optionIndex} value={option.name}>
                  {option.name} {option.caffeine}mg
                </option>
              );
            })}
          </select>
        )}
        <h4>Add the cost ($)</h4>
        <input
          className="w-full"
          type="number"
          value={coffeeCost}
          onChange={(e) => {
            setCoffeeCost(e.target.value);
          }}
          placeholder="4.50"
        />
        <h4>Time since consumption</h4>
        <div className="time-entry">
          <div>
            <h6>hour</h6>
            <select
              onChange={(e) => {
                setHour(e.target.value);
              }}
              id="hour-select"
            >
              {[
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                18, 19, 20, 21, 22, 23,
              ].map((hour, hourIndex) => {
                return (
                  <option key={hourIndex} value={hour}>
                    {" "}
                    {hour}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <h6>Minutes</h6>
            <select
              onChange={(e) => {
                setMin(e.target.value);
              }}
              id="minutes-select"
            >
              {[0, 5, 10, 15, 30, 45].map((mins, minsIndex) => {
                return (
                  <option key={minsIndex} value={mins}>
                    {" "}
                    {mins}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <button onClick={handleSubmitForm}>
          <p>Add Entry</p>
        </button>
      </>
    );
  }

