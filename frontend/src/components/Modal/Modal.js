import './Modal.css';

const Modal = props => (
    <div className="modal">
        <header>
            <h1>{props.title}</h1>
        </header>
        <section className="modal__content">
            {props.children}
        </section>
        <section className="modal__action">
            <button onClick={props.onCancel}>Cancel</button>
            <button onClick={props.onConfirm}>{props.secondBtnText}</button>
        </section>
    </div>
);

export default Modal;