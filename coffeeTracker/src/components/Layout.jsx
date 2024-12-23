import { useAuth } from "../context/AuthContext";
import Authentication from "./Authentication";
import Modal from "./Modal";
import { useState } from "react";

export default function Layout(props) {
  const { children } = props;

  const [showModal, setShowModal] = useState(false);

  const { globalUser, logout } = useAuth();

  const header = (
    <header>
      <div>
        <h1 className="text-gradient">CAFFIEND</h1>
        <p>For Coffee Insatiates</p>
      </div>
      {globalUser ? (
        <button onClick={logout}>
          <p>Log out</p>
        </button>
      ) : (
        <button onClick={() => setShowModal(true)}>
          <p>Sign Up </p>
          <i className="fa-solid fa-mug-hot"></i>
        </button>
      )}
    </header>
  );

  const footer = (
    <footer>
      <p>
        <span className="text-gradient">Caffiend</span> was made by{" "}
        <a href="https://github.com/NotShine" target="_blank">
          thatGreatSloth
        </a>{" "}
        <br /> with significant referencing to youtuber{" "}
        <a href="https://smoljames.com/">SmolJames</a>
        <br /> using the{" "}
        <a href="https://www.fantacss.smoljames.com" target="_blank">
          FantaCSS
        </a>{" "}
        design library.
      </p>
    </footer>
  );

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
      {header}
      <main>{children}</main>
      {footer}
    </>
  );
}
